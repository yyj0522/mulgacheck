"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

export default function LeftWingBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden 2xl:block">
      <div className="relative">
        {/* 닫기 버튼 (사용자 배려) */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 -right-3 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-rose-500 shadow-sm transition-colors"
        >
          <X size={14} />
        </button>

        {/* 광고 링크 */}
        <a 
          href="https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0012&u_id=" 
          target="_blank" 
          rel="noopener noreferrer nofollow"
          className="block rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
        >
          {/* Next.js 이미지 최적화 사용 */}
          <Image 
            src="https://img.linkprice.com/files/glink/klook/20181011/5bbee16a86b6b_160_600.jpg"
            alt="Klook Travel"
            width={160}
            height={600}
            priority // LCP 성능 향상을 위해 우선 로딩
            className="object-cover"
          />
        </a>
        
        {/* 광고임을 명시 (선택사항) */}
        <p className="text-[10px] text-slate-300 text-center mt-2">AD</p>
      </div>
    </div>
  );
}