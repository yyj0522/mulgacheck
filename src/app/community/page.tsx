"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import WingBanners from "@/components/WingBanners";
import Link from "next/link";
import { 
  ChevronLeft, Search, Calendar, Users, Sparkles, 
  MapPin, X, Copy, Plane, Hotel, Loader2, Wallet, Plus 
} from "lucide-react";
import { BOTTOM_ADS } from "@/data/adData";

type CommunityPlan = {
  id: string;
  destination: string;
  days: string;
  companion: string;
  style: string;
  budget: string;
  include_flight: boolean;
  include_accommodation: boolean;
  plan_data: any;
  created_at: string;
};

export default function CommunityPage() {
  const [plans, setPlans] = useState<CommunityPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<CommunityPlan | null>(null);
  const [bottomAd, setBottomAd] = useState(BOTTOM_ADS[0]);
  const [page, setPage] = useState(0);
  const ITEMS_PER_LOAD = 10;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setBottomAd(BOTTOM_ADS[Math.floor(Math.random() * BOTTOM_ADS.length)]);
    fetchPlans(0);
  }, []);

  const fetchPlans = async (currentPage: number) => {
    if (currentPage === 0) setLoading(true);
    else setLoadingMore(true);

    const from = currentPage * ITEMS_PER_LOAD;
    const to = from + ITEMS_PER_LOAD - 1;

    const { data, error } = await supabase
      .from("community_plans")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (data) {
        if (currentPage === 0) {
            setPlans(data);
        } else {
            setPlans(prev => [...prev, ...data]);
        }
        
        if (data.length < ITEMS_PER_LOAD) {
            setHasMore(false);
        }
    }
    
    if (error) console.error(error);
    setLoading(false);
    setLoadingMore(false);
  };

  const loadMore = () => {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPlans(nextPage);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredPlans = plans.filter(plan => 
    plan.destination.includes(searchTerm) || 
    plan.style.includes(searchTerm) ||
    plan.companion.includes(searchTerm)
  );

  const handleCopyPlan = () => {
    if (!selectedPlan) return;
    const planData = selectedPlan.plan_data;
    
    let text = `[${planData.title}]\n여행지: ${selectedPlan.destination}\n예상 비용: ${planData.total_estimated_cost || "미정"}\n\n`;
    
    planData.itinerary.forEach((day: any) => {
      text += `📅 Day ${day.day} (${day.day_cost || ""})\n`;
      day.schedule.forEach((item: any) => {
        text += `${item.time} | ${item.place}\n  - ${item.desc}\n`;
      });
      text += `\n`;
    });
    
    navigator.clipboard.writeText(text);
    alert("일정이 텍스트로 복사되었습니다!");
  };

  return (
    // min-h-screen과 flex-col을 사용하여 전체 높이 확보 및 수직 배치
    <div className="min-h-screen bg-[#F8FAFC] relative z-10 flex flex-col items-center">
      <WingBanners />
      
      {/* flex-grow: 컨텐츠가 적을 때 남은 공간을 모두 차지하여 배너를 하단으로 밀어냄 */}
      <div className="w-full max-w-3xl px-6 flex-grow pt-6">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/" className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm shrink-0 group">
              <ChevronLeft size={20} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                여행자 라운지
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">다른 여행자들의 리얼한 일정과 예산을 확인하세요</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-72 group">
            <input 
              type="text" 
              placeholder="여행지, 스타일 검색..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
          </form>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
            <p className="text-slate-400 font-bold text-sm">최신 여행 정보를 불러오고 있어요...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="text-5xl mb-6 opacity-80">✈️</div>
            <p className="text-slate-800 font-black text-xl mb-2">아직 등록된 여행 일정이 없네요.</p>
            <p className="text-slate-400 text-sm mb-8">첫 번째 여행자가 되어보세요!</p>
            <Link href="/plan" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all hover:-translate-y-1 shadow-lg shadow-indigo-200">
              <Sparkles size={18} />
              내 일정 만들고 자랑하기
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {filteredPlans.map((plan) => (
                <div 
                    key={plan.id} 
                    onClick={() => setSelectedPlan(plan)}
                    className="bg-white rounded-[2rem] p-1 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1.5 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
                >
                    <div className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                            <MapPin size={10} /> Destination
                        </span>
                        <span className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {plan.destination}
                        </span>
                        </div>
                        <div className="flex gap-1.5">
                        {plan.include_flight && (
                            <div className="w-7 h-7 bg-slate-50 rounded-full flex items-center justify-center text-slate-400" title="항공권 포함">
                            <Plane size={12} />
                            </div>
                        )}
                        {plan.include_accommodation && (
                            <div className="w-7 h-7 bg-slate-50 rounded-full flex items-center justify-center text-slate-400" title="숙소 포함">
                            <Hotel size={12} />
                            </div>
                        )}
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex-1">
                        <h3 className="font-bold text-slate-700 text-sm leading-relaxed line-clamp-2 mb-3">
                        "{plan.plan_data.title || `${plan.destination} 여행`}"
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center px-2 py-1 bg-white border border-slate-100 rounded-md text-[10px] font-bold text-slate-500 shadow-sm">
                            {plan.days}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-white border border-slate-100 rounded-md text-[10px] font-bold text-slate-500 shadow-sm">
                            {plan.companion}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-white border border-slate-100 rounded-md text-[10px] font-bold text-slate-500 shadow-sm">
                            {plan.style}
                        </span>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center border-t border-slate-50">
                        <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(plan.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                        <Wallet size={12} />
                        <span className="text-xs font-black">
                            {plan.budget === "미정" ? "예산 미정" : `${plan.budget}`}
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={loadMore} 
                        disabled={loadingMore}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50"
                    >
                        {loadingMore ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                        더 보기
                    </button>
                </div>
            )}
          </>
        )}
      </div>

      {/* 하단 배너: mt-4(16px), mb-4(16px) -> 컨텐츠-16-배너-16-푸터(끝) */}
      <div className="w-full flex justify-center mt-4 mb-4 px-4 min-[1400px]:hidden flex-shrink-0">
         {bottomAd.pcImg && (
           <div className="hidden md:block w-full max-w-[728px] shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
             <a href={bottomAd.link} target="_blank" rel="noopener noreferrer nofollow">
               <img src={bottomAd.pcImg} alt={bottomAd.name} width={728} height={90} className="w-full h-auto" />
             </a>
             {bottomAd.pcTrack && <img src={bottomAd.pcTrack} width="1" height="1" className="hidden" alt="" />}
           </div>
         )}
         {bottomAd.moImg && (
           <div className="block md:hidden w-full shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
             <a href={bottomAd.moLink || bottomAd.link} target="_blank" rel="noopener noreferrer nofollow">
               <img src={bottomAd.moImg} alt={bottomAd.name} width={468} height={60} className="w-full h-auto" />
             </a>
             {bottomAd.moTrack && <img src={bottomAd.moTrack} width="1" height="1" className="hidden" alt="" />}
           </div>
         )}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#F8FAFC] rounded-[2.5rem] w-full max-w-xl max-h-[85vh] shadow-2xl relative flex flex-col overflow-hidden animate-scale-up">
            
            <div className="bg-white p-6 border-b border-slate-100 flex justify-between items-start shrink-0">
              <div className="pr-8">
                <div className="flex flex-wrap gap-2 mb-3">
                   <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                     {selectedPlan.destination}
                   </span>
                   <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold">
                     {selectedPlan.days}
                   </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  {selectedPlan.plan_data.title}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="p-2.5 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
               <div className="mb-8 p-1 bg-white rounded-3xl border border-slate-100 shadow-sm">
                 <div className="grid grid-cols-3 divide-x divide-slate-50">
                    <div className="p-4 text-center">
                       <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">WITH</p>
                       <p className="text-sm font-bold text-slate-800">{selectedPlan.companion}</p>
                    </div>
                    <div className="p-4 text-center">
                       <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">STYLE</p>
                       <p className="text-sm font-bold text-slate-800">{selectedPlan.style}</p>
                    </div>
                    <div className="p-4 text-center">
                       <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">BUDGET</p>
                       <p className="text-sm font-black text-indigo-600">{selectedPlan.budget}</p>
                    </div>
                 </div>
                 {selectedPlan.plan_data.total_estimated_cost && (
                    <div className="border-t border-slate-50 p-4 bg-slate-50/50 rounded-b-[20px] text-center">
                        <span className="text-xs font-bold text-slate-500">AI 예상 비용: </span>
                        <span className="text-sm font-black text-slate-800">{selectedPlan.plan_data.total_estimated_cost}</span>
                    </div>
                 )}
               </div>

               <div className="space-y-8">
                  {selectedPlan.plan_data.itinerary.map((day: any) => (
                    <div key={day.day} className="relative pl-6 border-l-2 border-slate-100 last:border-0 pb-2">
                       <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-sm"></div>
                       <div className="flex justify-between items-center mb-4">
                          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                            Day {day.day}
                          </h3>
                          {day.day_cost && <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-1 rounded-md">{day.day_cost}</span>}
                       </div>
                       
                       <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-5">
                          {day.schedule.map((item: any, i: number) => (
                             <div key={i} className="flex gap-4">
                                <span className="text-xs font-bold text-indigo-500 shrink-0 w-10 text-right pt-0.5">{item.time}</span>
                                <div className="flex-1">
                                   <p className="font-bold text-slate-800 text-sm mb-1">{item.place}</p>
                                   <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl">
                                     {item.desc}
                                   </p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-5 bg-white border-t border-slate-100 shrink-0">
               <button 
                 onClick={handleCopyPlan}
                 className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-xl shadow-slate-200"
               >
                 <Copy size={18} /> 이 일정 복사하기
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}