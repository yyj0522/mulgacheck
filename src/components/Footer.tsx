import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-10 border-t border-slate-200 bg-white text-center pb-32 md:pb-10">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex justify-center gap-6 mb-6 text-xs font-bold text-slate-500">
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">
            이용약관
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
            개인정보처리방침
          </Link>
        </div>

        <div className="mb-6 p-4 bg-slate-50 rounded-2xl text-[11px] text-slate-400 leading-relaxed break-keep">
          <p className="mb-1">
            본 사이트는 정보 제공을 목적으로 운영되며, 여행 상품의 직접적인 판매 당사자가 아닙니다.
          </p>
          <p className="font-medium text-slate-500">
            이 사이트는 쿠팡 파트너스를 포함한 제휴마케팅이 포함된 광고로 커미션을 지급 받습니다.
          </p>
          <p className="mt-1 text-slate-400">
            또한, 이 사이트는 링크프라이스 활동을 통해 일정액의 수수료를 제공받을 수 있습니다.
          </p>
        </div>

        <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          © 2026 MULGACHECK. All rights reserved.
        </p>
      </div>
    </footer>
  );
}