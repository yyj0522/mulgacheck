"use client";

import { useState, useEffect, useRef } from "react";
import { CHECKLIST_CATEGORIES } from "@/data/checklistItems";
import { Check, Share2, Download, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import html2canvas from "html2canvas";

export default function ChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sharedData = searchParams.get("data");

    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        setCheckedItems(decoded);
      } catch (e) {
        console.error("공유 데이터 파싱 실패");
      }
    } else {
      const saved = localStorage.getItem("travel_checklist");
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("travel_checklist", JSON.stringify(checkedItems));
    }
  }, [checkedItems, isLoaded]);

  const toggleItem = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const resetList = () => {
    if (confirm("모든 체크리스트를 초기화하시겠습니까?")) {
      setCheckedItems([]);
    }
  };

  const copyShareLink = () => {
    const data = btoa(JSON.stringify(checkedItems));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    navigator.clipboard.writeText(url);
    alert("친구에게 공유할 링크가 복사되었습니다!");
  };

  // ✅ 수정된 이미지 다운로드 함수
  const downloadImage = async () => {
    if (captureRef.current) {
      try {
        const canvas = await html2canvas(captureRef.current, {
          backgroundColor: "#ffffff", // 배경을 완전한 흰색 HEX 코드로 강제 지정하여 lab 색상 오류 방지
          scale: 2, // 고해상도 캡처
          useCORS: true, // 크로스 오리진 이미지 허용
          logging: false, // 로그 끄기
        });
        const link = document.createElement("a");
        link.download = "travel_checklist.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error("이미지 저장 실패:", error);
        alert("이미지 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  const totalItems = CHECKLIST_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedCount = checkedItems.length;
  const progress = Math.round((checkedCount / totalItems) * 100);

  if (!isLoaded) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-32">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-2xl font-black text-slate-800">여행 짐 싸기</h1>
          <button 
            onClick={resetList}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors text-slate-400"
          >
            <RefreshCw size={20} />
          </button>
        </header>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 sticky top-4 z-20">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Packing Progress</p>
              <p className="text-3xl font-black text-indigo-600">{progress}% <span className="text-base text-slate-400 font-medium">완료</span></p>
            </div>
            <p className="text-sm font-bold text-slate-500">{checkedCount} / {totalItems}</p>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 캡처 영역 배경색 명시 */}
        <div ref={captureRef} className="bg-white p-6 rounded-[2rem] -mx-2 sm:mx-0">
          <div className="text-center mb-6 md:hidden">
             <h2 className="text-xl font-bold text-slate-800">✈️ 나의 여행 체크리스트</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CHECKLIST_CATEGORIES.map((category) => (
              <div key={category.id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200/60">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block" />
                  {category.label}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li 
                      key={item} 
                      onClick={() => toggleItem(item)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        checkedItems.includes(item) 
                          ? "bg-indigo-500 border-indigo-500" 
                          : "bg-white border-slate-300 group-hover:border-indigo-400"
                      }`}>
                        {checkedItems.includes(item) && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-sm font-bold transition-colors ${
                        checkedItems.includes(item) ? "text-slate-400 line-through" : "text-slate-700"
                      }`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Mulgaeottae</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 px-6 z-30">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button 
            onClick={copyShareLink}
            className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl shadow-lg shadow-slate-200/50 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Share2 size={20} /> 친구에게 공유
          </button>
          <button 
            onClick={downloadImage}
            className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Download size={20} /> 이미지 저장
          </button>
        </div>
      </div>
    </div>
  );
}