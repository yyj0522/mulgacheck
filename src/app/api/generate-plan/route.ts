import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      console.error("API Key is missing");
      return NextResponse.json({ error: "서버 설정 오류: API 키가 없습니다." }, { status: 500 });
    }

    const { destination, days, companion, style, prompt: userPrompt } = await req.json();

    if (!destination || !days) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const prompt = `
      당신은 현지 사정에 정통한 전문 여행 가이드입니다.
      아래 사용자의 요청에 맞춰 현실적이고 최적화된 여행 일정을 짜주세요.
      
      [여행 정보]
      - 여행지: ${destination}
      - 기간: ${days}
      - 동행: ${companion}
      - 스타일: ${style}
      - 추가 요청사항: "${userPrompt || "없음"}"
      
      [필수 지침]
      1. **동선 최적화**: 이동 시간을 최소화한 현실적인 동선을 짜주세요.
      2. **실제 장소**: 반드시 실존하는 구체적인 상호명과 명소를 추천해주세요.
      3. **한국어 작성**: 자연스러운 한국어로 작성해주세요.
      4. **이모지 제외**: 텍스트에 이모지를 절대 넣지 마세요.
      
      [JSON 출력 스키마]
      {
        "title": "여행 제목 (예: 오사카 3박 4일 핵심 정복)",
        "itinerary": [
          {
            "day": 1,
            "schedule": [
              { "time": "10:00", "place": "장소명", "desc": "설명" }
            ]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message?.includes("404") || error.status === 404) {
        return NextResponse.json(
            { error: "AI 모델 연결에 실패했습니다. (모델 버전 오류)" },
            { status: 404 }
        );
    }
    
    if (error.status === 429 || error.message?.includes("429")) {
      return NextResponse.json(
        { error: "이용자가 많아 서버가 혼잡합니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "일정을 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}