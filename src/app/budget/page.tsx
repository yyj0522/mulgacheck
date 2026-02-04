"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, Plane, ArrowRight, Coins, CalendarDays, Wallet } from "lucide-react";
import WingBanners from "@/components/WingBanners";

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

export default function BudgetExplorer() {
  const [budget, setBudget] = useState(1500000);
  const [days, setDays] = useState(4);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const calculateAffordability = (country: CountryData) => {
    const rate = country.exchange_rates?.rate_to_krw || 0;
    
    const dailyCostKrw = Math.round(
      (country.accommodation_price_local + 
       country.meal_price_local * 3 +      
       country.transport_price_local * 2)  
      * rate
    );

    const userDailyBudget = Math.floor(budget / days);
    const margin = userDailyBudget - dailyCostKrw;
    
    return { dailyCostKrw, margin, isAffordable: margin >= 0 };
  };

  const affordableCountries = countries
    .map((c) => ({ ...c, ...calculateAffordability(c) }))
    .filter((c) => c.isAffordable)
    .sort((a, b) => b.margin - a.margin);

  const formatMoney = (amount: number) => amount.toLocaleString();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-24">
      <WingBanners dbBanners={banners} />
      
      <div className="max-w-md mx-auto">
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-slate-400 mb-6 font-bold hover:text-indigo-600 transition-colors">
            <ChevronLeft size={20} /> 메인으로
          </Link>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">
            얼마나<br />
            가지고 계신가요?
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            예산을 입력하면 갈 수 있는 여행지를 찾아드려요.
            <br />(항공권 제외, 현지 체류비 기준)
          </p>
        </header>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 mb-10 sticky top-4 z-10">
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">
                <Wallet size={14} /> 총 예산 (항공권 제외)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full text-2xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-right pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">원</span>
              </div>
              <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
                {[500000, 1000000, 2000000, 3000000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBudget(amt)}
                    className="flex-shrink-0 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 hover:border-indigo-300 transition-colors"
                  >
                    {formatMoney(amt / 10000)}만
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">
                <CalendarDays size={14} /> 여행 기간
              </label>
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-2">
                <button 
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  -
                </button>
                <div className="flex-1 text-center font-black text-slate-900 text-lg">
                  {days}일
                </div>
                <button 
                  onClick={() => setDays(days + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-right text-xs text-slate-400 font-bold mt-2">
                하루 쓸 수 있는 돈: <span className="text-indigo-600">{formatMoney(Math.floor(budget / days))}원</span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Plane className="text-indigo-500" />
            갈 수 있는 여행지 <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-sm">{affordableCountries.length}곳</span>
          </h2>

          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"/>
              <p className="text-slate-400 font-bold text-sm">계산기를 두드리고 있어요...</p>
            </div>
          ) : affordableCountries.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
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
                        <h3 className="font-black text-slate-900 text-lg">{country.name_ko.split(' - ')[1] || country.name_ko}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{country.name_en}</p>
                      </div>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                      하루 {formatMoney(country.margin)}원 남음
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm bg-slate-50 rounded-2xl p-4 pr-14 relative">
                    <span className="text-slate-500 font-bold">예상 하루 경비</span>
                    <span className="font-black text-slate-800 text-lg">
                      {formatMoney(country.dailyCostKrw)}원
                    </span>
                    
                    <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-200 group-hover:bg-indigo-700 transition-colors z-10">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] p-10 text-center border border-slate-100">
              <div className="text-6xl mb-4">💸</div>
              <h3 className="font-black text-slate-900 text-lg mb-2">예산이 조금 부족해요!</h3>
              <p className="text-slate-500 text-sm mb-6">
                입력하신 예산으로는<br/>
                기본적인 숙박과 식사가 어려울 수 있어요.
              </p>
              <button 
                onClick={() => setBudget(budget + 500000)}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                <Coins size={18} />
                예산 50만원 늘리기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}