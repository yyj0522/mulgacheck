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
    <div className="fixed inset-0 z-40 pointer-events-none hidden 2xl:block max-w-[1920px] mx-auto">
      <div className="absolute top-1/2 -translate-y-1/2 right-[calc(50%+240px)] flex flex-col gap-4 pointer-events-auto items-end">
        <div className="relative group">
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute -top-8 left-0 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-rose-500 shadow-sm transition-colors mb-2"
          >
            <X size={14} />
          </button>

          <a 
            href="https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0012&u_id=" 
            target="_blank" 
            rel="noopener noreferrer nofollow"
            className="block rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow bg-white"
          >
            <Image 
              src="https://img.linkprice.com/files/glink/klook/20181011/5bbee16a86b6b_160_600.jpg"
              alt="Klook"
              width={160}
              height={600}
              priority
              className="object-cover"
            />
          </a>
          <p className="text-[10px] text-slate-300 text-center mt-1">AD</p>
        </div>

        {leftDbBanners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-[160px] rounded-xl overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-transform hover:-translate-y-1 bg-white"
          >
            {banner.image_url ? (
              <Image 
                src={banner.image_url} 
                alt={banner.title}
                width={160}
                height={160}
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="p-4 text-center">
                <span className="text-xs font-bold text-slate-600">{banner.title}</span>
              </div>
            )}
          </a>
        ))}
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 left-[calc(50%+240px)] flex flex-col gap-4 pointer-events-auto items-start">
        <div className="relative group">
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute -top-8 right-0 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-rose-500 shadow-sm transition-colors mb-2"
          >
            <X size={14} />
          </button>

          <a 
            href="https://click.linkprice.com/click.php?m=usimsa&a=A100702487&l=yjYP&u_id=" 
            target="_blank" 
            rel="noopener noreferrer nofollow"
            className="block rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow bg-white"
          >
            <Image 
              src="https://img.linkprice.com/files/glink/usimsa/20250207/67a5a76c7e2c7_160x600.jpg"
              alt="Usimsa"
              width={160}
              height={600}
              priority
              className="object-cover"
            />
          </a>
          <p className="text-[10px] text-slate-300 text-center mt-1">AD</p>
        </div>

        {rightDbBanners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-[160px] rounded-xl overflow-hidden shadow-md border border-slate-100 hover:shadow-lg transition-transform hover:-translate-y-1 bg-white"
          >
            {banner.image_url ? (
              <Image 
                src={banner.image_url} 
                alt={banner.title}
                width={160}
                height={160}
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="p-4 text-center">
                <span className="text-xs font-bold text-slate-600">{banner.title}</span>
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}