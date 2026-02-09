import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mulgacheck.com/"),
  title: {
    template: "%s | 물가체크",
    default: "물가체크 - 여행 예산, 감 말고 데이터로",
  },
  description: "전 세계 여행지 물가 비교, 실시간 환율 계산, 짐 싸기 체크리스트까지. 여행 준비의 모든 것을 데이터로 확인하세요.",
  keywords: ["여행", "물가", "환율", "여행예산", "체크리스트", "해외여행", "배낭여행"],
  openGraph: {
    title: "물가체크 - 여행 예산, 감 말고 데이터로",
    description: "지금 가장 저렴한 여행지는? 빅맥지수, 스타벅스 지수로 알아보는 현실적인 여행 물가.",
    url: "https://www.mulgacheck.com/",
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
      "naver-site-verification": "507a3150e11d4f55d3d786615026d36efdd76d2b",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "물가체크",
  "alternateName": ["MulgaCheck", "물가체크 여행"],
  "url": "https://www.mulgacheck.com/"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {children}
        
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}