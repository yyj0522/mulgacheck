"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Wallet, Plus, Trash2, Download, RefreshCw, X, Coins } from "lucide-react";
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
    if (!desc || !amount) return alert("내용과 금액을 입력해주세요.");

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
    if (confirm("이 내역을 삭제하시겠습니까?")) {
      setExpenses(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleReset = () => {
    if (confirm("모든 지출 내역을 초기화하시겠습니까? (복구할 수 없습니다)")) {
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
      alert("이미지 생성 중 오류가 발생했습니다.");
    }
  };

  const groupedExpenses = expenses.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, ExpenseItem[]>);

  const totalLocal = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalKrw = expenses.reduce((sum, item) => sum + item.krwAmount, 0);

  if (!isLoaded) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-24 relative">
      <div className="max-w-md mx-auto">
        <header className="flex justify-between items-center mb-6">
          <Link href="/" className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">여행 가계부</h1>
          <button 
            onClick={handleReset}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors text-slate-400 shadow-sm"
          >
            <RefreshCw size={20} />
          </button>
        </header>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">어디로 여행가세요?</label>
            <select 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-amber-500 transition-colors"
                value={selectedCountry?.id || ""}
                onChange={(e) => {
                    const country = countries.find(c => c.id === e.target.value);
                    setSelectedCountry(country || null);
                }}
            >
                <option value="">국가를 선택해주세요</option>
                {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name_ko} ({c.currency_code})</option>
                ))}
            </select>
            {selectedCountry && (
                <div className="mt-3 text-right text-xs font-medium text-slate-400">
                    적용 환율: 1 {selectedCountry.currency_code} = {selectedCountry.exchange_rates?.rate_to_krw.toFixed(2)}원
                </div>
            )}
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">날짜</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 outline-none" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">시간</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 outline-none" />
                </div>
            </div>
            <div className="mb-3">
                <input 
                    type="text" 
                    placeholder="사용 내역 (예: 편의점 간식)" 
                    value={desc} 
                    onChange={e => setDesc(e.target.value)} 
                    className="w-full p-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                />
            </div>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input 
                        type="number" 
                        placeholder="0" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleAddExpense()}
                        className="w-full p-4 bg-slate-50 rounded-xl text-lg font-black text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-amber-100 transition-all pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        {selectedCountry?.currency_code || '-'}
                    </span>
                </div>
                <button 
                    onClick={handleAddExpense}
                    className="bg-amber-500 text-white px-5 rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200"
                >
                    <Plus size={24} />
                </button>
            </div>
        </div>

        {expenses.length > 0 ? (
            <>
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={handleGenerateImage}
                        className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-700 transition-colors shadow-md"
                    >
                        <Download size={14} /> 영수증 저장하기
                    </button>
                </div>

                <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
                    <div ref={captureRef} className="bg-white p-6 min-h-[400px]">
                        <div className="text-center mb-8 border-b-2 border-dashed border-slate-100 pb-6">
                            <h2 className="text-2xl font-black text-slate-800 mb-1">TRAVEL RECEIPT</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                {selectedCountry?.name_ko || '여행'} 지출 내역서
                            </p>
                        </div>

                        <div className="space-y-6">
                            {Object.entries(groupedExpenses).sort((a, b) => b[0].localeCompare(a[0])).map(([day, items]) => (
                                <div key={day}>
                                    <h3 className="text-xs font-bold text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded-md mb-3">
                                        {day}
                                    </h3>
                                    <ul className="space-y-3">
                                        {items.map((item) => (
                                            <li key={item.id} className="flex justify-between items-start group">
                                                <div className="flex gap-3">
                                                    <span className="text-xs font-medium text-slate-300 w-10 pt-0.5">{item.time}</span>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">{item.desc}</p>
                                                        <p className="text-[10px] text-slate-400">
                                                            {item.amount.toLocaleString()} {selectedCountry?.currency_code}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-800">
                                                        {item.krwAmount.toLocaleString()}원
                                                    </span>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-slate-300 hover:text-rose-500 transition-colors p-1 ml-1"
                                                        data-html2canvas-ignore="true"
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

                        <div className="mt-8 pt-6 border-t-2 border-slate-800">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-bold text-slate-500">TOTAL ({selectedCountry?.currency_code})</span>
                                <span className="text-lg font-bold text-slate-800">{totalLocal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-black text-slate-800">합계 (KRW)</span>
                                <span className="text-3xl font-black text-amber-500">{totalKrw.toLocaleString()}원</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-center">
                            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">Powered by MulgaCheck</p>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Coins size={32} />
                </div>
                <p className="text-slate-400 font-bold text-sm">지출 내역이 없습니다.</p>
                <p className="text-slate-300 text-xs mt-1">여행 중 사용한 금액을 기록해보세요!</p>
            </div>
        )}
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-2 text-center">영수증 저장하기</h3>
            <p className="text-sm text-amber-500 font-bold text-center mb-4 bg-amber-50 py-2 rounded-xl">
              이미지를 꾹 눌러서 저장하세요!
            </p>
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 max-h-[60vh] overflow-y-auto">
              <img src={previewUrl} alt="지출 영수증" className="w-full h-auto object-contain" />
            </div>
            <button 
              onClick={() => setPreviewUrl(null)}
              className="w-full mt-6 py-4 bg-slate-900 text-white font-bold rounded-xl"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}