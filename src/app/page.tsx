import Image from "next/image";
import { supabase } from "@/lib/supabase";
import SearchAndFilter from "@/components/SearchAndFilter";

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
        <div className="bg-white/50 backdrop-blur-sm border border-white/60 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-slate-200/40">
          <SearchAndFilter initialData={countries ?? []} />
        </div>
      </main>

      <footer className="w-full py-10 border-t border-slate-200 bg-white text-center">
        <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          © 2026 MULGAEOTTAE. All rights reserved.
        </p>
      </footer>
    </div>
  );
}