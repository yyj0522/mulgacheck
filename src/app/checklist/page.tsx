"use client";

import { useState, useEffect, useRef } from "react";
import { CHECKLIST_CATEGORIES } from "@/data/checklistItems";
import { Check, Share2, Download, RefreshCw, ArrowLeft, X, Plus, Trash2, PackageCheck } from "lucide-react";
import Link from "next/link";
import { toPng } from "html-to-image";
import WingBanners from "@/components/WingBanners";
import { BOTTOM_ADS } from "@/data/adData";

type AddedItem = {
  category: string;
  name: string;
};

export default function ChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [deletedItems, setDeletedItems] = useState<string[]>([]);
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);
  
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const [isLoaded, setIsLoaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [bottomAd, setBottomAd] = useState(BOTTOM_ADS[0]);
  
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBottomAd(BOTTOM_ADS[Math.floor(Math.random() * BOTTOM_ADS.length)]);

    const searchParams = new URLSearchParams(window.location.search);
    const sharedData = searchParams.get("data");

    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
        if (decoded.checked) setCheckedItems(decoded.checked);
        if (decoded.deleted) setDeletedItems(decoded.deleted);
        if (decoded.added) setAddedItems(decoded.added);
      } catch (e) {
        console.error(e);
      }
    } else {
      const savedChecked = localStorage.getItem("travel_checklist_checked");
      const savedDeleted = localStorage.getItem("travel_checklist_deleted");
      const savedAdded = localStorage.getItem("travel_checklist_added");
      
      if (savedChecked) setCheckedItems(JSON.parse(savedChecked));
      if (savedDeleted) setDeletedItems(JSON.parse(savedDeleted));
      if (savedAdded) setAddedItems(JSON.parse(savedAdded));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("travel_checklist_checked", JSON.stringify(checkedItems));
      localStorage.setItem("travel_checklist_deleted", JSON.stringify(deletedItems));
      localStorage.setItem("travel_checklist_added", JSON.stringify(addedItems));
    }
  }, [checkedItems, deletedItems, addedItems, isLoaded]);

  const toggleItem = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const deleteItem = (item: string, isCustom: boolean) => {
    if (confirm(`'${item}' 항목을 삭제하시겠습니까?`)) {
      if (isCustom) {
        setAddedItems(prev => prev.filter(i => i.name !== item));
      } else {
        setDeletedItems(prev => [...prev, item]);
      }
      setCheckedItems(prev => prev.filter(i => i !== item));
    }
  };

  const addItem = (categoryLabel: string) => {
    const itemName = inputs[categoryLabel]?.trim();
    if (!itemName) return;

    const allItems = [
        ...CHECKLIST_CATEGORIES.flatMap(c => c.items),
        ...addedItems.map(i => i.name)
    ];

    if (allItems.includes(itemName)) {
        alert("이미 존재하는 아이템입니다.");
        return;
    }

    setAddedItems(prev => [...prev, { category: categoryLabel, name: itemName }]);
    setInputs(prev => ({ ...prev, [categoryLabel]: "" }));
  };

  const handleInputChange = (category: string, value: string) => {
    setInputs(prev => ({ ...prev, [category]: value }));
  };

  const resetList = () => {
    if (confirm("모든 체크 상태와 추가/삭제 내역을 초기화하시겠습니까?")) {
      setCheckedItems([]);
      setDeletedItems([]);
      setAddedItems([]);
    }
  };

  const handleShare = async () => {
    try {
        const shareObj = {
            checked: checkedItems,
            deleted: deletedItems,
            added: addedItems
        };
        const data = btoa(encodeURIComponent(JSON.stringify(shareObj)));
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

  const totalStandardItemsCount = CHECKLIST_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  const currentTotalCount = totalStandardItemsCount - deletedItems.length + addedItems.length;
  const checkedCount = checkedItems.length;
  const percentage = currentTotalCount > 0 ? Math.round((checkedCount / currentTotalCount) * 100) : 0;

  if (!isLoaded) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative z-10 flex flex-col items-center pt-6 pb-4">
      <WingBanners />
      
      <div className="w-full max-w-3xl px-6 flex flex-col">
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
                <p className="text-xl font-black text-slate-800">
                    현재 <span className="text-indigo-600 text-2xl">{percentage}%</span> 챙겼어요
                </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CHECKLIST_CATEGORIES.map((category) => {
              const currentStandardItems = category.items.filter(item => !deletedItems.includes(item));
              const currentCustomItems = addedItems.filter(item => item.category === category.label).map(i => i.name);
              const displayItems = [...currentStandardItems, ...currentCustomItems];

              return (
                <div key={category.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-fit">
                  <h3 className="font-bold text-lg text-slate-800 mb-5 flex items-center gap-2 pb-2 border-b border-slate-50">
                    <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block" />
                    {category.label}
                  </h3>
                  <ul className="space-y-3 mb-4">
                    {displayItems.map((item) => {
                        const isCustom = currentCustomItems.includes(item);
                        return (
                            <li 
                              key={item} 
                              className="flex items-center justify-between group"
                            >
                              <div 
                                onClick={() => toggleItem(item)}
                                className="flex items-center gap-3 cursor-pointer select-none flex-1"
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
                              </div>
                              <button 
                                onClick={() => deleteItem(item, isCustom)}
                                className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="삭제"
                              >
                                <Trash2 size={14} />
                              </button>
                            </li>
                        );
                    })}
                  </ul>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                    <input 
                        type="text" 
                        placeholder="아이템 추가" 
                        value={inputs[category.label] || ""}
                        onChange={(e) => handleInputChange(category.label, e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItem(category.label)}
                        className="flex-1 bg-slate-50 border-0 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300"
                    />
                    <button 
                        onClick={() => addItem(category.label)}
                        className="bg-slate-800 text-white p-2 rounded-xl hover:bg-slate-700 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
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
      </div>

      <div className="w-full flex justify-center mt-4 px-4 min-[1400px]:hidden">
        {bottomAd.pcImg && (
            <div className="hidden md:block w-full max-w-[728px] shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
                <a href={bottomAd.link} target="_blank" rel="noopener noreferrer nofollow">
                    <img 
                        src={bottomAd.pcImg} 
                        alt={bottomAd.name} 
                        width={728} 
                        height={90} 
                        className="w-full h-auto"
                    />
                </a>
                {bottomAd.pcTrack && <img src={bottomAd.pcTrack} width="1" height="1" className="hidden" alt="" />}
            </div>
        )}
        {bottomAd.moImg && (
            <div className="block md:hidden w-full shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
                <a href={bottomAd.moLink || bottomAd.link} target="_blank" rel="noopener noreferrer nofollow">
                    <img 
                        src={bottomAd.moImg} 
                        alt={bottomAd.name} 
                        width={468} 
                        height={60} 
                        className="w-full h-auto"
                    />
                </a>
                {bottomAd.moTrack && <img src={bottomAd.moTrack} width="1" height="1" className="hidden" alt="" />}
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
            
            <h3 className="text-lg font-black text-slate-900 mb-2 text-center">이미지 저장하기</h3>
            <p className="text-sm text-indigo-600 font-bold text-center mb-4 bg-indigo-50 py-2 rounded-xl">
              이미지를 꾹 눌러서 저장하세요!
            </p>
            
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 max-h-[60vh] overflow-y-auto">
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
          className="w-[800px] bg-[#F8FAFC] p-10 h-auto min-h-[1000px]"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-slate-900 mb-2">My Travel Packing List</h1>
            <p className="text-lg text-slate-500 font-bold">물가체크 (MulgaCheck) 제공</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm mb-8 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <PackageCheck size={32} />
                </div>
                <div>
                    <p className="text-slate-400 text-sm font-bold uppercase mb-1">Current Status</p>
                    <p className="text-3xl font-black text-slate-800">{percentage}% <span className="text-xl text-slate-500 font-bold">완료</span></p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-lg font-bold text-slate-400">여행 준비 완료?</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {CHECKLIST_CATEGORIES.map((category) => {
              const currentStandardItems = category.items.filter(item => !deletedItems.includes(item));
              const currentCustomItems = addedItems.filter(item => item.category === category.label).map(i => i.name);
              const displayItems = [...currentStandardItems, ...currentCustomItems];

              if(displayItems.length === 0) return null;

              return (
                <div key={category.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-fit break-inside-avoid">
                  <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block" />
                    {category.label}
                  </h3>
                  <ul className="space-y-3">
                    {displayItems.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center ${
                          checkedItems.includes(item) 
                            ? "bg-indigo-500 border-indigo-500" 
                            : "bg-slate-50 border-slate-300"
                        }`}>
                          {checkedItems.includes(item) && <Check size={16} className="text-white" strokeWidth={4} />}
                        </div>
                        <span className={`text-base font-bold ${
                          checkedItems.includes(item) 
                            ? "text-slate-400 line-through" 
                            : "text-slate-800"
                        }`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-10">
             <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                Checklist by MulgaCheck
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}