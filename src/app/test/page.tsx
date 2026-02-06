"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { TEST_QUESTIONS, TEST_RESULTS } from "@/data/travelTest";
import { ChevronLeft, Share2, RefreshCw, Plane, Download, X } from "lucide-react";
import { toPng } from "html-to-image";
import Image from "next/image";

export default function TravelTestPage() {
  const [step, setStep] = useState<"intro" | "question" | "loading" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  
  const [scores, setScores] = useState<Record<string, number>>({
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0,
  });
  
  const [result, setResult] = useState<string>("ISTJ");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sharedResult = params.get("result");
      
      if (sharedResult && TEST_RESULTS[sharedResult]) {
        setResult(sharedResult);
        setStep("result");
      }
    }
  }, []);

  const handleAnswer = (type: string) => {
    setScores((prev) => ({ ...prev, [type]: prev[type] + 1 }));

    if (currentQ < TEST_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("loading");
      setTimeout(() => calculateResult(), 2000);
    }
  };

  const calculateResult = () => {
    const e = scores.E > scores.I ? "E" : "I";
    const s = scores.S > scores.N ? "S" : "N";
    const t = scores.T > scores.F ? "T" : "F";
    const j = scores.J > scores.P ? "J" : "P";
    
    const finalType = `${e}${s}${t}${j}`;
    setResult(finalType);
    setStep("result");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?result=${result}`;
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
      const originalStyle = captureRef.current.style.cssText;
      
      captureRef.current.style.width = '420px';
      captureRef.current.style.whiteSpace = 'normal';
      captureRef.current.style.wordBreak = 'keep-all';

      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        width: 420,
        height: 1100, 
      });
      
      captureRef.current.style.cssText = originalStyle;
      
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

  const pageWrapperClass = "min-h-screen bg-slate-50";

  if (step === "intro") {
    return (
      <div className={`${pageWrapperClass} flex flex-col items-center justify-center p-6 text-center`}>
        <span className="text-4xl mb-6">✈️</span>
        <h1 className="text-3xl font-black text-slate-900 mb-4">
          나의 여행 스타일<br />
          <span className="text-indigo-600">MBTI 테스트</span>
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          나는 어떤 여행자일까?<br />
          12가지 질문으로 알아보는<br />
          나만의 여행 성향과 추천 여행지!
        </p>
        <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-100 mb-10 text-sm text-slate-500 font-medium">
            ⏱ 소요 시간 : 약 3분 &nbsp;|&nbsp; 총 12문항
        </div>
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
      <div className={`${pageWrapperClass} p-6 flex flex-col items-center justify-center`}>
        <div className="w-full max-w-md">
          <div className="w-full bg-slate-200 h-2 rounded-full mb-8">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQ + 1) / TEST_QUESTIONS.length) * 100}%` }}
            />
          </div>
          <span className="text-indigo-600 font-bold text-sm mb-2 block">Q{currentQ + 1}.</span>
          <h2 className="text-2xl font-bold text-slate-900 mb-10 min-h-[80px] leading-snug break-keep">
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
      <div className={`${pageWrapperClass} flex flex-col items-center justify-center p-6 text-center`}>
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
    <div className="min-h-screen bg-white p-6 pb-0">
      <div className="max-w-md mx-auto relative">
        <header className="flex justify-between items-center mb-8 text-slate-500">
          <Link href="/" className="flex items-center gap-1 hover:text-slate-900">
            <ChevronLeft size={20} /> 메인으로
          </Link>
          <button onClick={() => {
              setStep("intro");
              setCurrentQ(0);
              setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
            }} className="p-2 hover:text-slate-900 transition-colors">
            <RefreshCw size={20} />
          </button>
        </header>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl text-center animate-in slide-in-from-bottom-10 duration-700 relative z-10">
          <span className="inline-block px-4 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider">
            Your Travel Type
          </span>
          
          <div className="mb-4 flex justify-center w-full">
             <Image 
               src={resultData.image} 
               alt={resultData.title} 
               width={1200} 
               height={1200}
               priority
               className="w-full h-auto object-contain drop-shadow-md mx-auto" 
             />
          </div>

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
          
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-blue-400 uppercase mb-2">환상의 짝꿍</p>
                <p className="font-bold text-blue-900 text-sm break-keep leading-tight">
                  {TEST_RESULTS[resultData.best].title}
                </p>
             </div>
             <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-red-400 uppercase mb-2">환장의 짝꿍</p>
                <p className="font-bold text-red-900 text-sm break-keep leading-tight">
                  {TEST_RESULTS[resultData.worst].title}
                </p>
             </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/"
              className="w-full py-4 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 transition-transform hover:-translate-y-1"
            >
              <Plane size={20} />
              추천 나라 물가 확인하기
            </Link>
            
            <button
              onClick={() => {
                setStep("intro");
                setCurrentQ(0);
                setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
              }}
              className="w-full py-4 flex items-center justify-center gap-2 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
            >
              <RefreshCw size={18} />
              테스트 다시하기
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-3 w-full">
          <button 
            onClick={handleShare}
            className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl shadow-lg shadow-slate-200/50 flex items-center justify-center gap-2 hover:bg-slate-50 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Share2 size={20} /> 결과 공유
          </button>
          <button 
            onClick={handleGenerateImage}
            className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-400/50 flex items-center justify-center gap-2 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Download size={20} /> 이미지 저장
          </button>
        </div>

        <div className="mt-8 mb-4 flex flex-col items-center justify-center w-full relative z-0">
            <div className="block md:hidden">
                <a target="_blank" href="https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0030&u_id=" rel="noopener noreferrer nofollow">
                    <img 
                      src="http://img.linkprice.com/files/glink/klook/20190604/5cf5ff12bb2ba_320_50.jpg" 
                      width="320" 
                      height="50" 
                      alt="Klook" 
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </a>
                <img src="http://track.linkprice.com/lpshow.php?m_id=klook&a_id=A100702487&p_id=0000&l_id=0030&l_cd1=2&l_cd2=0" width="1" height="1" style={{ display: 'none' }} alt="" />
            </div>

            <div className="hidden md:block">
                <a target="_blank" href="https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0015&u_id=" rel="noopener noreferrer nofollow">
                    <img 
                      src="http://img.linkprice.com/files/glink/klook/20181011/5bbee16abf19a_468_60.jpg" 
                      width="468" 
                      height="60" 
                      alt="Klook"
                      style={{ width: '468px', height: '60px' }} 
                    />
                </a>
                <img src="http://track.linkprice.com/lpshow.php?m_id=klook&a_id=A100702487&p_id=0000&l_id=0015&l_cd1=2&l_cd2=0" width="1" height="1" style={{ display: 'none' }} alt="" />
            </div>
        </div>

      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
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

      <div 
        style={{ 
          position: "fixed", 
          left: "-9999px", 
          top: 0,
        }}
      >
        <div 
          ref={captureRef} 
          style={{
            width: '420px',
            wordBreak: 'keep-all',
            whiteSpace: 'normal'
          }}
          className="bg-white p-6 flex flex-col items-center text-center"
        >
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl w-full flex flex-col items-center">
            <div className="text-center mb-6 w-full flex flex-col items-center">
               <span className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                 Travel MBTI Result
               </span>
               <div className="mb-4 flex justify-center w-full">
                  <Image 
                    src={resultData.image} 
                    alt={resultData.title} 
                    width={800}
                    height={800} 
                    className="w-full h-auto object-contain mx-auto" 
                  />
               </div>
               <h1 
                 style={{ width: '100%', wordBreak: 'keep-all', whiteSpace: 'normal' }}
                 className="text-2xl font-black text-slate-900 mb-3 leading-tight"
               >
                 {resultData.title}
               </h1>
               <p 
                 style={{ width: '100%', wordBreak: 'keep-all', whiteSpace: 'normal' }}
                 className="text-slate-500 text-sm leading-relaxed"
               >
                 {resultData.desc}
               </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 mb-6 w-full">
              <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                나에게 추천하는 여행지
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {resultData.recommends.map((country, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 shadow-sm">
                    {country}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6 w-full">
               <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">환상의 짝꿍</p>
                  <p 
                    style={{ width: '100%', wordBreak: 'keep-all', whiteSpace: 'normal' }}
                    className="font-bold text-blue-900 text-xs leading-tight"
                  >
                    {TEST_RESULTS[resultData.best].title}
                  </p>
               </div>
               <div className="bg-red-50 p-4 rounded-3xl border border-red-100 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-red-400 uppercase mb-1">환장의 짝꿍</p>
                  <p 
                    style={{ width: '100%', wordBreak: 'keep-all', whiteSpace: 'normal' }}
                    className="font-bold text-red-900 text-xs leading-tight"
                  >
                    {TEST_RESULTS[resultData.worst].title}
                  </p>
               </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
               <Plane size={12} /> Powered by MulgaCheck
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}