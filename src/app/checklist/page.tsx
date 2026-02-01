"use client";

import { useState, useEffect, useRef } from "react";
import { CHECKLIST_CATEGORIES } from "@/data/checklistItems";
import { Check, Share2, Download, RefreshCw, ArrowLeft, X } from "lucide-react"; // ✅ X 아이콘 추가
import Link from "next/link";
import { toPng } from "html-to-image";

export default function ChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // ✅ 이미지 미리보기 상태
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sharedData = searchParams.get("data");

    if (sharedData) {
      try {
        const decodedString = decodeURIComponent(atob(sharedData));
        const decoded = JSON.parse(decodedString);
        setCheckedItems(decoded);
      } catch (e) {
        console.error("공유 데이터 파싱 실패", e);
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

  const handleShare = async () => {
    try {
      const data = btoa(encodeURIComponent(JSON.stringify(checkedItems)));
      const url = `${window.location.origin}${window.location.pathname}?data=${data}`;

      if (navigator.share) {
        await navigator.share({
          title: '물가어때 - 여행 짐 싸기 체크리스트',
          text: `현재 ${checkedItems.length}개의 짐을 챙겼어요! 제 리스트를 확인해보세요.`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("🔗 링크가 복사되었습니다! 카카오톡이나 디스코드에 붙여넣기 하세요.");
      }
    } catch (err) {
      console.error("공유 실패:", err);
    }
  };

  // ✅ [수정됨] 이미지를 바로 다운로드하지 않고 모달로 띄움
  const handleGenerateImage = async () => {
    if (captureRef.current === null) return;

    try {
      // 로딩 중 표시 등을 넣고 싶다면 여기에 state 추가 가능
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        backgroundColor: "#F8FAFC",
        pixelRatio: 2,
      });
      
      // PC에서는 바로 다운로드, 모바일에서는 미리보기 띄우기
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        setPreviewUrl(dataUrl); // 모바일: 팝업 띄우기
      } else {
        // PC: 바로 다운로드
        const link = document.createElement("a");
        link.download = "mulgaeottae_checklist.png";
        link.href = dataUrl;
        link.click();
      }
      
    } catch (err) {
      console.error("이미지 생성 실패:", err);
      alert("이미지 생성 중 오류가 발생했습니다.");
    }
  };

  const totalItems = CHECKLIST_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedCount = checkedItems.length;
  const progress = Math.round((checkedCount / totalItems) * 100);

  if (!isLoaded) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-32 relative">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-2xl font-black text-slate-800">여행 짐 싸기</h1>
          <button 
            onClick={resetList}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors text-slate-400 shadow-sm"
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

        <div ref={captureRef} className="bg-[#F8FAFC] p-4 -m-4">
          <div className="text-center mb-8 md:hidden">
             <h2 className="text-xl font-bold text-slate-800">✈️ 나의 여행 체크리스트</h2>
             <p className="text-xs text-slate-400 mt-1">물가어때(Mulgaeottae) 제공</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CHECKLIST_CATEGORIES.map((category) => (
              <div key={category.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 mb-5 flex items-center gap-2 pb-2 border-b border-slate-50">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block" />
                  {category.label}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li 
                      key={item} 
                      onClick={() => toggleItem(item)}
                      className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                      <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        checkedItems.includes(item) 
                          ? "bg-indigo-500 border-indigo-500" 
                          : "bg-slate-50 border-slate-200 group-hover:border-indigo-300"
                      }`}>
                        {checkedItems.includes(item) && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      
                      <span className={`text-sm transition-colors ${
                        checkedItems.includes(item) 
                          ? "text-slate-400 line-through font-medium" 
                          : "text-slate-700 font-bold"
                      }`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center hidden md:block">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Powered by Mulgaeottae</p>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-30">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button 
            onClick={handleShare}
            className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-full shadow-lg shadow-slate-200/50 flex items-center justify-center gap-2 hover:bg-slate-50 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Share2 size={20} /> 친구 공유
          </button>
          <button 
            onClick={handleGenerateImage}
            className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Download size={20} /> 이미지 저장
          </button>
        </div>
      </div>

      {/* ✅ [추가됨] 이미지 저장 미리보기 모달 (모바일 대응) */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-black text-slate-900 mb-2 text-center">이미지 저장하기</h3>
            <p className="text-sm text-indigo-600 font-bold text-center mb-4 bg-indigo-50 py-2 rounded-xl">
              👆 이미지를 꾹~ 눌러서 저장하세요!
            </p>
            
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="체크리스트 결과" className="w-full h-auto object-contain" />
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