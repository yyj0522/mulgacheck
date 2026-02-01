import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SearchAndFilter from "@/components/SearchAndFilter";
import { ArrowRight, Calculator, Sparkles } from "lucide-react";

export const revalidate = 3600;

export default async function Home() {
  const { data: countries } = await supabase
    .from("countries")
    .select("*, exchange_rates(rate_to_krw)");

  return (
    <div className="min-h-screen bg-slate-50 bg-dot-pattern flex flex-col items-center relative">
      {/* ✅ 수정됨: 로고와 배지 위치 조정 (안쪽으로 모으고 아래로 내림) */}
      <nav className="absolute top-0 left-0 right-0 mx-auto w-full max-w-7xl flex justify-between items-start px-6 pt-8 md:px-8 z-50">
        <div className="relative w-40 h-12 md:w-56 md:h-16">
          <Image 
            src="/logo.png" 
            alt="물가어때" 
            fill 
            className="object-contain object-left-top" 
            priority 
            quality={75} 
          />
        </div>
        <div className="px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">
          Beta v1.0
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

      <main className="w-full max-w-7xl px-6 pb-32 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/checklist" className="group block h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2.5rem] p-8 h-full shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-indigo-50 text-[10px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  Checklist
                </span>
                <h2 className="text-2xl font-black text-white mb-2 leading-tight">
                  짐 싸기<br/>체크리스트
                </h2>
                <p className="text-indigo-100 text-sm font-medium opacity-90">
                  빠뜨린 물건 없이<br/>완벽하게 준비하세요.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-3 rounded-full mt-4 group-hover:bg-white/20 transition-colors">
                <ArrowRight className="text-white" size={20} />
              </div>
            </div>
          </Link>

          <Link href="/budget" className="group block h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 h-full shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-emerald-50 text-[10px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  Budget Explorer
                </span>
                <h2 className="text-2xl font-black text-white mb-2 leading-tight">
                  예산으로<br/>여행지 찾기
                </h2>
                <p className="text-emerald-100 text-sm font-medium opacity-90">
                  "100만원으로 어디 가지?"<br/>물가어때가 추천해드려요.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-3 rounded-full mt-4 group-hover:bg-white/20 transition-colors">
                <Calculator className="text-white" size={20} />
              </div>
            </div>
          </Link>

          <Link href="/test" className="group block h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2.5rem] p-8 h-full shadow-xl shadow-rose-200 hover:shadow-2xl hover:shadow-rose-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-rose-50 text-[10px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  Travel MBTI
                </span>
                <h2 className="text-2xl font-black text-white mb-2 leading-tight">
                  나의 여행<br/>성향 찾기
                </h2>
                <p className="text-rose-100 text-sm font-medium opacity-90">
                  "나는 어떤 여행자일까?"<br/>성향별 여행지 추천받기
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm self-start p-3 rounded-full mt-4 group-hover:bg-white/20 transition-colors">
                <Sparkles className="text-white" size={20} />
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white/50 backdrop-blur-sm border border-white/60 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-slate-200/40">
          <SearchAndFilter initialData={countries ?? []} />
        </div>
      </main>

      <footer className="w-full py-10 border-t border-slate-200 bg-white text-center">
        <div className="flex justify-center gap-6 mb-4 text-xs font-bold text-slate-500">
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">
            이용약관
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
            개인정보처리방침
          </Link>
        </div>
        <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          © 2026 MULGAEOTTAE. All rights reserved.
        </p>
      </footer>
    </div>
  );
}