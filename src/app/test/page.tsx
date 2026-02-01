"use client";

import { useState } from "react";
import Link from "next/link";
import { TEST_QUESTIONS, TEST_RESULTS, TestType } from "@/data/travelTest";
import { ChevronLeft, Share2, RefreshCw, Plane, ArrowRight } from "lucide-react";

export default function TravelTestPage() {
  const [step, setStep] = useState<"intro" | "question" | "loading" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    BUDGET: 0, FLEX: 0, FOODIE: 0, VIBE: 0,
  });
  const [result, setResult] = useState<keyof typeof TEST_RESULTS>("BUDGET");

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
    if (navigator.share) {
      try {
        await navigator.share({ title: "여행 성향 테스트", url });
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("링크가 복사되었습니다!");
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
    <div className={`min-h-screen bg-gradient-to-b ${resultData.color} p-6 pb-20`}>
      <div className="max-w-md mx-auto">
        <header className="flex justify-between items-center mb-8 text-white/80">
          <Link href="/" className="flex items-center gap-1 hover:text-white">
            <ChevronLeft size={20} /> 메인으로
          </Link>
          <button onClick={handleShare} className="p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-sm">
            <Share2 size={20} className="text-white" />
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
            
            <button
              onClick={() => {
                setStep("intro");
                setCurrentQ(0);
                setScores({ BUDGET: 0, FLEX: 0, FOODIE: 0, VIBE: 0 });
              }}
              className="w-full py-4 flex items-center justify-center gap-2 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
            >
              <RefreshCw size={18} />
              테스트 다시하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}