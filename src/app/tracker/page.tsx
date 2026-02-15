"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Wallet, Plus, Trash2, Download, RefreshCw, X, Coins, Calendar, Clock, MapPin, Receipt } from "lucide-react";
import { toPng } from "html-to-image";
import WingBanners from "@/components/WingBanners";
import MainBottomAd from "@/components/MainBottomAd";

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
    <div className="min-h-screen bg-[#F8FAFC] relative z-10 flex flex-col items-center pt-6 pb-4">
      <WingBanners />
      <div className="w-full max-w-md px-6 flex flex-col gap-4">
        <header className="flex justify-between items-center">
          <Link href="/" className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm group">
            <ArrowLeft size={20} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-black text-slate-900 flex items-center justify-center gap-2">
              여행 가계부
            </h1>
          </div>
          <button 
            onClick={handleReset}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-colors text-slate-400 shadow-sm"
          >
            <RefreshCw size={20} />
          </button>
        </header>

        <div className="bg-white p-6 rounded-[2rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 transition-all hover:shadow-lg">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-3 ml-1 tracking-wider flex items-center gap-1">
                <MapPin size={12} /> Destination
            </label>
            <div className="relative">
                <select 
                    className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-black text-lg text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
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
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="https://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
            {selectedCountry && (
                <div className="mt-4 flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-500">환율 정보</span>
                    <span className="text-xs font-black text-indigo-600">
                        1 {selectedCountry.currency_code} = {selectedCountry.exchange_rates?.rate_to_krw.toFixed(2)}원
                    </span>
                </div>
            )}
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1 flex items-center gap-1">
                        <Calendar size={12} /> 날짜
                    </label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3.5 bg-slate-50 border-0 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all" />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1 flex items-center gap-1">
                        <Clock size={12} /> 시간
                    </label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-3.5 bg-slate-50 border-0 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all" />
                </div>
            </div>
            <div className="mb-3">
                <input 
                    type="text" 
                    placeholder="사용 내역 (예: 편의점, 택시비)" 
                    value={desc} 
                    onChange={e => setDesc(e.target.value)} 
                    className="w-full p-4 bg-slate-50 border-0 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
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
                        className="w-full p-4 bg-slate-50 border-0 rounded-2xl text-lg font-black text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        {selectedCountry?.currency_code || '-'}
                    </span>
                </div>
                <button 
                    onClick={handleAddExpense}
                    className="bg-slate-900 text-white w-16 rounded-2xl hover:bg-slate-800 transition-all hover:scale-95 active:scale-90 shadow-lg flex items-center justify-center"
                >
                    <Plus size={24} />
                </button>
            </div>
        </div>

        {expenses.length > 0 ? (
            <>
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div ref={captureRef} className="bg-white p-8 min-h-[400px]">
                        <div className="text-center mb-10 pb-6 border-b-2 border-dashed border-slate-100">
                            <div className="flex justify-center mb-3 text-slate-900">
                                <Receipt size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">TRAVEL RECEIPT</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                {selectedCountry?.name_ko || 'Trip'} Expenses
                            </p>
                        </div>

                        <div className="space-y-8">
                            {Object.entries(groupedExpenses).sort((a, b) => b[0].localeCompare(a[0])).map(([day, items]) => (
                                <div key={day}>
                                    <h3 className="text-xs font-black text-slate-800 mb-4 flex items-center gap-2 bg-slate-50 inline-block px-3 py-1 rounded-lg">
                                        <Calendar size={12} className="text-slate-400" />
                                        {day}
                                    </h3>
                                    <ul className="space-y-4 pl-2">
                                        {items.map((item) => (
                                            <li key={item.id} className="flex justify-between items-start group relative">
                                                <div className="flex gap-4">
                                                    <span className="text-[10px] font-bold text-slate-400 pt-0.5 w-8">{item.time}</span>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700 mb-0.5">{item.desc}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">
                                                            {item.amount.toLocaleString()} {selectedCountry?.currency_code}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex items-center gap-3">
                                                    <span className="text-sm font-black text-slate-800">
                                                        {item.krwAmount.toLocaleString()}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-slate-200 hover:text-rose-500 transition-colors"
                                                        data-html2canvas-ignore="true"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t-2 border-slate-900">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total ({selectedCountry?.currency_code})</span>
                                <span className="text-base font-bold text-slate-600">{totalLocal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-xl font-black text-slate-900 tracking-tight">TOTAL (KRW)</span>
                                <span className="text-3xl font-black text-indigo-600">{totalKrw.toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                <span>Powered by MulgaCheck</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleGenerateImage}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-xl shadow-slate-200"
                >
                    <Download size={20} /> 이미지로 영수증 저장하기
                </button>
            </>
        ) : (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                    <Coins size={40} />
                </div>
                <p className="text-slate-800 font-bold text-lg mb-2">지출 내역이 비어있어요</p>
                <p className="text-slate-400 text-sm">여행 중 사용한 금액을 기록하고 관리해보세요!</p>
            </div>
        )}
      </div>

      <MainBottomAd />

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-6 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-6 w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setPreviewUrl(null)}
              className="absolute top-5 right-5 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-slate-900 mb-2 text-center">영수증 저장</h3>
            <p className="text-xs text-indigo-600 font-bold text-center mb-6 bg-indigo-50 py-2 rounded-xl">
              이미지를 꾹 눌러서 저장하세요!
            </p>
            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 max-h-[60vh] overflow-y-auto">
              <img src={previewUrl} alt="지출 영수증" className="w-full h-auto object-contain" />
            </div>
            <button 
              onClick={() => setPreviewUrl(null)}
              className="w-full mt-6 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-800 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}