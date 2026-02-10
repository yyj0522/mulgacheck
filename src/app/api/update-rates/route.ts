import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log("💱 [Cron] 환율 업데이트 시작...");

    const res = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 0 } });
    
    if (!res.ok) {
      throw new Error("환율 API 호출 실패");
    }

    const data = await res.json();
    const rates = data.rates; 

    const { data: dbRates, error } = await supabase.from('exchange_rates').select('*');

    if (error || !dbRates) {
      throw new Error("DB에서 환율 목록을 가져오지 못했습니다.");
    }

    const usdToKrw = rates["KRW"]; 
    let updateCount = 0;

    for (const item of dbRates) {
      const currencyCode = item.currency_code;
      const usdToLocal = rates[currencyCode]; 

      if (usdToKrw && usdToLocal) {
        const newRate = usdToKrw / usdToLocal;

        await supabase
          .from('exchange_rates')
          .update({
            rate_to_krw: newRate,
            updated_at: new Date().toISOString()
          })
          .eq('currency_code', currencyCode);
        
        console.log(`✅ ${currencyCode} 갱신: ${newRate.toFixed(2)}원`);
        updateCount++;
      }
    }

    console.log(`🏁 총 ${updateCount}개국 환율 업데이트 완료`);
    return NextResponse.json({ success: true, count: updateCount });

  } catch (err: any) {
    console.error("❌ 업데이트 실패:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}