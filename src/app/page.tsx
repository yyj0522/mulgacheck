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
      
      <div className="fixed top-1/2 -translate-y-1/2 left-[50px] z-40 hidden lg:flex flex-col items-start gap-2 transition-all duration-300">
         <a 
          href="https://click.linkprice.com/click.php?m=rakutentr&a=A100702487&l=EtSC&u_id="
          target="_blank" 
          rel="noopener noreferrer nofollow"
          className="block w-[160px] h-[600px] shadow-lg hover:shadow-xl transition-shadow bg-white rounded-xl overflow-hidden"
        >
          <Image 
            src="https://img.linkprice.com/files/glink/rakutentr/20230807/G000zNVfRG000_rakutentr_160_600.jpg"
            alt="Rakuten Travel"
            width={160}
            height={600}
            priority
            unoptimized
            className="w-full h-full object-cover"
          />
        </a>
        <p className="text-[10px] text-slate-300 text-center w-full leading-tight">
          제휴 활동으로<br/>수수료를 제공받음
        </p>
      </div>

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

      <main className="w-full max-w-7xl px-6 pb-12 z-10">
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
                  "100만원으로 어디 가지?"<br/>물가체크가 추천해드려요.
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

        <div className="bg-white/50 backdrop-blur-sm border border-white/60 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-slate-200/40 mb-10">
          <SearchAndFilter initialData={countries ?? []} />
        </div>

        <div className="w-full flex flex-col items-center justify-center hidden md:flex">
          <a 
            href="https://click.linkprice.com/click.php?m=rakutentr&a=A100702487&l=5zP1&u_id="
            target="_blank" 
            rel="noopener noreferrer nofollow"
            className="block max-w-[728px] w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
          >
             <Image 
               src="https://img.linkprice.com/files/glink/rakutentr/20230807/000qzILW00000_728x90.png"
               alt="Rakuten Travel"
               width={728}
               height={90}
               unoptimized
               className="w-full h-auto object-cover"
             />
          </a>
          <p className="text-[10px] text-slate-400 mt-2">
            이 사이트는 제휴 마케팅 활동으로, 일정액의 수수료를 제공받을 수 있습니다.
          </p>
        </div>
      </main>
    </div>
  );
}