"use client";

import { useState } from "react";
import { Calculator, Calendar, Utensils, Bus, Hotel } from "lucide-react";

interface Props {
  mealKrw: number;
  transportKrw: number;
  accommodationKrw: number; // 숙박비 추가
}

export default function BudgetCalculator({ mealKrw, transportKrw, accommodationKrw }: Props) {
  const [budget, setBudget] = useState<number>(1000000); // 숙박비가 들어가니 기본값을 100만 원으로 상향

  // 하루 생활비 공식: (식비 * 3) + (교통비 * 2) + 숙박비(1박)
  const dailyCost = (mealKrw * 3) + (transportKrw * 2) + accommodationKrw;
  const days = dailyCost > 0 ? Math.floor(budget / dailyCost) : 0;

  return (
    <div className="mt-10 pt-10 border-t border-slate-100 text-left">
      <h3 className="flex items-center gap-2 font-bold text-[#102A43] mb-6">
        <Calculator size={20} className="text-[#2680EB]" /> 예산별 체류 기간 계산
      </h3>

      <div className="relative mb-6">
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full p-5 bg-slate-50 rounded-2xl border-none text-2xl font-black text-[#102A43] focus:ring-2 focus:ring-blue-100 outline-none"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">원</span>
      </div>

      <div className="bg-[#2680EB] p-6 rounded-3xl text-white shadow-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Calendar size={20} />
            <span className="font-bold">예상 체류 가능 기간</span>
          </div>
          <span className="text-4xl font-black">약 {days}일</span>
        </div>
        <p className="text-blue-100 text-[10px] text-right">* 하루 3끼 + 교통 2회 + 숙박 1박 기준</p>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex justify-between p-3 bg-white border border-slate-100 rounded-xl">
          <span className="text-slate-400 flex items-center gap-2"><Hotel size={14}/> 평균 숙박비 (1박)</span>
          <span className="font-bold text-slate-700">약 {accommodationKrw.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}