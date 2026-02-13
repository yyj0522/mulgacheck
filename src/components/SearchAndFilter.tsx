"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ArrowRight, TrendingDown } from "lucide-react";

export default function SearchAndFilter({ initialData = [] }: { initialData: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const safeData = Array.isArray(initialData) ? initialData : [];

  const filteredData = safeData
    .filter((item) => {
      if (!item) return false;
      const term = searchTerm.toLowerCase();
      const ko = (item.name_ko || "").toLowerCase();
      const en = (item.name_en || "").toLowerCase();
      return ko.includes(term) || en.includes(term);
    })
    .sort((a, b) => {
      const rateA = a.exchange_rates?.rate_to_krw || 0;
      const rateB = b.exchange_rates?.rate_to_krw || 0;
      if (sortBy === "cheap") return (a.meal_price_local * rateA) - (b.meal_price_local * rateB);
      return (a.name_ko || "").localeCompare(b.name_ko || "");
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Search size={22} />
          </div>
          <input
            type="text"
            placeholder="떠나고 싶은 도시를 검색하세요 (예: 도쿄, 다낭)"
            className="w-full h-16 pl-14 pr-6 bg-white border border-slate-200 rounded-2xl outline-none text-slate-800 font-bold placeholder:text-slate-300 placeholder:font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-56 group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600">
            <TrendingDown size={20} />
          </div>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown size={16} />
          </div>
          <select
            className="w-full h-16 pl-12 pr-10 bg-white border border-slate-200 rounded-2xl outline-none text-slate-800 font-bold appearance-none cursor-pointer focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm hover:bg-slate-50"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">이름순 보기</option>
            <option value="cheap">물가 낮은순</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredData.length > 0 ? (
          filteredData.map((country) => (
            <Link key={country.id} href={`/destination/${country.id}`} className="group block h-full">
              <div className="h-full bg-white border border-slate-100 rounded-3xl p-6 hover:border-indigo-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                
                <div className="flex justify-between items-start mb-6">
                  <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {country.flag_emoji}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <ArrowRight size={14} strokeWidth={3} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider border border-indigo-100 px-1.5 py-0.5 rounded">
                      {country.currency_code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {country.name_ko?.split(' - ')[0]}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-1 truncate group-hover:text-indigo-700 transition-colors">
                    {country.name_ko?.split(' - ')[1] || country.name_ko}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 truncate font-sans">
                    {country.name_en}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400 font-bold mb-2">검색 결과가 없습니다.</p>
            <p className="text-sm text-slate-400">다른 도시 이름으로 검색해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}