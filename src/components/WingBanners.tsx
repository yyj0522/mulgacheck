"use client";

import Image from "next/image";

export default function WingBanners({ dbBanners }: { dbBanners: any[] }) {
  const leftDbBanners = dbBanners.filter((_, i) => i % 2 === 0);
  const rightDbBanners = dbBanners.filter((_, i) => i % 2 !== 0);

  return (
    // ✅ 반응형: 화면 너비 1400px 미만이면 숨김 (콘텐츠와 겹치기 전 50px 여유 확보)
    <div className="fixed inset-0 z-40 pointer-events-none hidden min-[1400px]:block max-w-[1920px] mx-auto">
      
      {/* ================= 좌측 윙 (Left Wing) ================= */}
      {/* left-[250px]: 화면 왼쪽 벽에서 250px 떨어짐
         top-[calc(50%-300px)]: 메인 배너(600px)의 상단이 화면 세로 중앙에 오도록 고정 (높이 일치 핵심)
      */}
      <div className="absolute top-[calc(50%-300px)] left-[250px] flex flex-col gap-4 pointer-events-auto items-end transition-all duration-300">
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
      {/* right-[250px]: 화면 오른쪽 벽에서 250px 떨어짐
         top-[calc(50%-300px)]: 좌측과 동일한 높이 계산식 적용
      */}
      <div className="absolute top-[calc(50%-300px)] right-[250px] flex flex-col gap-4 pointer-events-auto items-start transition-all duration-300">
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