"use client";

import { useState, useEffect } from "react";
import { BOTTOM_ADS } from "@/data/adData";

export default function BottomBanner() {
  const [mounted, setMounted] = useState(false);
  const [ad, setAd] = useState(BOTTOM_ADS[0]);

  useEffect(() => {
    setMounted(true);
    setAd(BOTTOM_ADS[Math.floor(Math.random() * BOTTOM_ADS.length)]);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center my-8">
      {ad.pcImg && (
        <div className="hidden md:block shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
          <a href={ad.link} target="_blank" rel="noopener noreferrer nofollow">
            <img 
              src={ad.pcImg} 
              alt={ad.name} 
              width={728} 
              height={90} 
              className="w-auto h-auto max-w-full"
            />
          </a>
          {ad.pcTrack && (
            <img 
              src={ad.pcTrack} 
              width="1" 
              height="1" 
              className="hidden" 
              alt="" 
            />
          )}
        </div>
      )}

      {ad.moImg && (
        <div className="block md:hidden shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
          <a href={ad.moLink || ad.link} target="_blank" rel="noopener noreferrer nofollow">
            <img 
              src={ad.moImg} 
              alt={ad.name} 
              width={468} 
              height={60} 
              className="w-full h-auto max-w-[320px] sm:max-w-[468px]" 
            />
          </a>
          {ad.moTrack && (
            <img 
              src={ad.moTrack} 
              width="1" 
              height="1" 
              className="hidden" 
              alt="" 
            />
          )}
        </div>
      )}
    </div>
  );
}