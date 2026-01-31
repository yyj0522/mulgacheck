import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '물가어때 - 해외 여행지 물가 한눈에 비교',
  description: '실시간 환율과 서울 물가 대비 가성비를 분석해 드립니다.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased bg-slate-50">{children}</body>
    </html>
  );
}