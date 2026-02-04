"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

export default function WingBanners({ dbBanners }: { dbBanners: any[] }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const leftDbBanners = dbBanners.filter((_, i) => i % 2 === 0);
  const rightDbBanners = dbBanners.filter((_, i) => i % 2 !== 0);

  return (
    // ✅ xl(1280px) 이상에서만 보임, 그 이하는 숨김 (모바일 반응형 처리)
    <div className="fixed inset-0 z-40 pointer-events-none hidden xl:block max-w-[1920px] mx-auto">
      
      {/* ================= 좌측 윙 (Left Wing) ================= */}
      {/* 반응형 위치 조정:
         xl 화면: 중앙에서 240px 떨어짐 (가까워짐)
         2xl 화면: 중앙에서 340px 떨어짐 (멀어짐)
      */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[calc(50%+240px)] 2xl:right-[calc(50%+340px)] flex flex-col gap-4 pointer-events-auto items-end transition-all duration-300 ease-in-out">
        
        <button 
          onClick={() => setIsVisible(false)}
          className="bg-white border border-slate-200 rounded-full p-1.5 text-slate-400 hover:text-rose-500 shadow-sm transition-colors mb-1"
          title="광고 닫기"
        >
          <X size={16} />
        </button>

        {/* 1. 메인 고정 배너 (클룩) */}
        <a 
          href="https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0012&u_id=" 
          target="_blank" 
          rel="noopener noreferrer nofollow"
          className="block w-[160px] h-[600px] shadow-lg hover:shadow-xl transition-shadow bg-white rounded-lg overflow-hidden"
        >
          <Image 
            src="https://img.linkprice.com/files/glink/klook/20181011/5bbee16a86b6b_160_600.jpg"
            alt="Klook"
            width={160}
            height={600}
            priority
            unoptimized
            className="w-full h-full object-cover"
          />
        </a>

        {/* 2. 관리자 등록 배너들 */}
        {leftDbBanners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-[160px] overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-transform hover:-translate-y-1 bg-white rounded-lg"
          >
            {banner.image_url ? (
              <Image 
                src={banner.image_url} 
                alt={banner.title}
                width={160}
                height={160}
                className="w-full h-auto object-contain"
                unoptimized
              />
            ) : (
              <div className="p-4 text-center h-[160px] flex items-center justify-center">
                <span className="text-sm font-bold text-slate-600 break-keep">{banner.title}</span>
              </div>
            )}
          </a>
        ))}
      </div>

      {/* ================= 우측 윙 (Right Wing) ================= */}
      {/* 반응형 위치 조정:
         xl 화면: 중앙에서 240px 떨어짐
         2xl 화면: 중앙에서 340px 떨어짐
      */}
      <div className="absolute top-1/2 -translate-y-1/2 left-[calc(50%+240px)] 2xl:left-[calc(50%+340px)] flex flex-col gap-4 pointer-events-auto items-start transition-all duration-300 ease-in-out">
        
        <div className="h-[34px] mb-1" />

        {/* 1. 메인 고정 배너 (유심사) */}
        <a 
          href="https://click.linkprice.com/click.php?m=usimsa&a=A100702487&l=yjYP&u_id=" 
          target="_blank" 
          rel="noopener noreferrer nofollow"
          className="block w-[160px] h-[600px] shadow-lg hover:shadow-xl transition-shadow bg-white rounded-lg overflow-hidden"
        >
          <Image 
            src="https://img.linkprice.com/files/glink/usimsa/20250207/67a5a76c7e2c7_160x600.jpg"
            alt="Usimsa"
            width={160}
            height={600}
            priority
            unoptimized
            className="w-full h-full object-cover"
          />
        </a>

        {/* 2. 관리자 등록 배너들 */}
        {rightDbBanners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-[160px] overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-transform hover:-translate-y-1 bg-white rounded-lg"
          >
            {banner.image_url ? (
              <Image 
                src={banner.image_url} 
                alt={banner.title}
                width={160}
                height={160}
                className="w-full h-auto object-contain"
                unoptimized
              />
            ) : (
              <div className="p-4 text-center h-[160px] flex items-center justify-center">
                <span className="text-sm font-bold text-slate-600 break-keep">{banner.title}</span>
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}