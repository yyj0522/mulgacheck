import { Plane, TrendingDown, TrendingUp } from "lucide-react";

interface PriceCardProps {
  country: string;
  city: string;
  priceKrw: number;
  diffPercent: number;
  category: string;
}

export default function PriceCard({ country, city, priceKrw, diffPercent, category }: PriceCardProps) {
  const isCheaper = diffPercent < 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wider">
            {country}
          </span>
          <h3 className="text-2xl font-bold mt-1 text-slate-800">{city}</h3>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl">
          <Plane className="w-6 h-6 text-slate-400" />
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <p className="text-slate-500 text-sm">{category} 체감 물가</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-slate-900">{priceKrw.toLocaleString()}</span>
          <span className="text-lg font-bold text-slate-600">원</span>
        </div>
      </div>

      <div className={`flex items-center gap-2 p-3 rounded-xl font-bold ${isCheaper ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {isCheaper ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
        <span>서울보다 {Math.abs(diffPercent)}% {isCheaper ? '저렴해요' : '비싸요'}</span>
      </div>
    </div>
  );
}