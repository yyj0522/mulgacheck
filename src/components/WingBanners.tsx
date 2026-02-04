"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

export default function WingBanners({ dbBanners }: { dbBanners: any[] }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // DB 배너를 좌/우로 분배 (관리자 페이지 등록 배너)
  const leftDbBanners = dbBanners.filter((_, i) => i % 2 === 0);
  const rightDbBanners = dbBanners.filter((_, i) => i % 2 !== 0);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none hidden 2xl:block max-w-[1920px] mx-auto">
      {/* [배치 전략]
        top-1/2 -translate-y-1/2: 화면 세로 중앙 정렬
        gap-4: 배너 간 간격 16px
      */}
      
      {/* ================= 좌측 윙 (Left Wing) ================= */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[calc(50%+340px)] flex flex-col gap-4 pointer-events-auto items-end">
        
        {/* 닫기 버튼 (전체 닫기) */}
        <button 
          onClick={() => setIsVisible(false)}
          className="bg-white border border-slate-200 rounded-full p-1.5 text-slate-400 hover:text-rose-500 shadow-sm transition-colors mb-1"
          title="광고 닫기"
        >
          <X size={16} />
        </button>

        {/* 1. 메인 고정 배너 (클룩 160x600) */}
        <a 
          href="https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0012&u_id=" 
          target="_blank" 
          rel="noopener noreferrer nofollow"
          className="block w-[160px] h-[600px] shadow-lg hover:shadow-xl transition-shadow bg-white"
        >
          <Image 
            src="https://img.linkprice.com/files/glink/klook/20181011/5bbee16a86b6b_160_600.jpg"
            alt="Klook"
            width={160}
            height={600}
            priority
            unoptimized // ✅ 화질 저하 방지 (원본 사용)
            className="w-full h-full object-cover"
          />
        </a>

        {/* 2. 관리자 페이지 등록 배너들 (좌측 하단) */}
        {leftDbBanners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-[160px] overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-transform hover:-translate-y-1 bg-white"
          >
            {banner.image_url ? (
              <Image 
                src={banner.image_url} 
                alt={banner.title}
                width={160}
                height={160} // 정사각형 비율 유지
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
      <div className="absolute top-1/2 -translate-y-1/2 left-[calc(50%+340px)] flex flex-col gap-4 pointer-events-auto items-start">
        
        {/* 우측 상단 여백 맞추기용 (좌측 닫기 버튼과 높이 균형) */}
        <div className="h-[34px] mb-1" />

        {/* 1. 메인 고정 배너 (유심사 160x600) */}
        <a 
          href="https://click.linkprice.com/click.php?m=usimsa&a=A100702487&l=yjYP&u_id=" 
          target="_blank" 
          rel="noopener noreferrer nofollow"
          className="block w-[160px] h-[600px] shadow-lg hover:shadow-xl transition-shadow bg-white"
        >
          <Image 
            src="https://img.linkprice.com/files/glink/usimsa/20250207/67a5a76c7e2c7_160x600.jpg"
            alt="Usimsa"
            width={160}
            height={600}
            priority
            unoptimized // ✅ 화질 저하 방지 (원본 사용)
            className="w-full h-full object-cover"
          />
        </a>

        {/* 2. 관리자 페이지 등록 배너들 (우측 하단) */}
        {rightDbBanners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-[160px] overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-transform hover:-translate-y-1 bg-white"
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