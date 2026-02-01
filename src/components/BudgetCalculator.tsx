"use client";

import { useState } from "react";
import { Calculator, Calendar, Utensils, Bus, Hotel } from "lucide-react";

interface Props {
  mealKrw: number;
  transportKrw: number;
  accommodationKrw: number;
  currencyCode: string; // ✅ 이 부분이 빠져서 에러가 났던 겁니다!
}

export default function BudgetCalculator({ mealKrw, transportKrw, accommodationKrw, currencyCode }: Props) {
  const [budget, setBudget] = useState<number>(1000000); 

  // 하루 생활비 공식: (식비 * 3) + (교통비 * 2) + 숙박비(1박)
  const dailyCost = (mealKrw * 3) + (transportKrw * 2) + accommodationKrw;
  const days = dailyCost > 0 ? Math.floor(budget / dailyCost) : 0;

  return (
    <div className="mt-10 pt-10 border-t border-slate-100 text-left">
      <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
        <Calculator size={20} className="text-indigo-500" /> 예산별 체류 기간 계산기
      </h3>

      <div className="relative mb-6">
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 text-2xl font-black text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">KRW</span>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-8 rounded-3xl text-white shadow-lg shadow-indigo-200 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-indigo-200" />
            <span className="font-bold text-indigo-100">예상 체류 가능 기간</span>
          </div>
          <span className="text-5xl font-black tracking-tight">{days}일</span>
        </div>
        <p className="text-indigo-200 text-xs text-right font-medium">* 하루 3끼 + 교통 2회 + 숙박 1박 기준</p>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex justify-between p-4 bg-white border border-slate-100 rounded-2xl items-center">
          <span className="text-slate-400 flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
            <Hotel size={14} /> 1박 평균 숙박비
          </span>
          <span className="font-bold text-slate-700 text-lg">
            {accommodationKrw > 0 ? `약 ${accommodationKrw.toLocaleString()}원` : "데이터 없음"}
          </span>
        </div>
        <div className="text-right mt-2">
           <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded">
             현지 통화 기준: {currencyCode}
           </span>
        </div>
      </div>
    </div>
  );
}