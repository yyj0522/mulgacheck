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
    // ✅ 화면 너비 1024px(lg) 이하에서는 숨김 (콘텐츠 겹침 방지)
    <div className="fixed inset-0 z-40 pointer-events-none hidden lg:block max-w-[1920px] mx-auto">
      
      {/* ================= 좌측 윙 (Left Wing) ================= */}
      {/* 화면 왼쪽 벽에서 50px 떨어짐 -> 화면이 줄어들수록 중앙으로 다가옴 */}
      <div className="absolute top-1/2 -translate-y-1/2 left-[50px] flex flex-col gap-4 pointer-events-auto items-end transition-all duration-300">
        
        {/* 닫기 버튼: absolute로 띄워서 배너 높이에 영향 주지 않게 함 */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-8 left-0 bg-white border border-slate-200 rounded-full p-1.5 text-slate-400 hover:text-rose-500 shadow-sm transition-colors mb-1"
          title="광고 닫기"
        >
          <X size={16} />
        </button>

        {/* 메인 고정 배너 */}
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

        {/* 서브 배너들 */}
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
      {/* 화면 오른쪽 벽에서 50px 떨어짐 -> 화면이 줄어들수록 중앙으로 다가옴 */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[50px] flex flex-col gap-4 pointer-events-auto items-start transition-all duration-300">
        
        {/* 닫기 버튼: 좌측과 동일하게 absolute 처리하여 높이 간섭 제거 */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-8 right-0 bg-white border border-slate-200 rounded-full p-1.5 text-slate-400 hover:text-rose-500 shadow-sm transition-colors mb-1"
          title="광고 닫기"
        >
          <X size={16} />
        </button>

        {/* 메인 고정 배너 (유심사) */}
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

        {/* 서브 배너들 */}
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