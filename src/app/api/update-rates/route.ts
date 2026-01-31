import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const API_KEY = 'your_api_key'; 
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/KRW`);
  const data = await res.json();

  if (data.result === 'success') {
    const rates = data.conversion_rates;
    const targets = ['JPY', 'VND', 'THB', 'USD', 'PHP', 'TWD', 'EUR'];

    for (const code of targets) {
      await supabase
        .from('exchange_rates')
        .upsert({ currency_code: code, rate_to_krw: 1 / rates[code], updated_at: new Date() });
    }
    return NextResponse.json({ message: '환율 업데이트 완료' });
  }
  return NextResponse.json({ error: '업데이트 실패' }, { status: 500 });
}