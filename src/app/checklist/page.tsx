"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Share2, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";

const CATEGORIES = {
  "필수 준비물": [
    "여권",
    "숙소 바우처",
    "환전 (환율)",
    "신용카드/트래블월렛",
    "여행자 보험",
    "항공권 (E-티켓)",
    "유심/이심/로밍",
    "국제운전면허증",
    "여행자 보험 증서",
  ],
  "전자기기": [
    "스마트폰 & 충전기",
    "보조배터리",
    "멀티 어댑터 (돼지코)",
    "유선 이어폰/에어팟",
    "카메라 & SD카드",
    "셀카봉/삼각대",
    "노트북/태블릿",
    "포켓 와이파이",
  ],
  "의류 및 패션": [
    "상의 (티셔츠/셔츠)",
    "하의 (바지/치마)",
    "속옷 & 양말",
    "잠옷/편한 옷",
    "겉옷 (바람막이/가디건)",
    "신발 (운동화/슬리퍼)",
    "수영복 & 래쉬가드",
    "모자 & 선글라스",
    "악세사리",
  ],
  "세면도구 및 화장품": [
    "칫솔 & 치약",
    "샴푸/린스/바디워시",
    "클렌징폼 & 리무버",
    "스킨케어 (스킨/로션)",
    "선크림 (필수)",
    "화장품 (메이크업)",
    "면도기/쉐이빙폼",
    "헤어 드라이어/고데기",
    "수건 (스포츠 타월)",
  ],
  "비상약": [
    "종합 감기약",
    "진통제/해열제",
    "소화제/지사제",
    "대일밴드 & 연고",
    "멀미약",
    "모기 기피제/버물리",
    "인공눈물",
    "비타민/영양제",
    "개인 처방약",
  ],
  "기타 유용한 물건": [
    "물티슈 & 휴지",
    "지퍼백/비닐봉투",
    "우산/우비",
    "목베개 & 안대",
    "볼펜 (입국심고서용)",
    "동전 지갑",
    "마스크",
    "손선풍기/부채",
    "라면/김치 (비상식량)",
    "등산 지팡이",
  ],
};

const getAllItems = () => {
  return Object.values(CATEGORIES).flat();
};

const compressChecklist = (selectedItems: string[]) => {
  const allItems = getAllItems();
  const indices = selectedItems
    .map((item) => allItems.indexOf(item))
    .filter((index) => index !== -1);
  return btoa(indices.join(","));
};

const decompressChecklist = (encodedString: string) => {
  try {
    const allItems = getAllItems();
    const indices = atob(encodedString).split(",").map(Number);
    return indices
      .map((index) => allItems[index])
      .filter((item) => item !== undefined);
  } catch (e) {
    return [];
  }
};

function ChecklistContent() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      if (data.startsWith("JTV")) {
        try {
          const legacyParsed = JSON.parse(decodeURIComponent(atob(data)));
          if (Array.isArray(legacyParsed)) {
            setCheckedItems(legacyParsed);
          }
        } catch (e) {}
      } else {
        const parsedItems = decompressChecklist(data);
        if (parsedItems.length > 0) {
          setCheckedItems(parsedItems);
        }
      }
    }
  }, [searchParams]);

  const toggleItem = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleCopyLink = () => {
    const data = compressChecklist(checkedItems);
    const url = `${window.location.origin}/checklist?data=${data}`;
    navigator.clipboard.writeText(url);
    alert("체크리스트 공유 링크가 복사되었습니다!");
  };

  const resetChecklist = () => {
    if (confirm("모든 체크리스트를 초기화하시겠습니까?")) {
      setCheckedItems([]);
      const url = new URL(window.location.href);
      url.searchParams.delete("data");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const totalItems = getAllItems().length;
  const progress = Math.round((checkedItems.length / totalItems) * 100);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 pb-32">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors px-4 py-2 hover:bg-slate-100 rounded-full -ml-4"
          >
            <ArrowLeft size={20} />
            메인으로 돌아가기
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
              여행 준비물 체크리스트
            </h1>
            <p className="text-slate-500">
              빠뜨린 물건이 없는지 꼼꼼하게 확인해보세요.
            </p>
          </div>
          <div className="flex gap-2">
             <button
              onClick={resetChecklist}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
            >
              <RefreshCw size={18} />
              <span className="hidden md:inline">초기화</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              <Share2 size={18} />
              공유하기
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-10 sticky top-4 z-20">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-500">진행률</span>
            <span className="text-2xl font-black text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(CATEGORIES).map(([category, items]) => (
            <div key={category} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-500 rounded-full inline-block"></span>
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleItem(item)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                      checkedItems.includes(item)
                        ? "border-indigo-500 bg-indigo-50/50 text-indigo-900"
                        : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className={`font-medium ${checkedItems.includes(item) ? "font-bold" : ""}`}>
                      {item}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      checkedItems.includes(item)
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-slate-300 group-hover:border-indigo-300"
                    }`}>
                      {checkedItems.includes(item) && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChecklistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <ChecklistContent />
    </Suspense>
  );
}