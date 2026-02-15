"use client";

import { useEffect, useState } from "react";
import { BOTTOM_ADS } from "@/data/adData";
import CoupangBanner from "./CoupangBanner";

export default function MainBottomAd() {
  const [ad, setAd] = useState<typeof BOTTOM_ADS[0] | null>(null);

  useEffect(() => {
    setAd(BOTTOM_ADS[Math.floor(Math.random() * BOTTOM_ADS.length)]);
  }, []);

  if (!ad) return null;

  return (
    <div className="w-full flex justify-center mt-8 min-[1400px]:hidden">
      <div className="hidden md:flex justify-center w-full max-w-[728px] min-h-[90px] mx-auto">
        {ad.coupang ? (
          <CoupangBanner 
            id={ad.coupang.id}
            trackingCode={ad.coupang.trackingCode}
            width={ad.coupang.width}
            height={ad.coupang.height}
          />
        ) : (
          ad.pcImg && (
            <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <a href={ad.link} target="_blank" rel="noopener noreferrer nofollow" className="block">
                <img src={ad.pcImg} alt={ad.name} width={728} height={90} className="w-full h-auto" />
              </a>
              {ad.pcTrack && <img src={ad.pcTrack} width="1" height="1" className="hidden" alt="" />}
            </div>
          )
        )}
      </div>

      <div className="flex md:hidden justify-center w-full max-w-[468px] min-h-[60px] mx-auto">
        {ad.coupangMo ? (
          <CoupangBanner 
            id={ad.coupangMo.id}
            trackingCode={ad.coupangMo.trackingCode}
            width={ad.coupangMo.width}
            height={ad.coupangMo.height}
          />
        ) : (
          ad.moImg && (
            <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <a href={ad.moLink || ad.link} target="_blank" rel="noopener noreferrer nofollow" className="block">
                <img src={ad.moImg} alt={ad.name} width={468} height={60} className="w-full h-auto" />
              </a>
              {ad.moTrack && <img src={ad.moTrack} width="1" height="1" className="hidden" alt="" />}
            </div>
          )
        )}
      </div>
    </div>
  );
}