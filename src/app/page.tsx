import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SearchAndFilter from "@/components/SearchAndFilter";
import Header from "@/components/Header";
import { ArrowRight, Calculator, Sparkles, Map, Wallet } from "lucide-react";

export const revalidate = 3600;

export default async function Home() {
  const { data: countries } = await supabase
    .from("countries")
    .select("*, exchange_rates(rate_to_krw)");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <Header />

      <header className="w-full max-w-7xl px-6 pt-12 pb-8 flex flex-col items-center z-10">
        <div className="text-center animate-fade-in-up">
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] mb-4 tracking-tight">
            여행 예산, <br className="md:hidden" />
            <span className="text-indigo-600">감</span> 말고 <span className="text-indigo-600">데이터</span>로.
          </h1>
          
          <p className="text-slate-500 text-sm md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
            지금 가장 저렴한 여행지는 어디일까요?<br className="hidden md:block" />
            실시간 환율로 계산된 현지 물가를 한눈에 비교하세요.
          </p>
        </div>
      </header>

      <main className="w-full max-w-7xl px-6 pb-16 z-10 flex flex-col items-center">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          
          <Link href="/plan" className="group block h-full col-span-2 md:col-span-1 lg:col-span-1">
            <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 rounded-[2rem] p-6 h-full shadow-md hover:shadow-lg hover:shadow-sky-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[160px] md:min-h-[200px]">
              <div>
                <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-emerald-50 text-[9px] font-bold uppercase tracking-widest border border-white/10">
                    AI Planner
                    </span>
                    <span className="px-1.5 py-0.5 bg-white text-blue-600 text-[9px] font-black rounded-full shadow-sm animate-pulse">
                      NEW
                    </span>
                </div>
                <h2 className="text-lg md:text-xl font-black text-white mb-1 leading-tight">
                  AI 여행 일정<br/>자동 생성
                </h2>
                <p className="text-emerald-100 text-[10px] md:text-xs font-medium opacity-90 break-keep">
                  몇 번의 클릭으로<br/>완벽한 동선 짜기
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-2 rounded-full mt-3 group-hover:bg-white/20 transition-colors">
                <Map className="text-white" size={16} />
              </div>
            </div>
          </Link>

          <Link href="/budget" className="group block h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-6 h-full shadow-md hover:shadow-lg hover:shadow-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[160px] md:min-h-[200px]">
              <div>
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-emerald-50 text-[9px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  Budget
                </span>
                <h2 className="text-lg md:text-xl font-black text-white mb-1 leading-tight">
                  예산으로<br/>여행지 찾기
                </h2>
                <p className="text-emerald-100 text-[10px] md:text-xs font-medium opacity-90 break-keep hidden md:block">
                  "100만원으로 어디?"<br/>예산 맞춤 추천
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-2 rounded-full mt-3 group-hover:bg-white/20 transition-colors">
                <Calculator className="text-white" size={16} />
              </div>
            </div>
          </Link>

          <Link href="/checklist" className="group block h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] p-6 h-full shadow-md hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[160px] md:min-h-[200px]">
              <div>
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-indigo-50 text-[9px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  Checklist
                </span>
                <h2 className="text-lg md:text-xl font-black text-white mb-1 leading-tight">
                  짐 싸기<br/>체크리스트
                </h2>
                <p className="text-indigo-100 text-[10px] md:text-xs font-medium opacity-90 break-keep hidden md:block">
                  빠뜨린 물건 없이<br/>완벽하게 준비
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-2 rounded-full mt-3 group-hover:bg-white/20 transition-colors">
                <ArrowRight className="text-white" size={16} />
              </div>
            </div>
          </Link>

          <Link href="/tracker" className="group block h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2rem] p-6 h-full shadow-md hover:shadow-lg hover:shadow-amber-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[160px] md:min-h-[200px]">
              <div>
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-amber-50 text-[9px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  Tracker
                </span>
                <h2 className="text-lg md:text-xl font-black text-white mb-1 leading-tight">
                  여행<br/>간편 가계부
                </h2>
                <p className="text-amber-100 text-[10px] md:text-xs font-medium opacity-90 break-keep hidden md:block">
                  실시간 환율 계산<br/>지출 내역 저장
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-2 rounded-full mt-3 group-hover:bg-white/20 transition-colors">
                <Wallet className="text-white" size={16} />
              </div>
            </div>
          </Link>

          <Link href="/test" className="group block h-full col-span-2 md:col-span-1 lg:col-span-1">
            <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2rem] p-6 h-full shadow-md hover:shadow-lg hover:shadow-rose-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[160px] md:min-h-[200px]">
              <div>
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-rose-50 text-[9px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  MBTI
                </span>
                <h2 className="text-lg md:text-xl font-black text-white mb-1 leading-tight">
                  나의 여행<br/>성향 찾기
                </h2>
                <p className="text-rose-100 text-[10px] md:text-xs font-medium opacity-90 break-keep hidden md:block">
                  "나는 어떤 여행자?"<br/>성향별 추천
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-2 rounded-full mt-3 group-hover:bg-white/20 transition-colors">
                <Sparkles className="text-white" size={16} />
              </div>
            </div>
          </Link>
        </div>

        <div className="w-full bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200">
          <SearchAndFilter initialData={countries ?? []} />
        </div>
      </main>
    </div>
  );
}