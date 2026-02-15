"use client";

interface CoupangBannerProps {
  id: number | string;
  trackingCode: string;
  width: string;
  height: string;
}

export default function CoupangBanner({ id, trackingCode, width, height }: CoupangBannerProps) {
  const src = `https://ads-partners.coupang.com/widgets.html?id=${id}&template=carousel&trackingCode=${trackingCode}&subId=&width=${width}&height=${height}&tsource=`;

  return (
    <iframe 
      src={src}
      width={width}
      height={height}
      frameBorder="0"
      scrolling="no"
      referrerPolicy="unsafe-url"
      style={{ display: 'block' }}
    />
  );
}