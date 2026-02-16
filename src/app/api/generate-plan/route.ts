import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkRateLimit, saveLog } from "@/utils/rateLimit";

const apiKey = process.env.GEMINI_API_KEY || "";
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      console.error("Server Error: GEMINI_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: "서버 설정 오류: API 키가 없습니다." }, { status: 500 });
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    const { allowed, limit } = await checkRateLimit(ip, 'generate');
    if (!allowed) {
      return NextResponse.json(
        { error: `일정 생성은 하루에 ${limit}회까지만 가능합니다.` },
        { status: 429 }
      );
    }

    const { 
      destination, 
      days, 
      companion, 
      style, 
      prompt: userPrompt,
      budget,
      includeFlight,
      includeAccommodation,
      turnstileToken
    } = await req.json();

    if (!turnstileToken) {
        return NextResponse.json({ error: "보안 검증 토큰이 없습니다." }, { status: 403 });
    }

    if (turnstileSecret) { 
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
          console.error("Turnstile Validation Failed:", verifyData);
          return NextResponse.json({ error: "보안 검증에 실패했습니다." }, { status: 403 });
      }
    } else {
        console.warn("Warning: TURNSTILE_SECRET_KEY is missing. Skipping verification.");
    }

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
        tools: [{ googleSearch: {} }] as any, 
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const flightText = includeFlight ? "예산에 항공권 포함" : "항공권 별도";
    const hotelText = includeAccommodation ? "예산에 숙박비 포함" : "숙박비 별도";

    const prompt = `
      Create a realistic travel itinerary based on the user's request.
      Use Google Search to find real, currently operating places and accurate prices.
      
      **IMPORTANT: All output must be in Korean (한국어).**

      [User Request]
      - Destination: ${destination}
      - Duration: ${days}
      - Companion: ${companion}
      - Style: ${style}
      - Budget: ${budget || "Not specified"} (${flightText}, ${hotelText})
      - Details: "${userPrompt || "None"}"

      [Instructions]
      1. **Validation**: First, search if "${destination}" is a valid tourist destination. If it is a fake place, internet cafe, or nonsense, return { "error": "유효하지 않은 여행지입니다." } immediately.
      2. **Search & Verify**: Use Google Search to ensure all recommended places are currently open and popular.
      3. **Route Optimization**: Group nearby locations for each day to minimize travel time.
      4. **Budget**: Search for average prices to fit the budget strictly.
      5. **Format**: Output JSON only. No markdown, no emojis. 
      6. **Language**: Write Title, Place names, Descriptions, and Costs in **Korean**.

      [JSON Schema]
      {
        "title": "Creative Title (e.g. 100만원으로 떠나는 오사카 식도락 여행)",
        "total_estimated_cost": "Total Estimated Cost (e.g. 약 95,000엔)",
        "itinerary": [
          {
            "day": 1,
            "day_cost": "Daily Total (e.g. 식비 5,000엔 + 교통비 1,000엔)",
            "schedule": [
              { 
                "time": "HH:MM", 
                "place": "Specific Place Name (Korean)", 
                "desc": "Activity description & cost (Korean). Mention travel time if moving." 
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
    
    let data;
    try {
        data = JSON.parse(cleanedText);
    } catch (e) {
        console.error("JSON Parse Error:", cleanedText);
        return NextResponse.json({ error: "AI 응답 형식이 올바르지 않습니다." }, { status: 500 });
    }

    if (data.error) {
        return NextResponse.json({ error: data.error }, { status: 400 });
    }

    await saveLog(ip, 'generate');

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Generate API Error:", error); 

    if (error.message?.includes("404") || error.status === 404) {
        return NextResponse.json(
            { error: "AI 모델 연결에 실패했습니다. (Gemini 2.5 Flash)" },
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