import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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

        <h1 className="text-3xl font-black text-slate-900 mb-8">개인정보처리방침</h1>
        
        <p className="text-sm text-slate-400 mb-8">최종 수정일: 2026년 2월 2일</p>

        <p>
          물가어때(이하 "서비스")는 이용자의 개인정보를 소중히 다루며, 관련 법령을 준수하고 있습니다.
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. 수집하는 개인정보 항목</h3>
        <p>
          서비스는 별도의 회원가입 없이 이용 가능하며, 이용자 식별을 위한 최소한의 정보(접속 로그, 쿠키 등)만을 수집합니다.<br/>
          - 댓글 작성 시: 닉네임 (익명)
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. 쿠키(Cookie)의 운용 및 거부</h3>
        <p>
          서비스는 이용자에게 편의를 제공하고 사이트 이용 형태를 분석하기 위해 '쿠키'를 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. 구글 애드센스 광고 (필수 기재 사항)</h3>
        <p>
          - 본 사이트는 구글 애드센스 광고를 송출합니다.<br />
          - 구글 등 제3자 사업자는 사용자의 과거 웹사이트 방문 기록을 바탕으로 맞춤형 광고를 제공하기 위해 쿠키(Cookie)를 사용합니다.<br />
          - 사용자는 <a href="https://www.google.com/settings/ads" target="_blank" className="text-indigo-600 underline">광고 설정</a>을 방문하여 맞춤형 광고를 차단할 수 있습니다.
        </p>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm">개인정보 관리 책임자: projectc029@gmail.com</p>
        </div>
      </div>
    </div>
  );
}