"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function WingBanners({ dbBanners }: { dbBanners: any[] }) {
  const leftDbBanners = dbBanners.filter((_, i) => i % 2 === 0);
  const rightDbBanners = dbBanners.filter((_, i) => i % 2 !== 0);

  // 배너 컨테이너의 높이를 측정하기 위한 Ref
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // 푸터와 겹치지 않게 하기 위한 Y축 이동 값
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer || !leftRef.current || !rightRef.current) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // 배너의 기본 시작 위치 (CSS의 top-[calc(50%-300px)] 기준)
      // 화면 중앙에서 300px 위쪽이 시작점입니다.
      const bannerTopStart = (windowHeight / 2) - 300;

      // 왼쪽, 오른쪽 배너 중 더 긴 쪽의 높이를 기준으로 계산
      const leftHeight = leftRef.current.offsetHeight;
      const rightHeight = rightRef.current.offsetHeight;
      const tallerHeight = Math.max(leftHeight, rightHeight);

      // 배너의 현재 바닥 위치 (뷰포트 기준)
      // 시작점 + 높이
      const bannerBottom = bannerTopStart + tallerHeight;

      // 푸터 상단 위치 (뷰포트 기준)
      const footerTop = footerRect.top;

      // 배너 바닥이 (푸터 상단 - 50px)보다 아래에 있다면 충돌 발생
      const gap = 50;
      const collisionPoint = footerTop - gap;

      if (bannerBottom > collisionPoint) {
        // 겹치는 만큼 위로 올림 (음수 값)
        setOffsetY(collisionPoint - bannerBottom);
      } else {
        // 겹치지 않으면 원래 위치 (0)
        setOffsetY(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    
    // 초기 로딩 시 한 번 실행
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [dbBanners]); // 배너 데이터가 변경되면 높이가 달라지므로 재계산

  return (
    <div className="fixed inset-0 z-40 pointer-events-none hidden min-[1400px]:block max-w-[1920px] mx-auto">
      
      {/* 왼쪽 배너 그룹 
        - style transform을 통해 푸터 충돌 시 위로 이동
        - transition-all을 제거하거나 duration을 짧게 해야 스크롤 시 덜덜거림이 없습니다. 
      */}
      <div 
        ref={leftRef}
        style={{ transform: `translateY(${offsetY}px)` }}
        className="absolute top-[calc(50%-300px)] left-[50px] xl:left-[100px] 2xl:left-[250px] flex flex-col gap-4 pointer-events-auto items-end"
      >
        <div className="flex flex-col items-end">
            <a 
              href="https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0012&u_id=" 
              target="_blank" 
              rel="noopener noreferrer nofollow"
              className="block w-[160px] h-[600px] shadow-lg hover:shadow-xl transition-shadow bg-white rounded-lg overflow-hidden relative"
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
            <span className="text-[10px] text-slate-300 mt-1">제휴 활동으로 수수료를 제공받음</span>
        </div>

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

      {/* 오른쪽 배너 그룹 */}
      <div 
        ref={rightRef}
        style={{ transform: `translateY(${offsetY}px)` }}
        className="absolute top-[calc(50%-300px)] right-[50px] xl:right-[100px] 2xl:right-[250px] flex flex-col gap-4 pointer-events-auto items-start"
      >
        <div className="flex flex-col items-start">
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
            <span className="text-[10px] text-slate-300 mt-1">제휴 활동으로 수수료를 제공받음</span>
        </div>

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