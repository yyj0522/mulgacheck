import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkRateLimit, saveLog } from "@/utils/rateLimit";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const { allowed, limit } = await checkRateLimit(ip, 'generate');
    if (!allowed) {
      return NextResponse.json(
        { error: `일정 생성은 하루에 ${limit}회까지만 가능합니다.` },
        { status: 429 }
      );
    }

    if (!apiKey) {
      console.error("API Key is missing");
      return NextResponse.json({ error: "서버 설정 오류: API 키가 없습니다." }, { status: 500 });
    }

    const { 
      destination, 
      days, 
      companion, 
      style, 
      prompt: userPrompt,
      budget,
      includeFlight,
      includeAccommodation
    } = await req.json();

    if (!destination || !days) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    const invalidPattern = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (destination.length < 2 || invalidPattern.test(destination)) {
       return NextResponse.json({ error: "올바른 여행지 이름을 입력해주세요." }, { status: 400 });
    }

    if (userPrompt && userPrompt.length > 100) {
      return NextResponse.json(
        { error: "추가 요청사항은 100자 이내로 입력해주세요." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const flightText = includeFlight ? "예산에 항공권 비용 포함" : "항공권 비용 별도(예산에서 제외)";
    const hotelText = includeAccommodation ? "예산에 숙박비 포함" : "숙박비 별도(예산에서 제외)";

    const prompt = `
      당신은 20년 경력의 베테랑 여행 가이드입니다. 
      사용자의 요청에 맞춰 **실제로 수행 가능한 현실적인** 여행 일정을 기획해야 합니다.

      [여행 정보]
      - 여행지: ${destination}
      - 기간: ${days}
      - 동행: ${companion}
      - 스타일: ${style}
      - 예산: ${budget || "미정"} (${flightText}, ${hotelText})
      - 추가 요청사항: "${userPrompt || "없음"}"
      
      [검증 및 차단 지침 (매우 중요)]
      1. 사용자가 입력한 여행지 "${destination}"이 **실제 지도에 존재하고 관광이 가능한 도시나 국가**인지 엄격하게 검증하세요.
      2. "혁준이네집", "PC방", "daosduo", 무작위 문자열, 사람 이름 등 관광지가 아닌 경우, 
         **절대로 일정을 만들지 말고** JSON의 error 필드에 "유효하지 않은 여행지입니다."라고 출력하고 종료하세요.
      3. 10명 중 1명의 정상 사용자가 불편하더라도, 조금이라도 의심스러우면 차단하세요.

      [일정 생성 필수 지침]
      1. **현실적인 동선**: 장소 간 이동 거리와 교통편 시간을 반드시 고려하세요. 순간 이동은 불가능합니다.
         (예: 오전 10시 도쿄, 오후 1시 오사카 -> 불가능하므로 절대 금지)
      2. **구체적 명칭**: "맛있는 식당" 대신 "이치란 라멘", "스타벅스 시부야점" 처럼 실존하는 상호명을 쓰세요.
      3. **예산 반영**: 입력된 예산(${budget})에 맞춰 식당 등급(고급/가성비)을 조정하세요.
      4. **이모지 금지**: 텍스트에 이모지를 절대 사용하지 마세요.
      5. **현지 화폐**: 비용 표시는 해당 국가의 화폐 단위로 표기하세요 (예: 일본-엔, 베트남-동).

      [출력 JSON 스키마]
      유효하지 않은 여행지일 경우: { "error": "유효하지 않은 여행지입니다." }
      
      유효한 경우:
      {
        "title": "여행 제목 (예: 100만원으로 떠나는 오사카 3박 4일)",
        "total_estimated_cost": "총 예상 비용 (예: 약 95,000엔)",
        "itinerary": [
          {
            "day": 1,
            "day_cost": "일차별 예상 식비/교통비 합계 (예: 식비 5,000엔 + 교통비 1,000엔)",
            "schedule": [
              { 
                "time": "HH:MM", 
                "place": "장소명", 
                "desc": "활동 내용 및 예상 소요 비용 (이동 시간 포함하여 현실적으로 작성)" 
              }
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

    if (data.error) {
        return NextResponse.json({ error: data.error }, { status: 400 });
    }

    await saveLog(ip, 'generate');

    return NextResponse.json(data);

  } catch (error: any) {
    
    if (error.message?.includes("404") || error.status === 404) {
        return NextResponse.json(
            { error: "AI 모델 연결에 실패했습니다." },
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