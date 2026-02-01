import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white p-6 md:p-12 text-slate-700">
      <div className="max-w-3xl mx-auto prose prose-slate">
        {/* ✅ 뒤로가기 버튼 추가 */}
        <div className="mb-8 not-prose">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors px-4 py-2 hover:bg-slate-50 rounded-full -ml-4"
          >
            <ArrowLeft size={20} />
            메인으로 돌아가기
          </Link>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-8">이용약관</h1>
        
        <p className="text-sm text-slate-400 mb-8">최종 수정일: 2026년 2월 2일</p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">제1조 (목적)</h3>
        <p>본 약관은 물가어때(이하 "서비스")가 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 서비스의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.</p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">제2조 (서비스의 제공 및 변경)</h3>
        <p>
          1. 서비스는 여행지 물가 정보, 환율 계산, 체크리스트 등의 기능을 무료로 제공합니다.<br />
          2. 제공되는 물가 데이터와 환율 정보는 참고용이며, 실제 현지 가격과 차이가 있을 수 있습니다. 본 서비스는 정보의 정확성에 대해 보증하지 않습니다.
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">제3조 (책임의 한계)</h3>
        <p>
          서비스는 이용자가 게재한 댓글, 정보, 자료의 정확성 및 신뢰도에 대해 책임을 지지 않으며, 서비스를 이용하여 발생한 손해에 대해서는 책임지지 않습니다.
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">제4조 (광고의 게재)</h3>
        <p>
          서비스는 운영을 위해 사이트 내에 구글 애드센스 등 제3자의 광고를 게재할 수 있습니다.
        </p>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm">문의: projectc029@gmail.com</p>
        </div>
      </div>
    </div>
  );
}