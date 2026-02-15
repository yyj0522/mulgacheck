"use client";

import { useEffect, useRef } from "react";

interface CoupangBannerProps {
  id: number | string;
  trackingCode: string;
  width: string;
  height: string;
  template?: string;
}

export default function CoupangBanner({ id, trackingCode, width, height, template = "carousel" }: CoupangBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script1 = document.createElement("script");
    script1.src = "https://ads-partners.coupang.com/g.js";
    script1.async = true;
    
    script1.onload = () => {
      if (!containerRef.current) return;
      
      const script2 = document.createElement("script");
      const config = JSON.stringify({
        id: id,
        template: template,
        trackingCode: trackingCode,
        width: width,
        height: height,
        tsource: ""
      });
      
      script2.text = `new PartnersCoupang.G(${config});`;
      containerRef.current.appendChild(script2);
    };

    containerRef.current.appendChild(script1);

  }, [id, trackingCode, width, height, template]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: `${width}px`, height: `${height}px` }} 
      className="overflow-hidden bg-slate-50" 
    />
  );
}