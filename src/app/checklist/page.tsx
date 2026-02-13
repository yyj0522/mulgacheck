"use client";

import { useState, useEffect, useRef } from "react";
import { CHECKLIST_CATEGORIES } from "@/data/checklistItems";
import { Check, Share2, Download, RefreshCw, ArrowLeft, X, Plus, Trash2, PackageCheck } from "lucide-react";
import Link from "next/link";
import { toPng } from "html-to-image";
import WingBanners from "@/components/WingBanners";

export default function ChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItemInput, setNewItemInput] = useState("");
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const captureRef = useRef<HTMLDivElement>(null);

  const getAllItems = () => {
    const standardItems = CHECKLIST_CATEGORIES.flatMap((category) => category.items);
    return [...standardItems, ...customItems];
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sharedData = searchParams.get("data");

    if (sharedData) {
      try {
        const decodedString = atob(sharedData);
        if (decodedString.startsWith("[")) {
          const decoded = JSON.parse(decodeURIComponent(decodedString));
          setCheckedItems(decoded);
        } else {
          const standardItems = CHECKLIST_CATEGORIES.flatMap((c) => c.items);
          const indices = decodedString.split(",").map(Number);
          const restoredItems = indices
            .map((index) => standardItems[index])
            .filter((item) => item !== undefined);
          setCheckedItems(restoredItems);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      const savedChecked = localStorage.getItem("travel_checklist");
      const savedCustom = localStorage.getItem("travel_custom_items");
      
      if (savedChecked) {
        setCheckedItems(JSON.parse(savedChecked));
      }
      if (savedCustom) {
        setCustomItems(JSON.parse(savedCustom));
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("travel_checklist", JSON.stringify(checkedItems));
      localStorage.setItem("travel_custom_items", JSON.stringify(customItems));
    }
  }, [checkedItems, customItems, isLoaded]);

  const toggleItem = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const addCustomItem = () => {
    if (!newItemInput.trim()) return;
    if (customItems.includes(newItemInput)) {
        alert("이미 목록에 있는 아이템입니다.");
        return;
    }
    
    setCustomItems((prev) => [...prev, newItemInput]);
    setCheckedItems((prev) => [...prev, newItemInput]);
    setNewItemInput("");
  };

  const removeCustomItem = (itemToRemove: string) => {
    if(confirm(`'${itemToRemove}' 항목을 삭제하시겠습니까?`)) {
        setCustomItems((prev) => prev.filter(item => item !== itemToRemove));
        setCheckedItems((prev) => prev.filter(item => item !== itemToRemove));
    }
  };

  const resetList = () => {
    if (confirm("모든 체크 상태를 초기화하시겠습니까? (추가한 아이템은 유지됩니다)")) {
      setCheckedItems([]);
    }
  };

  const handleShare = async () => {
    try {
        const data = btoa(encodeURIComponent(JSON.stringify(checkedItems)));
        const url = `${window.location.origin}${window.location.pathname}?data=${data}`;

        const shareData = {
            title: '물가체크 - 여행 짐 싸기 체크리스트',
            text: `여행 준비 짐 싸기 리스트를 공유합니다.`,
            url: url,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(url);
            alert("링크가 복사되었습니다! 카카오톡이나 디스코드에 붙여넣기 하세요.");
        }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateImage = async () => {
    if (captureRef.current === null) return;

    try {
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#F8FAFC",
      });
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        setPreviewUrl(dataUrl);
      } else {
        const link = document.createElement("a");
        link.download = `mulgacheck_checklist_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
      
    } catch (err) {
      console.error(err);
      alert("이미지 생성 중 오류가 발생했습니다.");
    }
  };

  const checkedCount = checkedItems.length;

  if (!isLoaded) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-4 relative">
      <WingBanners />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-6">
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

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 sticky top-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                <PackageCheck size={24} />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Checked Items</p>
                <p className="text-xl font-black text-slate-800">
                    현재 <span className="text-indigo-600 text-2xl">{checkedCount}</span>개 챙겼어요
                </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F8FAFC] p-4 -m-4">
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

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm md:col-span-2">
                <h3 className="font-bold text-lg text-slate-800 mb-5 flex items-center gap-2 pb-2 border-b border-slate-50">
                  <span className="w-1.5 h-6 bg-slate-800 rounded-full inline-block" />
                  나만의 아이템 추가
                </h3>
                
                {customItems.length > 0 && (
                    <ul className="space-y-3 mb-6">
                        {customItems.map((item) => (
                            <li key={item} className="flex items-center justify-between group bg-slate-50 rounded-xl p-2 hover:bg-slate-100 transition-colors">
                                <div 
                                    onClick={() => toggleItem(item)}
                                    className="flex items-center gap-3 cursor-pointer select-none flex-1"
                                >
                                    <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all bg-white ${
                                        checkedItems.includes(item) 
                                        ? "bg-indigo-500 border-indigo-500" 
                                        : "border-slate-200 group-hover:border-indigo-300"
                                    }`}>
                                        {checkedItems.includes(item) && <Check size={14} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <span className={`text-sm font-bold ${checkedItems.includes(item) ? "text-slate-400 line-through" : "text-slate-700"}`}>
                                        {item}
                                    </span>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeCustomItem(item);
                                    }}
                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newItemInput}
                        onChange={(e) => setNewItemInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
                        placeholder="예: 애착인형, 비상금"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button 
                        onClick={addCustomItem}
                        className="bg-slate-800 text-white px-4 rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2 font-bold text-sm"
                    >
                        <Plus size={18} /> <span className="hidden sm:inline">추가</span>
                    </button>
                </div>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button 
              onClick={handleShare}
              className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl shadow-lg shadow-slate-200/50 flex items-center justify-center gap-2 hover:bg-slate-50 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Share2 size={20} /> 친구 공유
            </button>
            <button 
              onClick={handleGenerateImage}
              className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Download size={20} /> 이미지 저장
            </button>
          </div>
          <div className="w-full flex flex-col justify-center items-center mt-8 mb-6">
            <div className="hidden md:block">
              <iframe 
                src="https://ads-partners.coupang.com/widgets.html?id=963064&template=carousel&trackingCode=AF1306700&subId=&width=680&height=140&tsource=" 
                width="680" 
                height="140" 
                frameBorder="0" 
                scrolling="no" 
                referrerPolicy="unsafe-url"
              />
            </div>
            <div className="block md:hidden">
              <iframe 
                src="https://ads-partners.coupang.com/widgets.html?id=963064&template=carousel&trackingCode=AF1306700&subId=&width=320&height=100&tsource=" 
                width="320" 
                height="100" 
                frameBorder="0" 
                scrolling="no" 
                referrerPolicy="unsafe-url"
              />
            </div>
          </div>
          <div className="text-center mb-4">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Powered by MulgaCheck</p>
          </div>

        </div>
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
            
            <h3 className="text-lg font-black text-slate-900 mb-2 text-center">이미지 저장하기</h3>
            <p className="text-sm text-indigo-600 font-bold text-center mb-4 bg-indigo-50 py-2 rounded-xl">
              이미지를 꾹 눌러서 저장하세요!
            </p>
            
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
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

      <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
        <div 
          ref={captureRef} 
          className="w-[600px] bg-[#F8FAFC] p-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-slate-900 mb-2">My Travel Packing List</h1>
            <p className="text-lg text-slate-500 font-bold">물가체크 (MulgaCheck) 제공</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm mb-6 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <PackageCheck size={28} />
                </div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase mb-0.5">Status</p>
                    <p className="text-2xl font-black text-slate-800">{checkedCount}개 <span className="text-lg text-slate-500 font-bold">챙김</span></p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-sm font-bold text-slate-400">MulgaCheck</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {CHECKLIST_CATEGORIES.map((category) => (
              <div key={category.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block" />
                  {category.label}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center ${
                        checkedItems.includes(item) 
                          ? "bg-indigo-500 border-indigo-500" 
                          : "bg-slate-50 border-slate-300"
                      }`}>
                        {checkedItems.includes(item) && <Check size={14} className="text-white" strokeWidth={4} />}
                      </div>
                      <span className={`text-base ${
                        checkedItems.includes(item) 
                          ? "text-slate-400 line-through font-medium" 
                          : "text-slate-800 font-bold"
                      }`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {customItems.length > 0 && (
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm col-span-2">
                    <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                      <span className="w-1.5 h-6 bg-slate-800 rounded-full inline-block" />
                      직접 추가한 물건
                    </h3>
                    <ul className="space-y-3 grid grid-cols-2 gap-x-4">
                        {customItems.map((item) => (
                            <li key={item} className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center ${
                                    checkedItems.includes(item) 
                                    ? "bg-indigo-500 border-indigo-500" 
                                    : "bg-slate-50 border-slate-300"
                                }`}>
                                    {checkedItems.includes(item) && <Check size={14} className="text-white" strokeWidth={4} />}
                                </div>
                                <span className={`text-base ${checkedItems.includes(item) ? "text-slate-400 line-through font-medium" : "text-slate-800 font-bold"}`}>
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}