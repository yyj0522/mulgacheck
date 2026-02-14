import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkRateLimit, saveLog } from "@/utils/rateLimit";

const apiKey = process.env.GEMINI_API_KEY;
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    const { allowed, limit } = await checkRateLimit(ip, 'regenerate');
    
    if (!allowed) {
      return NextResponse.json(
        { error: `일정 수정은 하루에 ${limit}회까지만 가능합니다.` },
        { status: 429 }
      );
    }

    const { day, currentSchedule, prompt: userPrompt, destination, style, turnstileToken } = await req.json();

    if (!turnstileToken) {
        return NextResponse.json({ error: "보안 검증 토큰이 없습니다." }, { status: 403 });
    }

    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            secret: turnstileSecret,
            response: turnstileToken,
            remoteip: ip
        })
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
        return NextResponse.json({ error: "보안 검증에 실패했습니다." }, { status: 403 });
    }

    if (userPrompt && userPrompt.length > 100) {
      return NextResponse.json(
        { error: "수정 요청사항은 100자 이내로 입력해주세요." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      당신은 여행 플래너입니다. 
      "${destination}" 여행의 ${day}일차 일정을 수정해주세요.
      여행 스타일: ${style}
      
      [현재 ${day}일차 일정]
      ${JSON.stringify(currentSchedule)}

      [수정 요청사항]
      "${userPrompt}"

      위 요청사항을 반영하여 해당 날짜의 일정을 재구성해주세요.
      - 시간대별로 현실적인 동선을 고려하세요.
      - 이동시간을 고려하세요.
      - 식당/장소는 구체적인 명칭을 사용하세요.
      - **변경된 일정에 맞춰 '일차별 예상 경비(day_cost)'를 반드시 다시 계산해서 작성하세요.**
      - **중요: 반드시 아래 JSON 스키마를 정확히 지켜주세요. schedule 키는 필수이며 배열이어야 합니다.**

      [Output JSON Schema]
      {
        "day": ${day},
        "day_cost": "이 날짜의 예상 식비/교통비 합계 (예: 식비 50,000원 + 교통비 10,000원)",
        "schedule": [
          { "time": "HH:MM", "place": "장소명", "desc": "설명" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanedText);

    if (!data.schedule || !Array.isArray(data.schedule)) {
        data.schedule = []; 
    }
    if (!data.day) {
        data.day = day;
    }
    
    if (!data.day_cost && currentSchedule?.day_cost) {
        data.day_cost = currentSchedule.day_cost;
    }

    await saveLog(ip, 'regenerate');

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Regenerate API Error:", error);
    
    if (error.status === 429 || error.message?.includes("429")) {
        return NextResponse.json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
    }
    
    if (error.status === 404 || error.message?.includes("404")) {
        return NextResponse.json({ error: "AI 모델을 찾을 수 없습니다. 관리자에게 문의하세요." }, { status: 404 });
    }

    return NextResponse.json({ error: "수정 중 오류 발생" }, { status: 500 });
  }
}