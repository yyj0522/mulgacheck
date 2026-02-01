import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SearchAndFilter from "@/components/SearchAndFilter";
import { ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function Home() {
  const { data: countries } = await supabase
    .from("countries")
    .select("*, exchange_rates(rate_to_krw)");

  return (
    <div className="min-h-screen bg-slate-50 bg-dot-pattern flex flex-col items-center">
      
      <header className="w-full max-w-7xl px-6 pt-12 pb-10 flex flex-col items-center z-10">
        <nav className="w-full flex justify-between items-center mb-16">
          <div className="relative w-64 h-20">
            <Image 
              src="/logo.png" 
              alt="물가어때" 
              fill 
              className="object-contain" 
              priority 
              quality={100} 
            />
          </div>
          <div className="px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Beta v1.0
          </div>
        </nav>

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
        <Link href="/checklist" className="block mb-8 group">
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-indigo-50 text-[11px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  New Feature
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-md">
                  빠뜨린 물건 없으신가요?
                </h2>
                <p className="text-indigo-100 font-medium drop-shadow-sm opacity-90">
                  여행 준비물 체크리스트로 완벽하게 짐을 싸보세요.
                </p>
              </div>
              <div className="bg-white text-indigo-600 pl-6 pr-5 py-3 rounded-full font-bold text-sm shadow-md flex items-center gap-2 group-hover:bg-indigo-50 transition-all">
                지금 체크하기 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          </div>
        </Link>

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