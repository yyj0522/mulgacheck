import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, TrendingDown, TrendingUp, Wallet, Bus, Utensils, Hotel } from "lucide-react";
import BudgetCalculator from "@/components/BudgetCalculator";

export const revalidate = 0;

export default async function DestinationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: country } = await supabase
    .from('countries')
    .select('*, exchange_rates(rate_to_krw)')
    .eq('id', id)
    .single();

  if (!country) return <div className="p-10 text-center text-slate-400 font-bold">데이터를 찾을 수 없습니다.</div>;

  const rate = country.exchange_rates?.rate_to_krw || 0;
  const mealKrw = Math.round(country.meal_price_local * rate);
  const transportKrw = Math.round((country.transport_price_local || 0) * rate);
  const accommodationKrw = Math.round((country.accommodation_price_local || 0) * rate);
  const seoulMealPrice = 10000;
  const diffPercent = seoulMealPrice > 0 ? Math.round(((mealKrw - seoulMealPrice) / seoulMealPrice) * 100) : 0;
  const isCheaper = diffPercent < 0;

  const cityDisplayNames: { [key: string]: string } = {
    'tokyo': '도쿄', 'da-nang': '다낭', 'bangkok': '방콕', 'taipei': '타이베이',
    'singapore': '싱가포르', 'cebu': '세부', 'bali': '발리', 'guam': '괌',
    'hong-kong': '홍콩', 'paris': '파리'
  };
  const cityName = cityDisplayNames[country.base_city] || country.base_city.toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-20">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center text-slate-400 mb-8 font-bold hover:text-[#2680EB] transition-colors">
          <ChevronLeft size={20} /> 뒤로가기
        </Link>

        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-blue-900/5 text-center border border-white">
          <div className="text-8xl mb-8 leading-none">{country.flag_emoji}</div>
          <h1 className="text-3xl font-black text-[#102A43] mb-2">{cityName}</h1>
          <p className="text-[#2680EB] font-bold text-sm mb-10 tracking-widest uppercase">{country.name_en}</p>

          <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-3xl text-left border border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">실시간 환율 적용</p>
              <p className="text-xl font-black text-slate-800 tracking-tight">1 {country.currency_code} = {rate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}원</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-5 rounded-3xl text-left border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">현지 한 끼 식사</p>
                  <p className="text-2xl font-black text-slate-900">{mealKrw > 0 ? `약 ${mealKrw.toLocaleString()}원` : "데이터 준비 중"}</p>
                </div>
                <Utensils className="text-slate-100" size={32} />
              </div>

              <div className="bg-white p-5 rounded-3xl text-left border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">대중교통 1회 이용</p>
                  <p className="text-2xl font-black text-slate-900">{transportKrw > 0 ? `약 ${transportKrw.toLocaleString()}원` : "데이터 준비 중"}</p>
                </div>
                <Bus className="text-slate-100" size={32} />
              </div>

              <div className="bg-white p-5 rounded-3xl text-left border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">평균 숙박비 (1박)</p>
                  <p className="text-2xl font-black text-slate-900">{accommodationKrw > 0 ? `약 ${accommodationKrw.toLocaleString()}원` : "데이터 준비 중"}</p>
                </div>
                <Hotel className="text-slate-100" size={32} />
              </div>
            </div>

            {mealKrw > 0 && (
              <div className={`p-8 rounded-3xl text-white shadow-lg ${isCheaper ? 'bg-[#2680EB] shadow-blue-100' : 'bg-rose-500 shadow-rose-100'}`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  {isCheaper ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
                  <span className="font-bold uppercase text-xs tracking-widest">Seoul vs {country.name_en}</span>
                </div>
                <p className="text-5xl font-black tracking-tighter">{Math.abs(diffPercent)}% {isCheaper ? 'Cheap' : 'High'}</p>
              </div>
            )}
            
            <div className="pt-8 text-left">
               <h3 className="flex items-center gap-2 font-bold text-[#102A43] mb-5">
                 <Wallet size={20} className="text-[#2680EB]" /> 10,000원의 가치
               </h3>
               <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                    <p className="text-[#2680EB] font-black text-lg mb-1">{mealKrw > 0 ? Math.floor(10000 / mealKrw) : "?"}끼</p>
                    <p className="text-slate-400 text-xs font-bold uppercase">식사 가능</p>
                  </div>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                    <p className="text-[#2680EB] font-black text-lg mb-1">{transportKrw > 0 ? Math.floor(10000 / transportKrw) : "?"}회</p>
                    <p className="text-slate-400 text-xs font-bold uppercase">교통 이용</p>
                  </div>
               </div>
            </div>

            <BudgetCalculator 
              mealKrw={mealKrw} 
              transportKrw={transportKrw} 
              accommodationKrw={accommodationKrw}
            />
          </div>
        </div>
      </div>
    </div>
  );
}