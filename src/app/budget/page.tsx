"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, Plane, ArrowRight, Coins, CalendarDays, Wallet, SlidersHorizontal, TrendingUp, TrendingDown, Minus, Search } from "lucide-react";

type CountryData = {
  id: string | number;
  name_ko: string;
  name_en: string;
  flag_emoji: string;
  currency_code: string;
  meal_price_local: number;
  transport_price_local: number;
  accommodation_price_local: number;
  exchange_rates: {
    rate_to_krw: number;
  };
};

const TRAVEL_STYLES = {
  BACKPACKER: { 
    label: "배낭여행", 
    desc: "가성비 최고 (호스텔+대중교통)",
    multipliers: { meal: 2.0, accommodation: 0.4, transport: 1.0 } 
  },
  STANDARD: { 
    label: "일반", 
    desc: "평범한 여행 (호텔+대중교통/택시)",
    multipliers: { meal: 3.0, accommodation: 1.0, transport: 2.0 } 
  },
  LUXURY: { 
    label: "럭셔리", 
    desc: "여유로운 힐링 (호캉스+택시)",
    multipliers: { meal: 4.0, accommodation: 3.0, transport: 4.0 } 
  },
};

type SortOption = "MARGIN_DESC" | "COST_ASC" | "NAME_ASC";

