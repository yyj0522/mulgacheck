"use client";

import { useEffect, useRef, useState } from "react";
import { WING_ADS } from "@/data/adData";
import CoupangBanner from "./CoupangBanner";

function shuffleArray(array: any[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function WingBanners() {
  const [mounted, setMounted] = useState(false);
  const [leftAd, setLeftAd] = useState(WING_ADS[0]);
  const [rightAd, setRightAd] = useState(WING_ADS[1]);
  const [offsetY, setOffsetY] = useState(0);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const shuffled = shuffleArray(WING_ADS);
    setLeftAd(shuffled[0]);
    setRightAd(shuffled[1]);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer || !leftRef.current || !rightRef.current) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const bannerTopStart = (windowHeight / 2) - 300;
      const tallerHeight = 600;
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
  }, []);

  if (!mounted) return null;

  const renderBanner = (ad: typeof WING_ADS[0]) => {
    if (ad.coupang) {
      return (
        <div className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
          <CoupangBanner 
            id={ad.coupang.id}
            trackingCode={ad.coupang.trackingCode}
            width={ad.coupang.width}
            height={ad.coupang.height}
          />
        </div>
      );
    }

    return (
      <>
        <a href={ad.link} target="_blank" rel="noopener noreferrer nofollow" className="block shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
          <img src={ad.imgUrl} alt={ad.name} width={160} height={600} className="w-[160px] h-[600px] object-cover" />
        </a>
        {ad.trackingUrl && <img src={ad.trackingUrl} width="1" height="1" className="hidden" alt="" />}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none hidden min-[1400px]:block max-w-[1920px] mx-auto">
      <div 
        ref={leftRef}
        style={{ transform: `translateY(${offsetY}px)` }}
        className="absolute top-[calc(50%-300px)] left-[50px] xl:left-[100px] 2xl:left-[250px] pointer-events-auto"
      >
        {renderBanner(leftAd)}
      </div>

      <div 
        ref={rightRef}
        style={{ transform: `translateY(${offsetY}px)` }}
        className="absolute top-[calc(50%-300px)] right-[50px] xl:right-[100px] 2xl:right-[250px] pointer-events-auto"
      >
        {renderBanner(rightAd)}
      </div>
    </div>
  );
}