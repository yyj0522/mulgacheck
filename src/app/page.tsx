import Image from "next/image";
import PriceCard from "@/components/PriceCard";
import { Search } from "lucide-react";

export default function Home() {
  // 실제 데이터는 나중에 Supabase에서 fetch 해올 예정입니다 (현재는 Mock 데이터)
  const topDestinations = [
    { country: "Japan", city: "도쿄", priceKrw: 8200, diffPercent: -18, category: "한 끼 식사" },
    { country: "Vietnam", city: "다낭", priceKrw: 3500, diffPercent: -65, category: "한 끼 식사" },
    { country: "Thailand", city: "방콕", priceKrw: 4800, diffPercent: -52, category: "한 끼 식사" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Image src="/logo.png" alt="물가어때" width={130} height={40} priority />
          <div className="hidden md:flex gap-8 font-bold text-slate-600">
            <a href="#" className="hover:text-blue-600">물가랭킹</a>
            <a href="#" className="hover:text-blue-600">커뮤니티</a>
            <a href="#" className="hover:text-blue-600 text-blue-600">한달살기 계산기</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-8">
            지금 가장 가성비 좋은<br />
            <span className="text-blue-600">여행지는 어디일까?</span>
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="궁금한 국가나 도시를 검색해보세요"
              className="w-full px-8 py-6 rounded-full bg-white shadow-2xl border-none text-lg focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            />
            <button className="absolute right-3 top-3 bg-blue-600 p-4 rounded-full text-white hover:bg-blue-700 transition">
              <Search size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-slate-800">한국인이 사랑하는 TOP 10 🌏</h2>
          <button className="text-blue-600 font-bold hover:underline">전체보기</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topDestinations.map((dest, idx) => (
            <PriceCard key={idx} {...dest} />
          ))}
        </div>
      </section>

      {/* Footer (Google Adsense가 들어갈 자리) */}
      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <Image src="/logo.png" alt="물가어때" width={120} height={32} className="brightness-0 invert mb-6" />
            <p className="text-slate-400">전 세계 실시간 환율과 물가 데이터를 분석하여 최적의 여행지를 제안합니다.</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-8 flex items-center justify-center border border-slate-700">
            <p className="text-slate-500 italic">광고 배너 영역 (애드센스 승인 후 노출)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}