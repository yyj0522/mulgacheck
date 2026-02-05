import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mulgaeottae.site/"),
  title: {
    template: "%s | 물가체크",
    default: "물가체크 - 여행 예산, 감 말고 데이터로",
  },
  description: "전 세계 여행지 물가 비교, 실시간 환율 계산, 짐 싸기 체크리스트까지. 여행 준비의 모든 것을 데이터로 확인하세요.",
  keywords: ["여행", "물가", "환율", "여행예산", "체크리스트", "해외여행", "배낭여행"],
  openGraph: {
    title: "물가체크 - 여행 예산, 감 말고 데이터로",
    description: "지금 가장 저렴한 여행지는? 빅맥지수, 스타벅스 지수로 알아보는 현실적인 여행 물가.",
    url: "https://www.mulgaeottae.site/",
    siteName: "물가체크",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "물가체크 미리보기",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "물가체크 - 여행 예산, 감 말고 데이터로",
    description: "전 세계 여행지 물가 비교 및 예산 계산기",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.png",
  },
  verification: {
    google: "kMXhavZeZtceSQXWqxhL_OctTQ2DYejq581JtY-CZsg",
    other: {
      "naver-site-verification": "7a468ab7e7c7aae2de7abc55274b685e11c804bb",
      "google-adsense-account": "ca-pub-7927865252694277",
      "agd-partner-manual-verification": "",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "물가체크",
  "alternateName": ["MulgaCheck", "물가체크 여행"],
  "url": "https://www.mulgaeottae.site/"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7927865252694277"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {children}
        
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}