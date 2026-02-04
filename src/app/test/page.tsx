"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { TEST_QUESTIONS, TEST_RESULTS, TestType } from "@/data/travelTest";
import { ChevronLeft, Share2, RefreshCw, Plane, Download, X } from "lucide-react";
import Image from "next/image";
import { toPng } from "html-to-image";

export default function TravelTestPage() {
  const [step, setStep] = useState<"intro" | "question" | "loading" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    BUDGET: 0, FLEX: 0, FOODIE: 0, VIBE: 0,
  });
  const [result, setResult] = useState<keyof typeof TEST_RESULTS>("BUDGET");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const captureRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (type: string) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (currentQ < TEST_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("loading");
      setTimeout(() => {
        const finalType = Object.keys(newScores).reduce((a, b) => 
          newScores[a] > newScores[b] ? a : b
        ) as keyof typeof TEST_RESULTS;
        setResult(finalType);
        setStep("result");
      }, 2000);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const resultData = TEST_RESULTS[result];
    const shareData = {
        title: "나의 여행 성향 테스트 - 물가체크",
        text: `나의 여행 성향은? "${resultData.title}"`,
        url: url,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("링크가 복사되었습니다!");
    }
  };

  const handleGenerateImage = async () => {
    if (captureRef.current === null) return;

    try {
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        setPreviewUrl(dataUrl);
      } else {
        const link = document.createElement("a");
        link.download = `travel_mbti_${result}.png`;
        link.href = dataUrl;
        link.click();
      }
      
    } catch (err) {
      console.error(err);
      alert("이미지 생성 중 오류가 발생했습니다.");
    }
  };

  if (step === "intro") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <span className="text-4xl mb-6">✈️</span>
        <h1 className="text-3xl font-black text-slate-900 mb-4">
          나의 여행 스타일<br />
          <span className="text-indigo-600">MBTI 테스트</span>
        </h1>
        <p className="text-slate-500 mb-10 leading-relaxed">
          나는 어떤 여행자일까?<br />
          7가지 질문으로 알아보는<br />
          나만의 여행 성향과 추천 여행지!
        </p>
        <button
          onClick={() => setStep("question")}
          className="w-full max-w-xs py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1"
        >
          테스트 시작하기
        </button>
      </div>
    );
  }

  if (step === "question") {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="w-full bg-slate-200 h-2 rounded-full mb-8">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQ + 1) / TEST_QUESTIONS.length) * 100}%` }}
            />
          </div>
          <span className="text-indigo-600 font-bold text-sm mb-2 block">Q{currentQ + 1}.</span>
          <h2 className="text-2xl font-bold text-slate-900 mb-10 h-20 leading-snug">
            {TEST_QUESTIONS[currentQ].question}
          </h2>
          <div className="space-y-4">
            {TEST_QUESTIONS[currentQ].answers.map((ans, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(ans.type)}
                className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl text-left font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                {ans.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-6" />
        <h2 className="text-xl font-bold text-slate-900 animate-pulse">
          여행 성향 분석 중...
        </h2>
        <p className="text-slate-400 text-sm mt-2">당신에게 딱 맞는 나라를 찾고 있어요</p>
      </div>
    );
  }

  const resultData = TEST_RESULTS[result];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${resultData.color} p-6 pb-32`}>
      <div className="max-w-md mx-auto relative">
        <header className="flex justify-between items-center mb-8 text-white/80">
          <Link href="/" className="flex items-center gap-1 hover:text-white">
            <ChevronLeft size={20} /> 메인으로
          </Link>
          <button onClick={() => {
              setStep("intro");
              setCurrentQ(0);
              setScores({ BUDGET: 0, FLEX: 0, FOODIE: 0, VIBE: 0 });
            }} className="p-2 hover:text-white transition-colors">
            <RefreshCw size={20} />
          </button>
        </header>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl text-center animate-in slide-in-from-bottom-10 duration-700">
          <span className="inline-block px-4 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider">
            Your Travel Type
          </span>
          <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight break-keep">
            {resultData.title}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 break-keep">
            {resultData.desc}
          </p>

          <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
            <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
              추천 여행지
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {resultData.recommends.map((country, idx) => (
                <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm">
                  {country}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/"
              className={`w-full py-4 flex items-center justify-center gap-2 rounded-2xl text-white font-bold shadow-lg transition-transform hover:-translate-y-1 bg-gradient-to-r ${resultData.color}`}
            >
              <Plane size={20} />
              추천 나라 물가 확인하기
            </Link>
            
            {/* ✅ 광고 배너 (반응형 적용) */}
            <div className="py-6 flex justify-center w-full">
                
                {/* 1. 모바일용 배너 (320x50) - 화면이 작을 때만 보임 (md:hidden) */}
                <div className="block md:hidden">
                    <a target="_blank" href="https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0030&u_id=" rel="noopener noreferrer nofollow">
                        <img src="http://img.linkprice.com/files/glink/klook/20190604/5cf5ff12bb2ba_320_50.jpg" width="320" height="50" alt="Klook" className="rounded-lg shadow-sm" />
                    </a>
                    <img src="http://track.linkprice.com/lpshow.php?m_id=klook&a_id=A100702487&p_id=0000&l_id=0030&l_cd1=2&l_cd2=0" width="1" height="1" style={{ display: 'none' }} alt="" />
                </div>

                {/* 2. PC용 배너 (468x60) - 화면이 클 때만 보임 (hidden md:block) */}
                <div className="hidden md:block">
                    <a target="_blank" href="https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0015&u_id=" rel="noopener noreferrer nofollow">
                        <img src="http://img.linkprice.com/files/glink/klook/20181011/5bbee16abf19a_468_60.jpg" width="468" height="60" alt="Klook" className="rounded-lg shadow-sm" />
                    </a>
                    <img src="http://track.linkprice.com/lpshow.php?m_id=klook&a_id=A100702487&p_id=0000&l_id=0015&l_cd1=2&l_cd2=0" width="1" height="1" style={{ display: 'none' }} alt="" />
                </div>

            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 공유 버튼 */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-30">
        <div className="max-w-md mx-auto flex gap-3">
          <button 
            onClick={handleShare}
            className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-full shadow-lg shadow-slate-200/50 flex items-center justify-center gap-2 hover:bg-slate-50 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Share2 size={20} /> 결과 공유
          </button>
          <button 
            onClick={handleGenerateImage}
            className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-full shadow-lg shadow-slate-400/50 flex items-center justify-center gap-2 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Download size={20} /> 이미지 저장
          </button>
        </div>
      </div>

      {/* 이미지 미리보기 모달 (모바일용) */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-black text-slate-900 mb-2 text-center">결과 이미지 저장</h3>
            <p className="text-sm text-indigo-600 font-bold text-center mb-4 bg-indigo-50 py-2 rounded-xl">
              이미지를 꾹 눌러서 저장하세요!
            </p>
            
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
              <img src={previewUrl} alt="테스트 결과" className="w-full h-auto object-contain" />
            </div>
            
            <button 
              onClick={() => setPreviewUrl(null)}
              className="w-full mt-6 py-4 bg-slate-900 text-white font-bold rounded-xl"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 캡처용 숨겨진 영역 */}
      <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
        <div 
          ref={captureRef} 
          className={`w-[600px] bg-gradient-to-b ${resultData.color} p-12 flex flex-col items-center text-center`}
        >
          <div className="bg-white rounded-[3rem] p-10 shadow-xl w-full">
            <div className="text-center mb-8">
               <span className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                 Travel MBTI Result
               </span>
               <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight break-keep">
                 {resultData.title}
               </h1>
               <p className="text-slate-500 text-lg leading-relaxed break-keep">
                 {resultData.desc}
               </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-8">
              <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
                나에게 추천하는 여행지
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                {resultData.recommends.map((country, idx) => (
                  <span key={idx} className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 shadow-sm">
                    {country}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest">
               <Plane size={16} /> Powered by MulgaCheck
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}