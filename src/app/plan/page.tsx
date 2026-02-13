"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabase";
import { BOTTOM_ADS, GRID_ADS } from "@/data/adData";
import WingBanners from "@/components/WingBanners";
import { 
  Users, Calendar, Sparkles, MapPin, RefreshCw, AlertCircle, 
  MessageSquarePlus, ChevronLeft, 
  Copy, Share2, Edit3, ChevronRight, Loader2, AlertTriangle,
  Plane, Hotel, Wallet, Globe2
} from "lucide-react";
import Link from "next/link";

type ScheduleItem = {
  time: string;
  place: string;
  desc: string;
};

type DayPlan = {
  day: number;
  day_cost?: string;
  schedule: ScheduleItem[];
};

type TripResult = {
  title: string;
  total_estimated_cost?: string;
  itinerary: DayPlan[];
};

type TripData = {
  destination: string;
  days: string;
  companion: string;
  style: string;
  budget: string;
  includeFlight: boolean;
  includeAccommodation: boolean;
  prompt: string;
};

function PlanPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareId = searchParams.get("shareId");

  const [step, setStep] = useState<"INPUT" | "LOADING" | "RESULT">("INPUT");
  const [formData, setFormData] = useState<TripData>({
    destination: "",
    days: "3박 4일",
    companion: "연인과",
    style: "맛집 투어",
    budget: "",
    includeFlight: false,
    includeAccommodation: false,
    prompt: "",
  });
  
  const [result, setResult] = useState<TripResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [bottomAd, setBottomAd] = useState(BOTTOM_ADS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [isRegeneratingDay, setIsRegeneratingDay] = useState<number | null>(null);

  const [isLimitReached, setIsLimitReached] = useState(false);

  const isSharedMode = !!shareId;

  useEffect(() => {
    setBottomAd(BOTTOM_ADS[Math.floor(Math.random() * BOTTOM_ADS.length)]);
    
    if (shareId) {
      loadSharedPlan(shareId);
    }
  }, [shareId]);

  const loadSharedPlan = async (id: string) => {
    setStep("LOADING");
    const { data, error } = await supabase
      .from("saved_plans")
      .select("plan_data, destination")
      .eq("id", id)
      .single();

    if (data && !error) {
      setResult(data.plan_data);
      setFormData(prev => ({ ...prev, destination: data.destination }));
      setStep("RESULT");
    } else {
      alert("유효하지 않거나 삭제된 일정입니다.");
      setStep("INPUT");
    }
  };

  const handleGenerate = async () => {
    if (!formData.destination) {
      alert("여행지를 입력해주세요.");
      return;
    }

    setStep("LOADING");
    setErrorMsg("");
    setIsLimitReached(false);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 429) {
        setIsLimitReached(true);
        return; 
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "오류 발생");

      setResult(data);
      setCurrentPage(1); 
      setStep("RESULT");
    } catch (err: any) {
      setErrorMsg(err.message);
      setStep("INPUT");
    }
  };

  const handleRegenerateDay = async () => {
    if (!editingDay || !result) return;
    
    setIsRegeneratingDay(editingDay);
    setEditingDay(null); 

    try {
      const targetDayData = result.itinerary.find(d => d.day === editingDay);
      
      const res = await fetch("/api/regenerate-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: editingDay,
          currentSchedule: targetDayData,
          prompt: editPrompt,
          destination: formData.destination,
          style: formData.style
        }),
      });

      if (res.status === 429) {
         alert("현재 이용자가 많아 AI가 응답할 수 없습니다. 잠시 후 다시 시도해주세요.");
         return;
      }

      const newDayData: DayPlan = await res.json();

      if (!newDayData || !Array.isArray(newDayData.schedule)) {
          alert("일정을 생성하지 못했습니다. 다시 시도해주세요.");
          return;
      }

      setResult(prev => {
        if (!prev) return null;
        return {
          ...prev,
          itinerary: prev.itinerary.map(item => 
            item.day === editingDay ? newDayData : item
          )
        };
      });

    } catch (e) {
      alert("일정 수정 중 오류가 발생했습니다.");
    } finally {
      setIsRegeneratingDay(null);
      setEditPrompt("");
    }
  };

  const handleCopyText = () => {
    if (!result) return;
    
    let text = `[${result.title}]\n여행지: ${formData.destination}\n예상 비용: ${result.total_estimated_cost || "미정"}\n\n`;
    
    result.itinerary.forEach((day) => {
      text += `Day ${day.day} (${day.day_cost || ""})\n`;
      day.schedule.forEach((item) => {
        text += `${item.time} | ${item.place}\n  - ${item.desc}\n`;
      });
      text += `\n`;
    });

    text += `\n✨ AI 여행 일정 생성: 물가체크 (MulgaCheck)`;
    
    navigator.clipboard.writeText(text);
    alert("일정이 텍스트로 복사되었습니다!");
  };

  const handleShareLink = async () => {
    if (!result) return;

    const { data, error } = await supabase
      .from("saved_plans")
      .insert({
        plan_data: result,
        destination: formData.destination
      })
      .select("id")
      .single();

    if (data && !error) {
      const url = `${window.location.origin}/plan?shareId=${data.id}`;
      navigator.clipboard.writeText(url);
      alert("공유 링크가 복사되었습니다! 친구에게 보내보세요.");
    } else {
      alert("공유 링크 생성 실패. 잠시 후 다시 시도해주세요.");
    }
  };

  const handlePublishToCommunity = async () => {
    if (!result) return;
    
    if(!confirm("커뮤니티에 일정을 공개하시겠습니까? (익명으로 등록됩니다)")) return;

    const { error } = await supabase
      .from("community_plans")
      .insert({
        destination: formData.destination,
        days: formData.days,
        companion: formData.companion,
        style: formData.style,
        budget: formData.budget || "미정",
        include_flight: formData.includeFlight,
        include_accommodation: formData.includeAccommodation,
        plan_data: result
      });

    if (!error) {
      alert("커뮤니티에 등록되었습니다! 다른 여행자들에게 큰 도움이 될 거예요.");
    } else {
      console.error(error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const dayOptions = Array.from({ length: 14 }, (_, i) => `${i + 1}박 ${i + 2}일`);

  if (isLimitReached) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center relative z-10">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl max-w-sm w-full animate-fade-in-up border border-indigo-50">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="text-rose-500" size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-3">
                    일시적인 오류 발생
                </h2>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    현재 이용자가 많아 서비스 이용이 제한되었습니다.<br/>
                    <strong>잠시 후(약 1분 뒤)</strong> 다시 시도해주시거나,<br/>
                    내일 다시 이용해주세요.
                </p>
                <div className="space-y-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        다시 시도하기
                    </button>
                    <Link href="/" className="block w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
                        메인으로 이동
                    </Link>
                </div>
            </div>
        </div>
    );
  }

  if (step === "INPUT") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 pb-24 flex flex-col items-center justify-center relative z-10">
        <WingBanners />
        
        <div className="w-full max-w-md">
            <Link href="/" className="inline-flex items-center text-slate-400 font-bold hover:text-indigo-600 transition-colors mb-8">
                <ChevronLeft size={20} /> 메인으로
            </Link>
        </div>

        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 animate-fade-in-up">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-2">Beta</span>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">
              여행 일정<br />
              <span className="text-indigo-600">자동 생성기</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">맞춤형 일정을 계획해드립니다</p>
            <p className="text-slate-400 text-sm mt-2">오류가난다면 다음날 이용 부탁드립니다.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                <MapPin size={14} /> 어디로 가시나요?
              </label>
              <input 
                type="text" 
                placeholder="예: 오사카, 다낭, 파리"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                  <Calendar size={14} /> 기간
                </label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none appearance-none"
                  value={formData.days}
                  onChange={(e) => setFormData({...formData, days: e.target.value})}
                >
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                  <option>15일 이상 (장기)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                  <Users size={14} /> 누구와?
                </label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none appearance-none"
                  value={formData.companion}
                  onChange={(e) => setFormData({...formData, companion: e.target.value})}
                >
                  <option>혼자</option>
                  <option>연인과</option>
                  <option>친구와</option>
                  <option>아이와</option>
                  <option>부모님과</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                <Wallet size={14} /> 1인당 예산 (선택)
              </label>
              <input 
                type="text" 
                placeholder="예: 100만원 (미입력 시 가성비)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors mb-3"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
              <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex-1 justify-center">
                      <input 
                          type="checkbox" 
                          checked={formData.includeFlight}
                          onChange={(e) => setFormData({...formData, includeFlight: e.target.checked})}
                          className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1"><Plane size={12}/> 항공권 포함</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors flex-1 justify-center">
                      <input 
                          type="checkbox" 
                          checked={formData.includeAccommodation}
                          onChange={(e) => setFormData({...formData, includeAccommodation: e.target.checked})}
                          className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1"><Hotel size={12}/> 숙소 포함</span>
                  </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                <Sparkles size={14} /> 여행 스타일
              </label>
              <div className="flex flex-wrap gap-2">
                {["맛집 투어", "힐링/휴양", "관광지 정복", "쇼핑 위주", "가성비"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFormData({...formData, style: tag})}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                      formData.style === tag 
                      ? "bg-indigo-600 text-white border-indigo-600" 
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                <MessageSquarePlus size={14} /> 추가 요청사항 (선택)
              </label>
              <textarea 
                maxLength={200}
                rows={3}
                placeholder="예: 부모님과 함께라서 걷는 일정은 줄여주세요.&#13;&#10;예: 유니버셜 스튜디오는 둘째 날에 꼭 넣어주세요."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-800 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-slate-300"
                value={formData.prompt}
                onChange={(e) => setFormData({...formData, prompt: e.target.value})}
              />
              <div className="text-right text-[10px] text-slate-300 mt-1">
                {formData.prompt.length} / 200
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 text-rose-500 p-4 rounded-xl text-sm font-bold flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {errorMsg}
              </div>
            )}

            <button 
              onClick={handleGenerate}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1"
            >
              일정 생성하기
            </button>
          </div>
        </div>
        
        <div className="w-full max-w-2xl mt-12 flex flex-col items-center">
           {bottomAd.pcImg && (
             <div className="hidden md:block shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
               <a href={bottomAd.link} target="_blank" rel="noopener noreferrer nofollow">
                 <img src={bottomAd.pcImg} alt={bottomAd.name} width={728} height={90} />
               </a>
               <img src={bottomAd.pcTrack} width="1" height="1" className="hidden" alt="" />
             </div>
           )}
           {bottomAd.moImg && (
             <div className="block md:hidden shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
               <a href={bottomAd.moLink} target="_blank" rel="noopener noreferrer nofollow">
                 <img src={bottomAd.moImg} alt={bottomAd.name} width={468} height={60} className="w-full h-auto max-w-[320px] sm:max-w-[468px]" />
               </a>
               <img src={bottomAd.moTrack} width="1" height="1" className="hidden" alt="" />
             </div>
           )}
        </div>
      </div>
    );
  }

  if (step === "LOADING") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center relative z-10">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-6" />
        <h2 className="text-xl font-bold text-slate-900 animate-pulse">
          {shareId ? "공유된 일정을 불러옵니다" : "최적의 경로를 계산 중입니다"}
        </h2>
        <p className="text-slate-400 text-sm mt-2">잠시만 기다려주세요</p>
      </div>
    );
  }

  const totalDays = result?.itinerary.length || 0;
  const totalPages = Math.ceil(totalDays / ITEMS_PER_PAGE);
  const currentItinerary = result?.itinerary.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-4 relative z-10">
      <WingBanners />
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center text-slate-400 font-bold hover:text-indigo-600 transition-colors">
            <ChevronLeft size={20} /> 메인으로
          </Link>
          {!isSharedMode && (
            <button onClick={() => setStep("INPUT")} className="flex items-center text-slate-400 font-bold hover:text-indigo-600">
                <RefreshCw size={18} className="mr-1" /> 다시 하기
            </button>
          )}
        </header>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-2">{result?.title || "나만의 여행 일정"}</h1>
          <p className="text-slate-500 font-medium mb-3">
            {formData.destination} · {formData.days} · {formData.style}
          </p>
          {result?.total_estimated_cost && (
              <div className="inline-block bg-amber-50 text-amber-600 px-4 py-2 rounded-full text-sm font-black border border-amber-100 shadow-sm mb-4">
                  총 예상 비용: {result.total_estimated_cost}
              </div>
          )}
          
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <button 
                onClick={handleCopyText}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-700 text-sm font-bold shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
            >
                <Copy size={16} /> 일정 복사
            </button>
            <button 
                onClick={handleShareLink}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
            >
                <Share2 size={16} /> 링크 공유
            </button>
            {!isSharedMode && (
                <button 
                    onClick={handlePublishToCommunity}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-bold shadow-md shadow-emerald-200 hover:opacity-90 active:scale-95 transition-all"
                >
                    <Globe2 size={16} /> 일정 자랑하기
                </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {currentItinerary?.map((dayPlan) => (
            <div key={dayPlan.day} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative">
              
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-indigo-50">
                <div>
                    <h3 className="font-black text-lg text-indigo-600 flex items-center gap-2 mb-1">
                        <span className="bg-indigo-50 px-3 py-1 rounded-lg text-sm border border-indigo-100">Day {dayPlan.day}</span>
                    </h3>
                    {dayPlan.day_cost && (
                        <p className="text-xs font-bold text-slate-400">{dayPlan.day_cost}</p>
                    )}
                </div>
                {!isSharedMode && (
                    <button 
                        onClick={() => setEditingDay(dayPlan.day)}
                        className="text-slate-300 hover:text-indigo-600 transition-colors p-1"
                        title="이 날짜만 다시 만들기"
                    >
                        <Edit3 size={18} />
                    </button>
                )}
              </div>

              {isRegeneratingDay === dayPlan.day && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[2rem]">
                      <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
                      <span className="text-xs font-bold text-indigo-600">일정 수정 중...</span>
                  </div>
              )}

              <div className="space-y-8 pl-4">
                {dayPlan.schedule?.map((item, i) => (
                  <div key={i} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md mb-2 w-max">
                            {item.time}
                        </div>
                        <div className="w-0.5 h-full bg-slate-100 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white border-[3px] border-indigo-400" />
                        </div>
                    </div>
                    
                    <div className="flex-1 pb-4">
                      <h4 className="font-bold text-slate-800 text-base">{item.place}</h4>
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mb-12">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full bg-white border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-bold text-slate-500">{currentPage} / {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full bg-white border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        )}

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-4 mt-4 pt-8">
          <div className="text-center mb-6">
            <h3 className="font-black text-xl text-slate-900 mb-2">여행 전, 놓치신 건 없으신가요?</h3>
            <p className="text-sm text-slate-400">최저가 예약으로 경비를 아껴보세요</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {GRID_ADS.map((ad) => (
              <a 
                key={ad.id} 
                href={ad.link} 
                target="_blank" 
                rel="noopener noreferrer nofollow"
                className="group flex flex-col items-center bg-white border border-slate-100 rounded-xl p-3 hover:shadow-lg transition-all hover:-translate-y-1 w-[140px]"
              >
                <img src={ad.trackingUrl} width="1" height="1" className="hidden" alt="" />
                <div className="w-[120px] h-[60px] flex items-center justify-center mb-2">
                   <img src={ad.imgUrl} alt={ad.name} width={120} height={60} className="object-contain max-w-full max-h-full" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors text-center break-keep leading-tight px-1">
                    {ad.name}
                </span>
              </a>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-300">
                이 사이트 제휴 마케팅 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </div>
        </div>

        <div className="mt-0 mb-4 flex flex-col items-center">
           {bottomAd.pcImg && (
             <div className="hidden md:block shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
               <a href={bottomAd.link} target="_blank" rel="noopener noreferrer nofollow">
                 <img src={bottomAd.pcImg} alt={bottomAd.name} width={728} height={90} />
               </a>
               <img src={bottomAd.pcTrack} width="1" height="1" className="hidden" alt="" />
             </div>
           )}
           {bottomAd.moImg && (
             <div className="block md:hidden shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
               <a href={bottomAd.moLink} target="_blank" rel="noopener noreferrer nofollow">
                 <img src={bottomAd.moImg} alt={bottomAd.name} width={468} height={60} className="w-full h-auto max-w-[320px] sm:max-w-[468px]" />
               </a>
               <img src={bottomAd.moTrack} width="1" height="1" className="hidden" alt="" />
             </div>
           )}
        </div>

      </div>

      {editingDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white rounded-[2rem] p-6 w-full max-w-md shadow-2xl relative">
                  <h3 className="font-black text-lg text-slate-900 mb-4 text-center">
                      Day {editingDay} 일정 수정하기
                  </h3>
                  <textarea 
                      className="w-full bg-slate-50 border-0 rounded-xl p-4 text-sm mb-4 h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      placeholder="예: 저녁을 스시 오마카세로 바꿔줘.&#13;&#10;예: 오전 일정을 조금 더 여유롭게 조정해줘."
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                  />
                  <div className="flex gap-2">
                      <button 
                          onClick={() => setEditingDay(null)}
                          className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200"
                      >
                          취소
                      </button>
                      <button 
                          onClick={handleRegenerateDay}
                          className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700"
                      >
                          수정 요청
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense>
      <PlanPageContent />
    </Suspense>
  );
}