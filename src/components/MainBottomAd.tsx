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
      <div className="hidden md:block w-[728px] h-[90px] shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden bg-white mx-auto">
        {ad.coupang ? (
          <CoupangBanner 
            id={ad.coupang.id}
            trackingCode={ad.coupang.trackingCode}
            width={ad.coupang.width}
            height={ad.coupang.height}
            template={ad.coupang.template}
          />
        ) : (
          ad.pcImg && (
            <>
              <a href={ad.link} target="_blank" rel="noopener noreferrer nofollow" className="block w-full h-full">
                <img src={ad.pcImg} alt={ad.name} width={728} height={90} className="w-full h-full object-cover" />
              </a>
              {ad.pcTrack && <img src={ad.pcTrack} width="1" height="1" className="hidden" alt="" />}
            </>
          )
        )}
      </div>

      <div className="block md:hidden w-[468px] h-[60px] max-w-full shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden bg-white mx-auto">
        {ad.coupangMo ? (
          <div className="flex justify-center">
             <CoupangBanner 
              id={ad.coupangMo.id}
              trackingCode={ad.coupangMo.trackingCode}
              width={ad.coupangMo.width}
              height={ad.coupangMo.height}
              template={ad.coupangMo.template}
            />
          </div>
        ) : (
          ad.moImg && (
            <>
              <a href={ad.moLink || ad.link} target="_blank" rel="noopener noreferrer nofollow" className="block w-full h-full">
                <img src={ad.moImg} alt={ad.name} width={468} height={60} className="w-full h-full object-cover" />
              </a>
              {ad.moTrack && <img src={ad.moTrack} width="1" height="1" className="hidden" alt="" />}
            </>
          )
        )}
      </div>
    </div>
  );
}