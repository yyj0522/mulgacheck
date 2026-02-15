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
  const isLoaded = useRef(false); 

  useEffect(() => {
    if (!containerRef.current || isLoaded.current) return;

    containerRef.current.innerHTML = "";
    isLoaded.current = true; 

    const wrapper = document.createElement("div");
    wrapper.style.width = `${width}px`;
    wrapper.style.height = `${height}px`;
    wrapper.style.display = "block"; 
    containerRef.current.appendChild(wrapper);

    const script1 = document.createElement("script");
    script1.src = "https://ads-partners.coupang.com/g.js";
    script1.async = true;

    script1.onload = () => {
      const script2 = document.createElement("script");
      const config = JSON.stringify({
        id: id,
        template: template,
        trackingCode: trackingCode,
        width: width,
        height: height,
        tsource: ""
      });
      
      script2.text = `try { new PartnersCoupang.G(${config}); } catch(e) {}`;
      
      wrapper.appendChild(script2);
    };

    wrapper.appendChild(script1);

    return () => {
        isLoaded.current = false;
        if(containerRef.current) containerRef.current.innerHTML = "";
    };

  }, [id, trackingCode, width, height, template]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: `${width}px`, height: `${height}px` }} 
      className="bg-transparent"
    />
  );
}