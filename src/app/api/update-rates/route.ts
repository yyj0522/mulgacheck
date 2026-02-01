import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(1000);
    }
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const API_KEY = process.env.EXCHANGERATE_API_KEY;

  try {
    const exchangeRes = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/KRW`);
    const exchangeData = await exchangeRes.json();
    
    if (exchangeData.result !== 'success') {
      throw new Error('ExchangeRate API failed');
    }

    const rates = exchangeData.conversion_rates;
    const { data: countries, error: dbError } = await supabase.from('countries').select('*');

    if (dbError || !countries) {
      return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
    }

    for (const country of countries) {
      try {
        const rateToKrw = 1 / rates[country.currency_code];
        
        await supabase.from('exchange_rates').upsert({
          currency_code: country.currency_code,
          rate_to_krw: rateToKrw,
          updated_at: new Date()
        });

        const citySlug = country.base_city.toLowerCase().replace(/\s+/g, '-');
        const teleportRes = await fetchWithRetry(`https://api.teleport.org/api/urban_areas/slug:${citySlug}/details/`);
        
        if (teleportRes && teleportRes.ok) {
          const teleportData = await teleportRes.json();
          const costOfLiving = teleportData.categories?.find((c: any) => c.id === 'COST-OF-LIVING');

          if (costOfLiving) {
            const mealData = costOfLiving.data.find((d: any) => d.id === 'COST-RESTAURANT-MEAL');
            const transportData = costOfLiving.data.find((d: any) => d.id === 'COST-PUBLIC-TRANSPORT');
            const hotelData = costOfLiving.data.find((d: any) => d.id === 'COST-HOTEL');

            await supabase.from('countries').update({
              meal_price_local: mealData ? mealData.currency_amount : country.meal_price_local,
              transport_price_local: transportData ? transportData.currency_amount : country.transport_price_local,
              accommodation_price_local: hotelData ? hotelData.currency_amount : country.accommodation_price_local,
            }).eq('id', country.id);
          }
        }
        
        await sleep(500);

      } catch (innerError) {
        console.error(`Failed to update ${country.name_ko}:`, innerError);
        continue;
      }
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}