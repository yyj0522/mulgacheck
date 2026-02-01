"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpDown } from "lucide-react";

export default function SearchAndFilter({ initialData }: { initialData: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredData = initialData
    .filter((item) => 
      item.name_ko.includes(searchTerm) || 
      item.name_en.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name_ko.localeCompare(b.name_ko);
      if (sortBy === "cheap") return (a.meal_price_local * (a.exchange_rates?.rate_to_krw || 0)) - (b.meal_price_local * (b.exchange_rates?.rate_to_krw || 0));
      return 0;
    });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input
            type="text"
            placeholder="도시나 국가를 검색해보세요"
            className="w-full p-5 pl-14 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <ArrowUpDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <select 
            className="appearance-none p-5 pl-14 pr-12 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 cursor-pointer"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">이름순</option>
            <option value="cheap">물가 저렴한순</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {filteredData.map((country) => (
          <Link 
            key={country.id} 
            href={`/destination/${country.id}`}
            className="group flex flex-col items-center p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {country.flag_emoji}
            </div>
            <span className="font-bold text-slate-800 text-base text-center break-keep">{country.name_ko.split(' - ')[1] || country.name_ko}</span>
            <span className="text-[11px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
              {country.name_ko.split(' - ')[0]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}