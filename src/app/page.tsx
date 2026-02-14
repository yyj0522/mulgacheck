import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SearchAndFilter from "@/components/SearchAndFilter";
import { ArrowRight, Calculator, Sparkles, Map, Wallet } from "lucide-react";
import { BOTTOM_ADS } from "@/data/adData";

export const revalidate = 3600;

export default async function Home() {
  const bottomAd = BOTTOM_ADS[Math.floor(Math.random() * BOTTOM_ADS.length)];

  const { data: countries } = await supabase
    .from("countries")
    .select("*, exchange_rates(rate_to_krw)");

  return (
    <div className="min-h-screen bg-slate-50 bg-dot-pattern flex flex-col items-center relative">
      <nav className="absolute top-0 left-0 right-0 mx-auto w-full max-w-7xl flex justify-between items-start px-6 pt-8 md:px-8 z-50">
        <div className="relative w-40 h-12 md:w-56 md:h-16">
          <Image 
            src="/logo.png" 
            alt="물가체크" 
            fill 
            className="object-contain object-left-top" 
            priority 
            quality={75} 
          />
        </div>
      </nav>

      <header className="w-full max-w-7xl px-6 pt-40 pb-10 flex flex-col items-center z-10">
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-bold text-xs mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            실시간 환율 반영 중
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] mb-6 tracking-tight">
            여행 예산, <br className="md:hidden" />
            <span className="text-indigo-600">감</span> 말고 <span className="text-indigo-600">데이터</span>로.
          </h1>
          
          <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            지금 가장 저렴한 여행지는 어디일까요?<br />
            실시간 환율로 계산된 현지 물가를 한눈에 비교하세요.
          </p>
        </div>
      </header>

      <main className="w-full max-w-7xl px-6 pb-8 z-10 flex flex-col items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          
          <Link href="/plan" className="group block h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 rounded-[2rem] p-6 h-full shadow-xl shadow-sky-200 hover:shadow-2xl hover:shadow-sky-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[200px]">
              <div>
                <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-emerald-50 text-[9px] font-bold uppercase tracking-widest border border-white/10">
                    AI Planner
                    </span>
                    <span className="px-1.5 py-0.5 bg-white text-blue-600 text-[9px] font-black rounded-full shadow-sm animate-pulse">
                      NEW
                    </span>
                </div>
                <h2 className="text-xl font-black text-white mb-1 leading-tight">
                  AI 여행 일정<br/>자동 생성
                </h2>
                <p className="text-emerald-100 text-xs font-medium opacity-90 break-keep">
                  몇 번의 클릭으로<br/>완벽한 동선 짜기
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-2.5 rounded-full mt-3 group-hover:bg-white/20 transition-colors">
                <Map className="text-white" size={18} />
              </div>
            </div>
          </Link>

          <Link href="/budget" className="group block h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-6 h-full shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-emerald-50 text-[9px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  Budget
                </span>
                <h2 className="text-xl font-black text-white mb-1 leading-tight">
                  예산으로<br/>여행지 찾기
                </h2>
                <p className="text-emerald-100 text-xs font-medium opacity-90 break-keep">
                  "100만원으로 어디?"<br/>예산 맞춤 추천
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-2.5 rounded-full mt-3 group-hover:bg-white/20 transition-colors">
                <Calculator className="text-white" size={18} />
              </div>
            </div>
          </Link>

          <Link href="/checklist" className="group block h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] p-6 h-full shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-indigo-50 text-[9px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  Checklist
                </span>
                <h2 className="text-xl font-black text-white mb-1 leading-tight">
                  짐 싸기<br/>체크리스트
                </h2>
                <p className="text-indigo-100 text-xs font-medium opacity-90 break-keep">
                  빠뜨린 물건 없이<br/>완벽하게 준비
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-2.5 rounded-full mt-3 group-hover:bg-white/20 transition-colors">
                <ArrowRight className="text-white" size={18} />
              </div>
            </div>
          </Link>

          <Link href="/tracker" className="group block h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2rem] p-6 h-full shadow-xl shadow-amber-200 hover:shadow-2xl hover:shadow-amber-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-amber-50 text-[9px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  Tracker
                </span>
                <h2 className="text-xl font-black text-white mb-1 leading-tight">
                  여행<br/>간편 가계부
                </h2>
                <p className="text-amber-100 text-xs font-medium opacity-90 break-keep">
                  실시간 환율 계산<br/>지출 내역 저장
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-2.5 rounded-full mt-3 group-hover:bg-white/20 transition-colors">
                <Wallet className="text-white" size={18} />
              </div>
            </div>
          </Link>

          <Link href="/test" className="group block h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2rem] p-6 h-full shadow-xl shadow-rose-200 hover:shadow-2xl hover:shadow-rose-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-rose-50 text-[9px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  MBTI
                </span>
                <h2 className="text-xl font-black text-white mb-1 leading-tight">
                  나의 여행<br/>성향 찾기
                </h2>
                <p className="text-rose-100 text-xs font-medium opacity-90 break-keep">
                  "나는 어떤 여행자?"<br/>성향별 추천
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-2.5 rounded-full mt-3 group-hover:bg-white/20 transition-colors">
                <Sparkles className="text-white" size={18} />
              </div>
            </div>
          </Link>

        </div>

        <div className="w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-slate-200/40">
          <SearchAndFilter initialData={countries ?? []} />
        </div>

        <div className="w-full flex justify-center mt-8 min-[1400px]:hidden">
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
      </main>
    </div>
  );
}