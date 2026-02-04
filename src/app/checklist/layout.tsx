import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "여행 짐 싸기 체크리스트 - 물가체크",
  description: "빠뜨린 물건 없으신가요? 여권, 돼지코, 상비약 등 필수 준비물을 체크하고 친구와 공유해보세요.",
  openGraph: {
    title: "여행 짐 싸기 체크리스트 - 물가체크",
    description: "클릭 몇 번으로 짐 싸기 끝! 내 리스트를 친구에게 공유하세요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "여행 짐 싸기 체크리스트",
      },
    ],
  },
};

export default function ChecklistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}