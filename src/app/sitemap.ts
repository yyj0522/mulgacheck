import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.mulgacheck.com"; 
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/plan`, 
      lastModified: new Date(),
      changeFrequency: "daily" as const, 
      priority: 0.9, 
    },
    {
      url: `${baseUrl}/budget`, 
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/checklist`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/test`, 
      lastModified: new Date(),
      changeFrequency: "monthly" as const, 
      priority: 0.7,
    },
  ];

  const { data: countries } = await supabase.from("countries").select("id, updated_at"); 

  const dynamicPages = countries
    ? countries.map((country) => ({
        url: `${baseUrl}/destination/${country.id}`,
        lastModified: country.updated_at ? new Date(country.updated_at) : new Date(),
        changeFrequency: "daily" as const, 
        priority: 0.8, 
      }))
    : [];

  return [...staticPages, ...dynamicPages];
}