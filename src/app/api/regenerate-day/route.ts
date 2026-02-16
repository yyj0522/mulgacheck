import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { checkRateLimit, saveLog } from "@/utils/rateLimit";

const apiKey = process.env.GEMINI_API_KEY;
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

    const { day, currentSchedule, prompt: userPrompt, destination, style } = await req.json();

    if (userPrompt && userPrompt.length > 100) {
      return NextResponse.json(
        { error: "수정 요청사항은 100자 이내로 입력해주세요." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        tools: [{ googleSearch: {} }] as any,
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Modify the schedule for Day ${day} of the trip to ${destination}.
      Use Google Search to find locations, check opening hours, and estimate prices.
      
      **IMPORTANT: All output must be in Korean (한국어).**

      [Current Day ${day} Schedule]
      ${JSON.stringify(currentSchedule)}

      [User Modification Request]
      "${userPrompt}"

      [Instructions]
      1. **Search & Check**: If the user requests a specific place, search for its location and opening hours. Ensure it fits the route.
      2. **Optimize Route**: Adjust the schedule sequence based on the new location's proximity to other stops.
      3. **Recalculate Cost**: Update 'day_cost' based on the changes. Search for accurate prices if needed.
      4. **Format**: Output strictly valid JSON.
      5. **Language**: Write all descriptions and costs in **Korean**.

      [Output JSON Schema]
      {
        "day": ${day},
        "day_cost": "Updated daily total (e.g. 식비 6,000엔 + 교통비 800엔)",
        "schedule": [
          { "time": "HH:MM", "place": "Place Name (Korean)", "desc": "Activity & Cost (Korean)" }
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