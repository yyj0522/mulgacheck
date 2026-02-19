import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin"; 

export const revalidate = 3600; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.mulgacheck.com"; 
  
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/plan`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.9 },
    { url: `${baseUrl}/budget`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/checklist`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/test`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const { data: countries } = await supabaseAdmin.from("countries").select("id, updated_at"); 
  const dynamicCountries = countries
    ? countries.map((country) => ({
        url: `${baseUrl}/destination/${country.id}`,
        lastModified: country.updated_at ? new Date(country.updated_at) : new Date(),
        changeFrequency: "daily" as const, 
        priority: 0.8, 
      }))
    : [];

  const { data: plans } = await supabaseAdmin.from("community_plans").select("id, created_at");
  const dynamicPlans = plans
    ? plans.map((plan) => ({
        url: `${baseUrl}/community/${plan.id}`,
        lastModified: plan.created_at ? new Date(plan.created_at) : new Date(),
        changeFrequency: "weekly" as const, 
        priority: 0.7, // 메인 콘텐츠보단 낮게 설정
      }))
    : [];

  return [...staticPages, ...dynamicCountries, ...dynamicPlans];
}