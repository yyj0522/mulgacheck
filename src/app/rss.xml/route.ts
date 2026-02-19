import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data: plans } = await supabaseAdmin
    .from("community_plans")
    .select("id, destination, days, budget, created_at")
    .order("created_at", { ascending: false })
    .limit(50); 

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>물가체크 여행 일정</title>
        <link>https://www.mulgacheck.com</link>
        <description>최신 물가 기반 AI 여행 일정 및 경비</description>
        ${plans?.map((plan) => `
            <item>
                <title>${plan.destination} ${plan.days} 여행 일정 (예산: ${plan.budget})</title>
                <link>https://www.mulgacheck.com/community/${plan.id}</link>
                <pubDate>${new Date(plan.created_at).toUTCString()}</pubDate>
            </item>
        `).join("")}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}