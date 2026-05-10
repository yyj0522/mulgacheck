"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabase";
import { 
  Users, Calendar, Sparkles, MapPin, RefreshCw, AlertCircle, 
  MessageSquarePlus, ChevronLeft, 
  Copy, Share2, Edit3, ChevronRight, Loader2,
  Plane, Hotel, Globe2, ArrowRight, X, ShieldCheck, Clock, Map, Wallet
} from "lucide-react";
import Link from "next/link";
import Turnstile from "react-turnstile";

type ScheduleItem = {
  time: string;
  place: string;
  desc: string;
  imgUrl?: string; 
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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [isRegeneratingDay, setIsRegeneratingDay] = useState<number | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [captchaMode, setCaptchaMode] = useState<"GENERATE" | "REGENERATE" | null>(null);
  const isSharedMode = !!shareId;

  useEffect(() => {
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

  const handleGenerateClick = () => {
    if (!formData.destination) {
        alert("여행지를 입력해주세요.");
        return;
    }
    setCaptchaMode("GENERATE");
    setIsCaptchaOpen(true);
  };

  const handleRegenerateClick = () => {
    if (!editingDay || !result) return;
    executeRegenerate();
  };

  const handleCaptchaSuccess = (token: string) => {
    setIsCaptchaOpen(false); 
    
    if (captchaMode === "GENERATE") {
        executeGenerate(token);
    }
  };

  const executeGenerate = async (token: string) => {
    setStep("LOADING");
    setErrorMsg("");
    setIsLimitReached(false);

    try {
      let finalBudget = formData.budget.trim();
      const cleanBudget = finalBudget.replace(/,/g, "");

      if (cleanBudget && /^[0-9]+$/.test(cleanBudget)) {
          finalBudget = `${cleanBudget}만원`;
      } else if (finalBudget.endsWith("만")) {
          finalBudget = `${finalBudget}원`;
      }

      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, budget: finalBudget, turnstileToken: token }),
      });

      if (res.status === 429) {
        setIsLimitReached(true);
        return; 
      }

      if (res.status === 403) {
        alert("보안 검증에 실패했습니다. 다시 시도해주세요.");
        setStep("INPUT");
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

  const executeRegenerate = async () => {
    setIsRegeneratingDay(editingDay);
    setEditingDay(null); 

    try {
      const targetDayData = result?.itinerary.find(d => d.day === editingDay);
      
      const res = await fetch("/api/regenerate-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: editingDay,
          currentSchedule: targetDayData,
          prompt: editPrompt,
          destination: formData.destination,
          style: formData.style,
        }),
      });

      if (res.status === 429) {
         alert("현재 이용자가 많아 AI가 응답할 수 없습니다. 잠시 후 다시 시도해주세요.");
         return;
      }

      if (res.status === 403) {
         alert("보안 검증에 실패했습니다. 다시 시도해주세요.");
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

    text += `\nAI 여행 일정 생성: 물가체크 (MulgaCheck)`;
    
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
      const shareData = {
        title: `[물가체크] ${formData.destination} 여행 일정`,
        text: `AI가 생성한 ${formData.destination} ${formData.days} 여행 일정을 확인해보세요!`,
        url: url
      };

      if (navigator.share && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log(err);
        }
      } else {
        navigator.clipboard.writeText(url);
        alert("공유 링크가 복사되었습니다! 친구에게 보내보세요.");
      }
    } else {
      alert("공유 링크 생성 실패. 잠시 후 다시 시도해주세요.");
    }
  };

  const handlePublishToCommunity = async () => {
    if (!result) return;
    
    if(!confirm("일정을 공개하시겠습니까? (익명으로 등록됩니다)")) return;

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
      alert("일정이 공유되었습니다!");
    } else {
      console.error(error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const dayOptions = Array.from({ length: 14 }, (_, i) => `${i + 1}박 ${i + 2}일`);

  if (isLimitReached) {
    return (
        <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200/60 max-w-sm w-full animate-fade-in-up">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Clock className="text-slate-600" size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                    일일 제한 횟수 초과
                </h2>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                    하루 3회까지 무료로 생성할 수 있습니다.<br/>
                    오늘의 사용량을 모두 소진하셨네요.<br/>
                    <strong>내일 다시 방문해주세요!</strong>
                </p>
                <div className="space-y-3">
                    <Link href="/" className="block w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md">
                        메인으로 이동
                    </Link>
                </div>
            </div>
        </div>
    );
  }

  if (step === "INPUT") {
    return (
      <div className="min-h-screen bg-[#F5F7FA] font-sans">
        <main className="w-full max-w-[800px] mx-auto px-4 sm:px-6 pt-8 pb-24">
            <header className="mb-8 flex flex-col items-start gap-2">
                <Link href="/" className="inline-flex items-center text-slate-500 font-bold hover:text-slate-900 transition-colors mb-4 bg-white px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm">
                    <ChevronLeft size={18} className="mr-1" /> 메인으로
                </Link>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">AI 일정 생성</h1>
                <p className="text-slate-500 text-sm font-medium">예산과 취향에 맞춘 최적의 여행 코스를 만들어드려요.</p>
            </header>

            <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-200/60 mb-8 animate-fade-in-up">
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-3 tracking-wider">
                    <MapPin size={16} className="inline mr-1 text-indigo-500" /> 어디로 가시나요?
                  </label>
                  <input 
                    type="text" 
                    placeholder="예: 오사카, 다낭, 파리"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-3 tracking-wider">
                      <Calendar size={16} className="inline mr-1 text-indigo-500" /> 기간
                    </label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 appearance-none"
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
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-3 tracking-wider">
                      <Users size={16} className="inline mr-1 text-indigo-500" /> 누구와?
                    </label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 appearance-none"
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-3 tracking-wider">
                    <Wallet size={16} className="inline mr-1 text-indigo-500" /> 1인당 예산 (선택)
                  </label>
                  <input 
                    type="text" 
                    placeholder="예: 150 (단위: 만원)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all mb-4"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                  <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors flex-1 justify-center">
                          <input 
                              type="checkbox" 
                              checked={formData.includeFlight}
                              onChange={(e) => setFormData({...formData, includeFlight: e.target.checked})}
                              className="w-4 h-4 accent-indigo-600 rounded"
                          />
                          <span className="text-sm font-bold text-slate-700 flex items-center gap-1"><Plane size={14}/> 항공권 포함</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors flex-1 justify-center">
                          <input 
                              type="checkbox" 
                              checked={formData.includeAccommodation}
                              onChange={(e) => setFormData({...formData, includeAccommodation: e.target.checked})}
                              className="w-4 h-4 accent-indigo-600 rounded"
                          />
                          <span className="text-sm font-bold text-slate-700 flex items-center gap-1"><Hotel size={14}/> 숙소 포함</span>
                      </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-3 tracking-wider">
                    <Sparkles size={16} className="inline mr-1 text-indigo-500" /> 여행 스타일
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["맛집 투어", "힐링/휴양", "관광지 정복", "쇼핑 위주", "가성비"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setFormData({...formData, style: tag})}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                          formData.style === tag 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-3 tracking-wider">
                    <MessageSquarePlus size={16} className="inline mr-1 text-indigo-500" /> 추가 요청사항 (선택)
                  </label>
                  <textarea 
                    maxLength={200}
                    rows={3}
                    placeholder="예: 부모님과 함께라서 걷는 일정은 줄여주세요.&#13;&#10;예: 유니버셜 스튜디오는 둘째 날에 꼭 넣어주세요."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-800 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors resize-none placeholder:text-slate-400"
                    value={formData.prompt}
                    onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                  />
                  <div className="text-right text-xs font-bold text-slate-400 mt-2">
                    {formData.prompt.length} / 200
                  </div>
                </div>

                {errorMsg && (
                  <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold flex items-start gap-2">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <button 
                  onClick={handleGenerateClick}
                  className="w-full py-5 bg-indigo-600 text-white text-lg font-black rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  일정 생성하기
                </button>
              </div>
            </div>

            <Link href="/community" className="block bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700">
                            <Globe2 size={28} />
                        </div>
                        <div>
                            <h3 className="text-slate-900 font-black text-lg md:text-xl">여행자 라운지 구경하기</h3>
                            <p className="text-slate-500 text-sm font-medium mt-1">다른 사람들이 생성한 일정과 예산을 확인해보세요.</p>
                        </div>
                    </div>
                    <ChevronRight size={24} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
            </Link>
        </main>
        
        {isCaptchaOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative text-center">
                    <button 
                        onClick={() => setIsCaptchaOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-slate-100 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">보안 확인</h3>
                        <p className="text-sm text-slate-500 font-medium">봇이 아님을 확인해주세요.</p>
                    </div>
                    <div className="flex justify-center">
                        <Turnstile 
                            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                            onVerify={handleCaptchaSuccess}
                            theme="light"
                        />
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  if (step === "LOADING") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#F5F7FA] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full mb-6" />
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
          {shareId ? "일정을 불러오는 중입니다" : "최적의 동선을 설계 중입니다"}
        </h2>
        <p className="text-slate-500 text-sm font-bold">잠시만 기다려주세요</p>
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
    <div className="min-h-screen bg-[#F5F7FA] font-sans">
      <main className="w-full max-w-[1024px] mx-auto px-4 sm:px-6 pt-8 pb-24 flex flex-col">
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center text-slate-500 font-bold hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm">
            <ChevronLeft size={18} className="mr-1" /> 메인으로
          </Link>
          {!isSharedMode && (
            <button onClick={() => setStep("INPUT")} className="flex items-center text-slate-500 font-bold hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm transition-colors">
                <RefreshCw size={16} className="mr-1.5" /> 다시 하기
            </button>
          )}
        </header>

        <div className="mb-10 text-center bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200/60 shadow-sm animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-5">{result?.title || "나만의 여행 일정"}</h1>
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            <span className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-100">{formData.destination}</span>
            <span className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-100">{formData.days}</span>
            <span className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-100">{formData.style}</span>
          </div>
          
          {result?.total_estimated_cost && (
              <div className="inline-block bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl text-lg font-black border border-indigo-100 mb-8">
                  총 예상 비용: {result.total_estimated_cost}
              </div>
          )}
          
          <div className="flex justify-center gap-3 flex-wrap">
            <button 
                onClick={handleCopyText}
                className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-bold shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
            >
                <Copy size={18} /> 일정 텍스트 복사
            </button>
            <button 
                onClick={handleShareLink}
                className="flex items-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 active:scale-95 transition-all"
            >
                <Share2 size={18} /> 링크 공유하기
            </button>
            {!isSharedMode && (
                <button 
                    onClick={handlePublishToCommunity}
                    className="flex items-center gap-2 px-5 py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    <Globe2 size={18} /> 라운지에 자랑하기
                </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {currentItinerary?.map((dayPlan) => (
            <div key={dayPlan.day} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow relative">
              
              <div className="flex justify-between items-start mb-8 pb-4 border-b border-slate-100">
                <div>
                    <h3 className="font-black text-xl text-indigo-600 flex items-center gap-2 mb-1.5">
                        Day {dayPlan.day}
                    </h3>
                    {dayPlan.day_cost && (
                        <p className="text-xs font-bold text-slate-400">{dayPlan.day_cost}</p>
                    )}
                </div>
                {!isSharedMode && (
                    <button 
                        onClick={() => setEditingDay(dayPlan.day)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors p-2 bg-slate-50 rounded-xl hover:bg-indigo-50"
                        title="이 날짜 일정 수정하기"
                    >
                        <Edit3 size={18} />
                    </button>
                )}
              </div>

              {isRegeneratingDay === dayPlan.day && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[2rem]">
                      <Loader2 className="animate-spin text-indigo-600 mb-3" size={36} />
                      <span className="text-sm font-bold text-indigo-600">일정 재구성 중...</span>
                  </div>
              )}

              <div className="space-y-8 pl-2">
                {dayPlan.schedule?.map((item, i) => (
                  <div key={i} className="relative flex gap-5">
                    <div className="flex flex-col items-center">
                        <div className="text-[11px] font-black text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg mb-2 w-max">
                            {item.time}
                        </div>
                        <div className="w-0.5 h-full bg-slate-100 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-indigo-400" />
                        </div>
                    </div>
                    
                    <div className="flex-1 pb-4">
                      <h4 className="font-bold text-slate-900 text-base mb-1.5">{item.place}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-xl bg-white border border-slate-200 disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <ChevronLeft size={20} className="text-slate-600" />
                </button>
                <span className="text-sm font-black text-slate-800 tracking-widest">{currentPage} / {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-xl bg-white border border-slate-200 disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <ChevronRight size={20} className="text-slate-600" />
                </button>
            </div>
        )}

      </main>

      {editingDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
              <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative">
                  <h3 className="font-black text-xl text-slate-900 mb-6 text-center tracking-tight">
                      Day {editingDay} 일정 수정
                  </h3>
                  <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium mb-6 h-32 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none placeholder:text-slate-400"
                      placeholder="예: 저녁 식사를 현지 시장 투어로 변경해주세요.&#13;&#10;예: 오전 일정을 조금 더 여유롭게 조정해주세요."
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                  />
                  <div className="flex gap-3">
                      <button 
                          onClick={() => setEditingDay(null)}
                          className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors"
                      >
                          취소
                      </button>
                      <button 
                          onClick={handleRegenerateClick}
                          className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-md"
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