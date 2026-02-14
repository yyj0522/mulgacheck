"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, Plane, ArrowRight, Coins, CalendarDays, Wallet, SlidersHorizontal, TrendingUp, TrendingDown, Minus, Search } from "lucide-react";
import WingBanners from "@/components/WingBanners";
import { BOTTOM_ADS } from "@/data/adData";

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
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [bottomAd, setBottomAd] = useState(BOTTOM_ADS[0]);

  const localBudget = totalBudget - flightCost;

  useEffect(() => {
    setBottomAd(BOTTOM_ADS[Math.floor(Math.random() * BOTTOM_ADS.length)]);

    const fetchData = async () => {
      const { data: countriesData } = await supabase
        .from("countries")
        .select("id, name_ko, name_en, flag_emoji, currency_code, meal_price_local, transport_price_local, accommodation_price_local, exchange_rates(rate_to_krw)");

      const { data: bannersData } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (countriesData) {
        setCountries(countriesData as any);
      }
      if (bannersData) {
        setBanners(bannersData);
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center relative z-10 pt-4 pb-4">
      <WingBanners dbBanners={banners} />
      
      <div className="w-full max-w-md px-6">
        <header className="mb-6">
          <Link href="/" className="inline-flex items-center text-slate-400 mb-4 font-bold hover:text-indigo-600 transition-colors">
            <ChevronLeft size={20} /> 메인으로
          </Link>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            어디로 떠날까요?
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            항공권과 여행 스타일을 고려해<br />
            현실적인 여행지를 찾아드려요.
          </p>
        </header>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 mb-6 space-y-6">
          
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">여행 스타일</label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(Object.keys(TRAVEL_STYLES) as Array<keyof typeof TRAVEL_STYLES>).map((style) => (
                <button
                  key={style}
                  onClick={() => setTravelStyle(style)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    travelStyle === style 
                      ? "bg-white text-indigo-600 shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {TRAVEL_STYLES[style].label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">{TRAVEL_STYLES[travelStyle].desc}</p>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">
                <Wallet size={14} /> 총 예산 (Total)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full text-lg font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 transition-all text-right pr-10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">원</span>
              </div>
            </div>

            <div className="flex items-center justify-center text-slate-300">
               <Minus size={16} />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Plane size={14} /> 예상 항공권 비용
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={flightCost}
                  onChange={(e) => setFlightCost(Number(e.target.value))}
                  className="w-full text-base font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-400 transition-all text-right pr-10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">원</span>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-3 rounded-xl flex justify-between items-center">
               <span className="text-xs font-bold text-indigo-400">현지에서 쓸 돈</span>
               <span className="text-lg font-black text-indigo-600">{formatMoney(localBudget)}원</span>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">
              <CalendarDays size={14} /> 여행 기간
            </label>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-2">
              <button 
                onClick={() => setDays(Math.max(1, days - 1))}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-slate-600 hover:text-indigo-600"
              >
                -
              </button>
              <div className="flex-1 text-center font-black text-slate-900">
                {days}일
              </div>
              <button 
                onClick={() => setDays(days + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-slate-600 hover:text-indigo-600"
              >
                +
              </button>
            </div>
          </div>

          <button 
            onClick={handleSearch}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            <Search size={20} />
            여행지 찾기
          </button>
        </div>

        <div id="result-section">
            {calculating ? (
                <div className="py-20 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"/>
                    <p className="text-slate-400 font-bold text-sm">예산에 맞는 여행지를 찾는 중...</p>
                </div>
            ) : isCalculated ? (
                <div>
                    <div className="flex justify-between items-center mb-4 animate-fade-in-up">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            갈 수 있는 곳 <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-sm">{affordableCountries.length}</span>
                        </h2>
                        
                        <div className="relative">
                            <select 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                                className="appearance-none bg-white border border-slate-200 text-slate-600 text-xs font-bold py-2 pl-3 pr-10 rounded-lg focus:outline-none focus:border-indigo-500 min-w-[130px]"
                            >
                                <option value="MARGIN_DESC">여유 자금 순</option>
                                <option value="COST_ASC">물가 저렴한 순</option>
                                <option value="NAME_ASC">가나다 순</option>
                            </select>
                            <SlidersHorizontal size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {affordableCountries.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 animate-fade-in-up delay-100">
                            {affordableCountries.map((country) => (
                                <Link 
                                    href={`/destination/${country.id}`}
                                    key={country.id}
                                    prefetch={false}
                                    className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all relative overflow-hidden block"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl filter drop-shadow-sm">{country.flag_emoji}</span>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-black text-slate-900 text-lg">{country.name_ko.split(' - ')[1] || country.name_ko}</h3>
                                                    {country.trend === "DOWN" ? (
                                                        <span className="flex items-center text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                                                            <TrendingDown size={10} className="mr-1"/> 환율 좋음
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">
                                                            <TrendingUp size={10} className="mr-1"/> 환율 오름
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{country.name_en}</p>
                                            </div>
                                        </div>
                                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 text-right">
                                            하루 {formatMoney(country.margin)}원 남음
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm bg-slate-50 rounded-2xl p-4 pr-14 relative">
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 font-bold text-xs mb-1">
                                                {TRAVEL_STYLES[travelStyle].label} 기준 하루 경비
                                            </span>
                                            <span className="font-black text-slate-800 text-lg">
                                                {formatMoney(country.dailyCostKrw)}원
                                            </span>
                                        </div>
                                        
                                        <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-200 group-hover:bg-indigo-700 transition-colors z-10">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] p-10 text-center border border-slate-100 animate-fade-in-up">
                            <div className="text-6xl mb-4">💸</div>
                            <h3 className="font-black text-slate-900 text-lg mb-2">예산이 부족해요!</h3>
                            <p className="text-slate-500 text-sm mb-6">
                                현재 설정하신 {TRAVEL_STYLES[travelStyle].label} 스타일로는<br/>
                                여행 가능한 국가를 찾기 어렵습니다.<br/>
                                여행 스타일을 바꾸거나 예산을 조정해보세요.
                            </p>
                            <button 
                                onClick={() => {
                                    setTotalBudget(totalBudget + 500000);
                                    handleSearch();
                                }}
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                <Coins size={18} />
                                총 예산 50만원 늘리기
                            </button>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
      </div>

      <div className="w-full flex justify-center mt-4 px-4 min-[1400px]:hidden">
        {bottomAd.pcImg && (
            <div className="hidden md:block w-full max-w-[728px] shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
                <a href={bottomAd.link} target="_blank" rel="noopener noreferrer nofollow">
                    <img 
                        src={bottomAd.pcImg} 
                        alt={bottomAd.name} 
                        width={728} 
                        height={90} 
                        className="w-full h-auto"
                    />
                </a>
                {bottomAd.pcTrack && <img src={bottomAd.pcTrack} width="1" height="1" className="hidden" alt="" />}
            </div>
        )}
        {bottomAd.moImg && (
            <div className="block md:hidden w-full shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
                <a href={bottomAd.moLink || bottomAd.link} target="_blank" rel="noopener noreferrer nofollow">
                    <img 
                        src={bottomAd.moImg} 
                        alt={bottomAd.name} 
                        width={468} 
                        height={60} 
                        className="w-full h-auto"
                    />
                </a>
                {bottomAd.moTrack && <img src={bottomAd.moTrack} width="1" height="1" className="hidden" alt="" />}
            </div>
        )}
      </div>
    </div>
  );
}