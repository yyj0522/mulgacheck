import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white p-6 md:p-12 text-slate-700">
      <div className="max-w-3xl mx-auto prose prose-slate">
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
        
        <p className="text-sm text-slate-400 mb-8">최종 수정일: 2026년 2월 15일</p>

        <p>
          물가체크(이하 "서비스")는 이용자의 개인정보를 소중히 다루며, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령을 준수하고 있습니다.
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. 수집하는 개인정보 항목</h3>
        <p>
          서비스는 별도의 회원가입 없이 이용 가능하며, 서비스 안정성 확보와 부정 이용 방지를 위해 다음과 같은 최소한의 정보를 자동으로 수집합니다.<br/>
          - 필수 수집 항목: IP 주소, 접속 로그, 쿠키(Cookie), 브라우저 정보(User Agent)<br/>
          - 선택 수집 항목(댓글 작성 시): 닉네임 (익명)
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. 개인정보의 수집 및 이용 목적</h3>
        <p>
          수집한 정보는 다음의 목적을 위해서만 이용합니다.<br/>
          - 서비스 제공 및 콘텐츠 이용 통계 분석<br/>
          - 비정상적인 접근(DDoS 공격, 매크로 등) 탐지 및 차단<br/>
          - API 과도한 호출 방지를 위한 일일 사용량 제한(Rate Limiting) 적용
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. IP 주소 및 접속 로그의 보관 및 파기</h3>
        <p>
          서비스의 보안 유지와 비정상적인 이용 행위를 방지하기 위해 수집된 IP 주소 및 접속 로그는 다음과 같이 관리됩니다.<br/>
          - 보관 목적: 악의적인 공격 방지 및 일일 서비스 이용 횟수 제한<br/>
          - 보관 기간: 수집일로부터 최대 3개월<br/>
          - 파기 방법: 보관 기간이 경과한 로그 데이터는 복구 불가능한 방법으로 영구 삭제됩니다.
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. 쿠키(Cookie)의 운용 및 거부</h3>
        <p>
          서비스는 이용자에게 편의를 제공하고 사이트 이용 형태를 분석하기 위해 '쿠키'를 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
        </p>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm">개인정보 관리 책임자: projectc029@gmail.com</p>
        </div>
      </div>
    </div>
  );
}