"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-in-up">
      <div className="max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10">
        <div className="text-sm text-slate-300 text-center md:text-left">
          <p className="font-bold text-white mb-1">🍪 쿠키 사용 안내</p>
          <p>
            원활한 서비스 제공과 맞춤형 광고 표시를 위해 쿠키를 사용합니다.<br className="md:hidden"/>
            사이트를 계속 이용하시면 쿠키 사용에 동의하는 것으로 간주합니다.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-sm"
          >
            동의하고 닫기
          </button>
        </div>
      </div>
    </div>
  );
}