import Image from "next/image";
import { supabase } from "@/lib/supabase";
import SearchAndFilter from "@/components/SearchAndFilter";

export const revalidate = 0;

export default async function Home() {
  const { data: countries } = await supabase
    .from('countries')
    .select('*, exchange_rates(rate_to_krw)');

  return (
    <div className="min-h-screen bg-white">
      <header className="py-20 flex flex-col items-center">
        <div className="relative w-40 h-12 mb-6">
          <Image src="/logo.png" alt="물가어때" fill className="object-contain" priority />
        </div>
        <p className="text-slate-400 text-sm font-medium">실시간 환율로 체감하는 도시별 물가 가이드</p>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        <SearchAndFilter initialData={countries || []} />
      </main>

      <footer className="py-12 text-center text-slate-200 text-[10px] font-bold tracking-widest">
        © 2026 MULGAEOTTAE. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}