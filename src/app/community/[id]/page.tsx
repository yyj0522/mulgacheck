import { supabaseAdmin } from "@/lib/supabase-admin";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Calendar, Users, MapPin, Wallet, Sparkles, Plane, Hotel } from "lucide-react";
import WingBanners from "@/components/WingBanners";
import MainBottomAd from "@/components/MainBottomAd";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: plan } = await supabaseAdmin
    .from("community_plans")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!plan) return { title: "일정을 찾을 수 없습니다 | 물가체크" };

  const title = `[물가체크] ${plan.destination} ${plan.days} 여행 일정 및 예상 경비 (${plan.companion}, ${plan.style})`;
  const description = `예산 ${plan.budget}으로 떠나는 ${plan.destination} ${plan.days} 여행 일정입니다. 최신 물가 기반 AI 추천 코스와 팁을 확인하세요.`;

  return {
    title,
    description,
    keywords: [
      `${plan.destination} 여행`, `${plan.destination} 일정`, `${plan.destination} 경비`, 
      `${plan.days} 일정`, `${plan.destination} 물가`, "여행 일정 추천"
    ],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
      siteName: "물가체크",
    },
  };
}

export default async function CommunityPlanDetailPage({ params }: { params: { id: string } }) {
  const { data: plan } = await supabaseAdmin
    .from("community_plans")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">존재하지 않거나 삭제된 일정입니다.</h2>
        <Link href="/community" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl">목록으로 돌아가기</Link>
      </div>
    );
  }

  const pd = plan.plan_data;

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative z-10 flex flex-col items-center pt-6 pb-12">
      <WingBanners />
      
      <div className="w-full max-w-2xl px-6">
        <header className="mb-6">
          <Link href="/community" className="inline-flex items-center text-slate-400 font-bold hover:text-indigo-600 transition-colors">
            <ChevronLeft size={20} /> 라운지 목록으로
          </Link>
        </header>

        <article className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">{plan.destination}</span>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Calendar size={12}/>{plan.days}</span>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Users size={12}/>{plan.companion}</span>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Sparkles size={12}/>{plan.style}</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-6">
                {pd.title || `${plan.destination} 추천 일정`}
            </h1>

            <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-0.5">총 예상 비용</p>
                        <p className="text-lg font-black text-slate-900">{pd.total_estimated_cost || "비용 정보 없음"}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {plan.include_flight && <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200 flex items-center gap-1"><Plane size={12}/> 항공권 포함</span>}
                    {plan.include_accommodation && <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200 flex items-center gap-1"><Hotel size={12}/> 숙소 포함</span>}
                </div>
            </div>
        </article>

        <div className="space-y-6">
          {pd.itinerary.map((day: any) => (
            <div key={day.day} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                <div className="flex justify-between items-end border-b border-slate-50 pb-4 mb-5">
                    <h2 className="text-xl font-black text-indigo-600">Day {day.day}</h2>
                    {day.day_cost && <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{day.day_cost}</span>}
                </div>

                <div className="space-y-6">
                    {day.schedule.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-16 shrink-0 text-right">
                                <span className="inline-block bg-slate-50 text-slate-500 text-xs font-bold px-2 py-1 rounded-md">{item.time}</span>
                            </div>
                            <div className="flex-1 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <h3 className="font-bold text-slate-800 text-[15px] mb-1.5 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-indigo-400"/> {item.place}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed pl-5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <Link href="/plan" className="inline-block w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-colors">
                나만의 맞춤 일정 만들기
            </Link>
        </div>

        <MainBottomAd />
      </div>
    </div>
  );
}