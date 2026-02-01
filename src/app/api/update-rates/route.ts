import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Vercel Cron 작업을 위한 설정 (오래 걸려도 끊기지 않게)
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  // 1. 보안 체크 (Vercel Cron에서 호출할 때만 작동)
  // (로컬 테스트할 때는 주석 처리하거나, 헤더를 맞춰주세요)
  const authHeader = request.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log("💱 [Cron] 환율 업데이트 시작...");

    // 2. 무료 환율 API 호출 (USD 기준) - API 키 필요 없음!
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 0 } });
    
    if (!res.ok) {
      throw new Error("환율 API 호출 실패");
    }

    const data = await res.json();
    const rates = data.rates; // { KRW: 1300, JPY: 140 ... }

    // 3. 우리 DB에 있는 환율 데이터 가져오기
    // (countries 테이블이 아니라 exchange_rates 테이블을 기준으로 업데이트합니다)
    const { data: dbRates, error } = await supabase.from('exchange_rates').select('*');

    if (error || !dbRates) {
      throw new Error("DB에서 환율 목록을 가져오지 못했습니다.");
    }

    const usdToKrw = rates["KRW"]; // 오늘자 1달러 = ?원
    let updateCount = 0;

    // 4. 환율 계산 및 업데이트
    for (const item of dbRates) {
      const currencyCode = item.currency_code;
      const usdToLocal = rates[currencyCode]; // 1달러 = ?현지화폐

      // 데이터가 둘 다 존재할 때만 계산
      if (usdToKrw && usdToLocal) {
        // 공식: 1 현지화폐 = (1달러->원화) / (1달러->현지화폐)
        // 예: 1엔 = 1300원 / 140엔 = 9.28원
        const newRate = usdToKrw / usdToLocal;

        // DB 업데이트
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