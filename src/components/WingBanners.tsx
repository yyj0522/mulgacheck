"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function WingBanners({ dbBanners }: { dbBanners: any[] }) {
  const leftDbBanners = dbBanners.filter((_, i) => i % 2 === 0);
  const rightDbBanners = dbBanners.filter((_, i) => i % 2 !== 0);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer || !leftRef.current || !rightRef.current) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const bannerTopStart = (windowHeight / 2) - 300;
      const leftHeight = leftRef.current.offsetHeight;
      const rightHeight = rightRef.current.offsetHeight;
      const tallerHeight = Math.max(leftHeight, rightHeight);
      const bannerBottom = bannerTopStart + tallerHeight;
      const footerTop = footerRect.top;
      const gap = 50;
      const collisionPoint = footerTop - gap;

      if (bannerBottom > collisionPoint) {
        setOffsetY(collisionPoint - bannerBottom);
      } else {
        setOffsetY(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [dbBanners]); 

  return (
    <div className="fixed inset-0 z-40 pointer-events-none hidden min-[1400px]:block max-w-[1920px] mx-auto">
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