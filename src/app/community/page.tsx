"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, Search, MapPin, Plane, Hotel, Loader2, Wallet, Plus, Sparkles } from "lucide-react";

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
  const [page, setPage] = useState(0);
  const ITEMS_PER_LOAD = 10;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPlans(0);
  }, []);

  const fetchPlans = async (currentPage: number) => {
    if (currentPage === 0) setLoading(true);
    else setLoadingMore(true);

    const from = currentPage * ITEMS_PER_LOAD;
    const to = from + ITEMS_PER_LOAD - 1;

    const { data, error } = await supabase
      .from("community_plans")
      .select("id, destination, days, companion, style, budget, include_flight, include_accommodation, plan_data->title, created_at")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (data) {
        if (currentPage === 0) {
            setPlans(data as any);
        } else {
            setPlans(prev => [...prev, ...(data as any)]);
        }
        if (data.length < ITEMS_PER_LOAD) setHasMore(false);
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

  const filteredPlans = plans.filter(plan => 
    plan.destination.includes(searchTerm) || 
    plan.style.includes(searchTerm) ||
    plan.companion.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative z-10 flex flex-col items-center">
      
      <div className="w-full max-w-3xl px-6 flex-grow pt-6">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/" className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm shrink-0 group">
              <ChevronLeft size={20} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">여행자 라운지</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">다른 여행자들의 리얼한 일정과 예산을 확인하세요</p>
            </div>
          </div>

          <form onSubmit={(e)=>e.preventDefault()} className="relative w-full md:w-72 group">
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
              <Sparkles size={18} /> 내 일정 만들고 자랑하기
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {filteredPlans.map((plan) => (
                <Link 
                    href={`/community/${plan.id}`}
                    key={plan.id} 
                    className="bg-white rounded-[2rem] p-1 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1.5 hover:shadow-xl transition-all group flex flex-col h-full cursor-pointer"
                >
                    <div className="p-5 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin size={10} /> Destination</span>
                                <span className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{plan.destination}</span>
                            </div>
                            <div className="flex gap-1.5">
                                {plan.include_flight && <div className="w-7 h-7 bg-slate-50 rounded-full flex items-center justify-center text-slate-400" title="항공권 포함"><Plane size={12} /></div>}
                                {plan.include_accommodation && <div className="w-7 h-7 bg-slate-50 rounded-full flex items-center justify-center text-slate-400" title="숙소 포함"><Hotel size={12} /></div>}
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex-1">
                            <h3 className="font-bold text-slate-700 text-sm leading-relaxed line-clamp-2 mb-3">"{plan.plan_data?.title || `${plan.destination} 일정`}"</h3>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center px-2 py-1 bg-white border border-slate-100 rounded-md text-[10px] font-bold text-slate-500 shadow-sm">{plan.days}</span>
                                <span className="inline-flex items-center px-2 py-1 bg-white border border-slate-100 rounded-md text-[10px] font-bold text-slate-500 shadow-sm">{plan.companion}</span>
                                <span className="inline-flex items-center px-2 py-1 bg-white border border-slate-100 rounded-md text-[10px] font-bold text-slate-500 shadow-sm">{plan.style}</span>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-between items-center border-t border-slate-50">
                            <span className="text-[10px] text-slate-400 font-medium">{new Date(plan.created_at).toLocaleDateString()}</span>
                            <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                                <Wallet size={12} />
                                <span className="text-xs font-black">{plan.budget === "미정" ? "예산 미정" : `${plan.budget}`}</span>
                            </div>
                        </div>
                    </div>
                </Link>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8 pb-8">
                    <button onClick={loadMore} disabled={loadingMore} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50">
                        {loadingMore ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} 더 보기
                    </button>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}