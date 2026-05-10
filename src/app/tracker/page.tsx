"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Download, RefreshCw, X, Coins, Calendar, Clock, MapPin, Receipt } from "lucide-react";
import { toPng } from "html-to-image";

type ExpenseItem = {
  id: string;
  date: string;
  time: string;
  desc: string;
  amount: number;
  krwAmount: number;
};

type CountryData = {
  id: string;
  name_ko: string;
  currency_code: string;
  exchange_rates: {
    rate_to_krw: number;
  } | null;
};

export default function TrackerPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("countries")
        .select("id, name_ko, currency_code, exchange_rates(rate_to_krw)")
        .order("name_ko");
      
      if (data) setCountries(data as any);

      const savedExpenses = localStorage.getItem("travel_expenses");
      const savedCountryId = localStorage.getItem("travel_country_id");

      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      
      if (savedCountryId && data) {
        const country = (data as any).find((c: CountryData) => c.id === savedCountryId);
        if (country) setSelectedCountry(country);
      }

      const now = new Date();
      setDate(now.toISOString().split('T')[0]);
      setTime(now.toTimeString().slice(0, 5));
      
      setIsLoaded(true);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("travel_expenses", JSON.stringify(expenses));
      if (selectedCountry) {
        localStorage.setItem("travel_country_id", selectedCountry.id);
      }
    }
  }, [expenses, selectedCountry, isLoaded]);

  const handleAddExpense = () => {
    if (!selectedCountry) return alert("여행할 국가를 먼저 선택해주세요.");
    if (!desc || !amount) return alert("사용 내역과 금액을 입력해주세요.");

    const rate = selectedCountry.exchange_rates?.rate_to_krw || 0;
    const numAmount = parseFloat(amount);
    
    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      date,
      time,
      desc,
      amount: numAmount,
      krwAmount: Math.round(numAmount * rate),
    };

    setExpenses(prev => [...prev, newItem].sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return b.time.localeCompare(a.time);
    }));

    setDesc("");
    setAmount("");
  };

  const handleDelete = (id: string) => {
    if (confirm("이 지출 내역을 삭제하시겠습니까?")) {
      setExpenses(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleReset = () => {
    if (confirm("모든 지출 내역을 초기화하시겠습니까? (복원할 수 없습니다)")) {
      setExpenses([]);
    }
  };

  const handleGenerateImage = async () => {
    if (captureRef.current === null) return;
    try {
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        setPreviewUrl(dataUrl);
      } else {
        const link = document.createElement("a");
        link.download = `travel_expense_${selectedCountry?.name_ko || 'trip'}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error(err);
      alert("영수증 이미지 생성 중 오류가 발생했습니다.");
    }
  };

  const groupedExpenses = expenses.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, ExpenseItem[]>);

  const totalLocal = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalKrw = expenses.reduce((sum, item) => sum + item.krwAmount, 0);

  if (!isLoaded) return <div className="min-h-screen bg-[#F5F7FA]" />;

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans">
      <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 pb-24 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* 좌측: 입력 폼 섹션 */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 lg:sticky lg:top-8 shrink-0">
            <header className="flex justify-between items-center bg-white p-5 rounded-[2rem] border border-slate-200/60 shadow-sm">
                <Link href="/" className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <ArrowLeft size={18} className="text-slate-600" />
                </Link>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">여행 가계부</h1>
                <button 
                    onClick={handleReset}
                    className="p-2.5 bg-slate-50 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors text-slate-400"
                    title="초기화"
                >
                    <RefreshCw size={18} />
                </button>
            </header>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm">
                <label className="text-[11px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1.5 tracking-wider">
                    <MapPin size={14} className="text-indigo-500" /> 목적지 설정
                </label>
                <div className="relative">
                    <select 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all appearance-none cursor-pointer mb-5"
                        value={selectedCountry?.id || ""}
                        onChange={(e) => {
                            const country = countries.find(c => c.id === e.target.value);
                            setSelectedCountry(country || null);
                        }}
                    >
                        <option value="">여행 국가 선택</option>
                        {countries.map(c => (
                            <option key={c.id} value={c.id}>{c.name_ko} ({c.currency_code})</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>

                {selectedCountry && (
                    <div className="flex justify-between items-center bg-indigo-50 px-4 py-3.5 rounded-xl border border-indigo-100">
                        <span className="text-xs font-bold text-indigo-500">현재 적용 환율</span>
                        <span className="text-sm font-black text-indigo-700">
                            1 {selectedCountry.currency_code} = {selectedCountry.exchange_rates?.rate_to_krw.toFixed(2)}원
                        </span>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/60 shadow-sm space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1.5 tracking-wider">
                            <Calendar size={14} className="text-indigo-500" /> 날짜
                        </label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)} 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all" 
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1.5 tracking-wider">
                            <Clock size={14} className="text-indigo-500" /> 시간
                        </label>
                        <input 
                            type="time" 
                            value={time} 
                            onChange={e => setTime(e.target.value)} 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all" 
                        />
                    </div>
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="사용 내역 (예: 점심 식사, 우버)" 
                        value={desc} 
                        onChange={e => setDesc(e.target.value)} 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all placeholder:text-slate-400" 
                    />
                </div>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <input 
                            type="number" 
                            placeholder="금액" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleAddExpense()} 
                            className="w-full p-4 pr-16 bg-slate-50 border border-slate-200 rounded-xl text-lg font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all placeholder:text-slate-300" 
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            {selectedCountry?.currency_code || '-'}
                        </span>
                    </div>
                    <button 
                        onClick={handleAddExpense} 
                        className="bg-slate-900 text-white w-16 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center shadow-md"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>
        </div>

        {/* 우측: 지출 내역 영수증 영역 */}
        <div className="flex-1 w-full flex flex-col gap-6">
            {expenses.length > 0 ? (
                <>
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div ref={captureRef} className="bg-white p-8 md:p-12 min-h-[500px]">
                            <div className="text-center mb-12 pb-8 border-b-2 border-dashed border-slate-200">
                                <Receipt size={40} className="mx-auto mb-4 text-slate-800" strokeWidth={1.5} />
                                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">TRAVEL RECEIPT</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                                    {selectedCountry?.name_ko || 'Trip'} Expenses
                                </p>
                            </div>

                            <div className="space-y-10">
                                {Object.entries(groupedExpenses).sort((a, b) => b[0].localeCompare(a[0])).map(([day, items]) => (
                                    <div key={day}>
                                        <h3 className="text-xs font-bold text-slate-600 mb-5 flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-lg w-max">
                                            <Calendar size={14} /> {day}
                                        </h3>
                                        <ul className="space-y-5 pl-2">
                                            {items.map((item) => (
                                                <li key={item.id} className="flex justify-between items-center group relative">
                                                    <div className="flex items-center gap-5">
                                                        <span className="text-[11px] font-black text-slate-400 w-10">{item.time}</span>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 mb-0.5">{item.desc}</p>
                                                            <p className="text-[11px] text-slate-500 font-medium">
                                                                {item.amount.toLocaleString()} {selectedCountry?.currency_code}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex items-center gap-4">
                                                        <span className="text-base font-black text-slate-900">
                                                            {item.krwAmount.toLocaleString()}원
                                                        </span>
                                                        <button 
                                                            onClick={() => handleDelete(item.id)} 
                                                            className="text-slate-200 hover:text-rose-500 transition-colors p-1" 
                                                            data-html2canvas-ignore="true"
                                                            title="삭제"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-14 pt-8 border-t-[3px] border-slate-900">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Total ({selectedCountry?.currency_code})
                                    </span>
                                    <span className="text-lg font-bold text-slate-700">
                                        {totalLocal.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-2xl font-black text-slate-900 tracking-tight">TOTAL (KRW)</span>
                                    <span className="text-4xl font-black text-indigo-600">
                                        {totalKrw.toLocaleString()}원
                                    </span>
                                </div>
                            </div>

                            <div className="mt-16 text-center">
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                    Powered by MulgaCheck
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleGenerateImage} 
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-md"
                    >
                        <Download size={20} /> 영수증 이미지로 저장
                    </button>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 text-slate-400">
                        <Coins size={36} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-2">지출 내역이 비어있습니다</h2>
                    <p className="text-slate-500 text-sm font-medium">좌측 입력 창을 통해 현지 지출을 기록해보세요.</p>
                </div>
            )}
        </div>
      </main>
      
      {previewUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button 
                onClick={() => setPreviewUrl(null)} 
                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors"
            >
                <X size={20} />
            </button>
            <h3 className="text-xl font-black text-slate-900 mb-2 text-center tracking-tight">영수증 이미지 저장</h3>
            <p className="text-xs text-indigo-600 font-bold text-center mb-5 bg-indigo-50 py-2 rounded-xl">
                이미지를 길게 눌러 기기에 저장하세요.
            </p>
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 max-h-[60vh] overflow-y-auto">
              <img src={previewUrl} alt="지출 영수증" className="w-full h-auto object-contain" />
            </div>
            <button 
                onClick={() => setPreviewUrl(null)} 
                className="w-full mt-6 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md"
            >
                닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}