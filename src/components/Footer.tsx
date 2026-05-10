import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-10 bg-slate-50 border-t border-slate-200 text-slate-500 font-sans">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <p className="text-xs font-medium text-slate-400">
            본 사이트는 정보 제공을 목적으로 운영되며, 여행 상품의 직접적인 판매 당사자가 아닙니다.
          </p>
          <p className="text-xs font-medium text-slate-400">
            제휴 및 오류 문의 : <a href="mailto:projectc029@gmail.com" className="hover:text-indigo-600 transition-colors">projectc029@gmail.com</a>
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-5 text-xs font-bold">
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
              개인정보처리방침
            </Link>
          </div>
          <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            © 2026 MULGACHECK. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}