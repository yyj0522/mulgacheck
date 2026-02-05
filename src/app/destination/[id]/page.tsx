import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, TrendingDown, TrendingUp, Wallet, Bus, Utensils, Hotel, Plane, ExternalLink, Zap, Coins, Coffee } from "lucide-react";
import BudgetCalculator from "@/components/BudgetCalculator";
import CommentSection from "@/components/CommentSection";
import SurvivalCardList from "@/components/survival/SurvivalCardList";
import WingBanners from "@/components/WingBanners";

const BurgerIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19.4 12.6C19.8 12.8 20 13 20 13.5V15C20 16 19 17 17 17H7C5 17 4 16 4 15V13.5C4 13 4.2 12.8 4.6 12.6L19.4 12.6Z" />
    <path d="M16 17H8" />
    <path d="M5 12H19" />
    <path d="M12 5C7.6 5 4 8.1 4 12H20C20 8.1 16.4 5 12 5Z" />
  </svg>
);

export const revalidate = 3600;

export default async function DestinationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: country } = await supabase
    .from('countries')
    .select('*, exchange_rates(rate_to_krw)')
    .eq('id', id)
    .single();

  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (!country) return <div className="p-10 text-center text-slate-400 font-bold">데이터를 찾을 수 없습니다.</div>;

  const rate = country.exchange_rates?.rate_to_krw || 0;
  const mealKrw = Math.round(country.meal_price_local * rate);
  const transportKrw = Math.round((country.transport_price_local || 0) * rate);
  const accommodationKrw = Math.round((country.accommodation_price_local || 0) * rate);
  const SEOUL_MEAL = 11000;
  const SEOUL_BIGMAC = 5500;  
  const SEOUL_STARBUCKS = 5000; 
  const bigmacKrw = country.bigmac_price_local ? Math.round(country.bigmac_price_local * rate) : 0;
  const starbucksKrw = country.starbucks_price_local ? Math.round(country.starbucks_price_local * rate) : 0;
  const diffPercent = SEOUL_MEAL > 0 ? Math.round(((mealKrw - SEOUL_MEAL) / SEOUL_MEAL) * 100) : 0;
  const isCheaper = diffPercent < 0;

  const skyscannerUrl = country.airport_code 
    ? `https://www.skyscanner.co.kr/transport/flights/icn/${country.airport_code.toLowerCase()}`
    : `https://www.skyscanner.co.kr/transport/flights/icn`;

  const PriceIndexCard = ({ title, icon: Icon, krwPrice, seoulPrice, colorClass }: any) => {
    if (krwPrice === 0) return null; 
    
    const diff = Math.round(((krwPrice - seoulPrice) / seoulPrice) * 100);
    const isIndexCheaper = diff < 0;
    
    return (
      <div className={`flex-1 p-4 rounded-3xl border ${colorClass} flex flex-col justify-between min-h-[140px] relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Icon size={18} className="opacity-70" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{title}</span>
          </div>
          <p className="text-xl font-black mb-1">{krwPrice.toLocaleString()}원</p>
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isIndexCheaper ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
            {isIndexCheaper ? '▼' : '▲'} 한국보다 {Math.abs(diff)}% {isIndexCheaper ? '저렴' : '비쌈'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-20">
      <div className="max-w-md mx-auto">
        
        <WingBanners dbBanners={banners || []} />

        <Link href="/" className="inline-flex items-center text-slate-400 mb-8 font-bold hover:text-indigo-600 transition-colors">
          <ChevronLeft size={20} /> 뒤로가기
        </Link>

        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 text-center border border-slate-100">
          <div className="text-8xl mb-8 leading-none filter drop-shadow-sm">{country.flag_emoji}</div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">{country.name_ko.split(' - ')[1] || country.name_ko}</h1>
          <p className="text-indigo-500 font-bold text-sm mb-8 tracking-widest uppercase">{country.name_en}</p>

          <div className="space-y-4">
            <a 
              href={skyscannerUrl} 
              target="_blank" 
              rel="noopener noreferrer nofollow"
              className="group relative flex items-center justify-between p-5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Plane size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Flight</p>
                  <p className="text-lg font-black">항공권 최저가 확인</p>
                </div>
              </div>
              <ExternalLink size={20} className="opacity-70 group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="grid grid-cols-2 gap-3 mb-6 mt-6">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl text-left flex flex-col justify-between h-32">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">전압 & 플러그</span>
                  <Zap size={18} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-xl font-black text-indigo-900">{country.voltage || '정보없음'}</p>
                  <p className="text-xs font-medium text-indigo-600 break-keep mt-1">{country.plug_type || '확인 필요'}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl text-left flex flex-col justify-between h-32">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">팁 문화</span>
                  <Coins size={18} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900 break-keep leading-tight mt-1">{country.tip_policy || '정보없음'}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl text-left border border-slate-200">
              <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">실시간 환율</p>
              <p className="text-xl font-black text-slate-800 tracking-tight">1 {country.currency_code} = {rate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}원</p>
            </div>
            
            {(bigmacKrw > 0 || starbucksKrw > 0) && (
              <div className="flex gap-3 text-left">
                <PriceIndexCard 
                  title="빅맥 지수" 
                  icon={BurgerIcon} 
                  krwPrice={bigmacKrw} 
                  seoulPrice={SEOUL_BIGMAC} 
                  colorClass="bg-orange-50 border-orange-100 text-orange-900" 
                />
                <PriceIndexCard 
                  title="스타벅스 라떼" 
                  icon={Coffee} 
                  krwPrice={starbucksKrw} 
                  seoulPrice={SEOUL_STARBUCKS} 
                  colorClass="bg-green-50 border-green-100 text-green-900" 
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-5 rounded-3xl text-left border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">현지 한 끼 식사</p>
                  <p className="text-2xl font-black text-slate-900">{mealKrw > 0 ? `약 ${mealKrw.toLocaleString()}원` : "준비 중"}</p>
                </div>
                <Utensils className="text-slate-200" size={32} />
              </div>

              <div className="bg-white p-5 rounded-3xl text-left border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">대중교통 1회 이용</p>
                  <p className="text-2xl font-black text-slate-900">{transportKrw > 0 ? `약 ${transportKrw.toLocaleString()}원` : "준비 중"}</p>
                </div>
                <Bus className="text-slate-200" size={32} />
              </div>

              <div className="bg-white p-5 rounded-3xl text-left border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">평균 숙박비 (1박)</p>
                  <p className="text-2xl font-black text-slate-900">{accommodationKrw > 0 ? `약 ${accommodationKrw.toLocaleString()}원` : "준비 중"}</p>
                </div>
                <Hotel className="text-slate-200" size={32} />
              </div>
            </div>

            {mealKrw > 0 && (
              <div className={`p-8 rounded-3xl text-white shadow-lg ${isCheaper ? 'bg-indigo-500 shadow-indigo-200' : 'bg-rose-500 shadow-rose-200'}`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  {isCheaper ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
                  <span className="font-bold uppercase text-xs tracking-widest">Seoul vs {country.name_en}</span>
                </div>
                <p className="text-5xl font-black tracking-tighter">{Math.abs(diffPercent)}% {isCheaper ? 'Cheap' : 'High'}</p>
              </div>
            )}
            
            <div className="pt-8 text-left">
               <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-5">
                 <Wallet size={20} className="text-indigo-500" /> 10,000원의 가치
               </h3>
               <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                    <p className="text-indigo-600 font-black text-lg mb-1">{mealKrw > 0 ? Math.floor(10000 / mealKrw) : "?"}끼</p>
                    <p className="text-slate-400 text-xs font-bold uppercase">식사 가능</p>
                  </div>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                    <p className="text-indigo-600 font-black text-lg mb-1">{transportKrw > 0 ? Math.floor(10000 / transportKrw) : "?"}회</p>
                    <p className="text-slate-400 text-xs font-bold uppercase">교통 이용</p>
                  </div>
               </div>
            </div>

            <SurvivalCardList countryName={country.name_en} />

            <BudgetCalculator 
              mealKrw={mealKrw} 
              transportKrw={transportKrw} 
              accommodationKrw={accommodationKrw}
              currencyCode={country.currency_code}
            />

            <CommentSection countryId={country.id} />
            
            <p className="text-[10px] text-slate-300 mt-8 mb-4">
              이 페이지의 제휴 링크를 통해 구매가 발생할 경우,<br className="md:hidden"/> 일정액의 수수료를 제공받을 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}