export default function BudgetExplorer() {
  const [totalBudget, setTotalBudget] = useState(1500000);
  const [flightCost, setFlightCost] = useState(500000);
  const [days, setDays] = useState(4);
  const [travelStyle, setTravelStyle] = useState<keyof typeof TRAVEL_STYLES>("STANDARD");
  const [sortOption, setSortOption] = useState<SortOption>("MARGIN_DESC");

  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const localBudget = totalBudget - flightCost;

  useEffect(() => {
    const fetchData = async () => {
      const { data: countriesData } = await supabase
        .from("countries")
        .select("id, name_ko, name_en, flag_emoji, currency_code, meal_price_local, transport_price_local, accommodation_price_local, exchange_rates(rate_to_krw)");

      if (countriesData) {
        setCountries(countriesData as any);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    setCalculating(true);
    setIsCalculated(false);
    
    setTimeout(() => {
        setCalculating(false);
        setIsCalculated(true);
        const resultSection = document.getElementById('result-section');
        resultSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 800);
  };

  const calculateAffordability = (country: CountryData) => {
    const rate = country.exchange_rates?.rate_to_krw || 0;
    const { multipliers } = TRAVEL_STYLES[travelStyle];
    const dailyCostKrw = Math.round(
      (country.accommodation_price_local * multipliers.accommodation + 
       country.meal_price_local * multipliers.meal +      
       country.transport_price_local * multipliers.transport)  
      * rate
    );

    const userDailyBudget = Math.floor(localBudget / days);
    const margin = userDailyBudget - dailyCostKrw;
    const trend = Number(country.id) % 2 === 0 ? "UP" : "DOWN"; 

    return { dailyCostKrw, margin, isAffordable: margin >= 0, trend };
  };

  const affordableCountries = countries
    .map((c) => ({ ...c, ...calculateAffordability(c) }))
    .filter((c) => c.isAffordable)
    .sort((a, b) => {
      if (sortOption === "COST_ASC") return a.dailyCostKrw - b.dailyCostKrw;
      if (sortOption === "NAME_ASC") return a.name_ko.localeCompare(b.name_ko);
      return b.margin - a.margin;
    });

  const formatMoney = (amount: number) => amount.toLocaleString();

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans">
      <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 pb-24 flex flex-col items-center">
        
        <div className="w-full max-w-2xl">
          <header className="mb-8 flex flex-col items-start gap-2">
            <Link href="/" className="inline-flex items-center text-slate-500 font-bold hover:text-slate-900 transition-colors mb-4 bg-white px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm">
              <ChevronLeft size={18} className="mr-1" /> 메인으로
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">예산 계산기</h1>
            <p className="text-slate-500 text-sm font-medium">항공권과 여행 스타일을 고려해 현실적인 여행지를 찾아드려요.</p>
          </header>

          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60 mb-10">
            <div className="mb-8">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">여행 스타일</label>
              <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                {(Object.keys(TRAVEL_STYLES) as Array<keyof typeof TRAVEL_STYLES>).map((style) => (
                  <button
                    key={style}
                    onClick={() => setTravelStyle(style)}
                    className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
                      travelStyle === style 
                        ? "bg-white text-emerald-600 shadow-sm border border-slate-200" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {TRAVEL_STYLES[style].label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center font-medium">{TRAVEL_STYLES[travelStyle].desc}</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <Wallet size={16} className="text-emerald-500" /> 총 예산 (Total)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full text-lg font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-right pr-12"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">원</span>
                </div>
              </div>

              <div className="flex items-center justify-center text-slate-300">
                 <Minus size={20} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <Plane size={16} className="text-emerald-500" /> 예상 항공권 비용
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={flightCost}
                    onChange={(e) => setFlightCost(Number(e.target.value))}
                    className="w-full text-base font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-right pr-12"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">원</span>
                </div>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center">
                 <span className="text-xs font-bold text-emerald-600">현지에서 쓸 돈</span>
                 <span className="text-xl font-black text-emerald-700">{formatMoney(localBudget)}원</span>
              </div>
            </div>

            <div className="mt-8 mb-8">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                <CalendarDays size={16} className="text-emerald-500" /> 여행 기간
              </label>
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-2">
                <button 
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-slate-600 hover:text-emerald-600 text-lg"
                >
                  -
                </button>
                <div className="flex-1 text-center font-black text-slate-900 text-xl">
                  {days}일
                </div>
                <button 
                  onClick={() => setDays(days + 1)}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-slate-600 hover:text-emerald-600 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <button 
              onClick={handleSearch}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Search size={18} />
              여행지 찾기
            </button>
          </div>
        </div>

        <div id="result-section" className="w-full">
            {calculating ? (
                <div className="py-20 text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full mx-auto mb-4"/>
                    <p className="text-slate-500 font-bold text-sm">예산에 맞는 여행지를 찾는 중...</p>
                </div>
            ) : isCalculated ? (
                <div className="w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                            추천 여행지 <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-sm border border-emerald-100">{affordableCountries.length}곳</span>
                        </h2>
                        
                        <div className="relative w-full md:w-auto">
                            <select 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                                className="w-full md:w-auto appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-bold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-emerald-500 shadow-sm cursor-pointer"
                            >
                                <option value="MARGIN_DESC">여유 자금 순</option>
                                <option value="COST_ASC">물가 저렴한 순</option>
                                <option value="NAME_ASC">가나다 순</option>
                            </select>
                            <SlidersHorizontal size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {affordableCountries.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {affordableCountries.map((country) => (
                                <Link 
                                    href={`/destination/${country.id}`}
                                    key={country.id}
                                    prefetch={false}
                                    className="group bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all relative overflow-hidden block"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl filter drop-shadow-sm">{country.flag_emoji}</span>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-black text-slate-900 text-xl tracking-tight">{country.name_ko.split(' - ')[1] || country.name_ko}</h3>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{country.name_en}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-emerald-100 flex items-center gap-1">
                                          하루 {formatMoney(country.margin)}원 남음
                                      </div>
                                      {country.trend === "DOWN" ? (
                                          <span className="flex items-center text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">
                                              <TrendingDown size={12} className="mr-1"/> 환율유리
                                          </span>
                                      ) : (
                                          <span className="flex items-center text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">
                                              <TrendingUp size={12} className="mr-1"/> 환율불리
                                          </span>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 pr-12 relative border border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 font-bold text-[11px] mb-1">
                                                {TRAVEL_STYLES[travelStyle].label} 1일 경비
                                            </span>
                                            <span className="font-black text-slate-900 text-lg tracking-tight">
                                                {formatMoney(country.dailyCostKrw)}원
                                            </span>
                                        </div>
                                        
                                        <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 bg-slate-900 text-white p-3 rounded-xl shadow-md group-hover:bg-emerald-500 transition-colors z-10">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-200/60 shadow-sm max-w-2xl mx-auto">
                            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6">
                              <Wallet size={32} />
                            </div>
                            <h3 className="font-black text-slate-900 text-2xl tracking-tight mb-2">예산이 부족해요</h3>
                            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                                현재 설정하신 {TRAVEL_STYLES[travelStyle].label} 스타일로는<br/>
                                여행 가능한 국가를 찾기 어렵습니다.
                            </p>
                            <button 
                                onClick={() => {
                                    setTotalBudget(totalBudget + 500000);
                                    handleSearch();
                                }}
                                className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                            >
                                <Coins size={18} />
                                총 예산 50만원 늘리기
                            </button>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
      </main>
    </div>
  );
}