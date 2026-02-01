"use client";

import { useState } from "react";
import { SURVIVAL_DATA, getSurvivalCountry, SurvivalCard } from "@/data/survivalCards";
import { Maximize2, X, Volume2, MessageCircle } from "lucide-react";

type Props = {
  countryName: string;
};

export default function SurvivalCardList({ countryName }: Props) {
  const [selectedCard, setSelectedCard] = useState<SurvivalCard | null>(null);
  const targetCountry = getSurvivalCountry(countryName);
  const cards = SURVIVAL_DATA[targetCountry] || SURVIVAL_DATA["English"];
  const categories = ["식당", "교통", "숙소", "응급/기타"];
  const [activeCategory, setActiveCategory] = useState("식당");
  const filteredCards = cards.filter((card) => card.category === activeCategory);

  return (
    <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 my-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MessageCircle className="text-indigo-500" />
            현지 생존 카드
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            말이 안 통할 때, 화면을 크게 보여주세요!
          </p>
        </div>
        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
          {targetCountry === "English" && countryName !== "English" ? "English (공용어)" : targetCountry}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-slate-900 text-white shadow-md"
                : "bg-slate-50 text-slate-400 hover:bg-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className="group relative bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 p-5 rounded-2xl text-left transition-all hover:shadow-md flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-slate-800 text-lg mb-1">{card.kor}</p>
              <p className="text-sm text-slate-500 font-medium group-hover:text-indigo-600">
                {card.pronounce}
              </p>
            </div>
            <Maximize2 className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
          </button>
        ))}
      </div>

      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative flex flex-col items-center text-center">
     
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-6 right-6 p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mt-10 mb-8 w-full">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-4">
                {selectedCard.category}
              </span>
              <h3 className="text-2xl font-bold text-slate-400 mb-8">{selectedCard.kor}</h3>
              
              <div className="bg-slate-50 border-2 border-indigo-100 rounded-3xl p-8 mb-6 break-words">
                <p className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                  {selectedCard.local}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-500 bg-slate-100 py-3 px-6 rounded-xl inline-flex">
                <Volume2 size={18} />
                <p className="font-bold text-lg">{selectedCard.pronounce}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              화면을 직원에게 보여주세요
            </p>
          </div>
          
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setSelectedCard(null)} 
          />
        </div>
      )}
    </section>
  );
}