import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.mulgaeottae.site"; 

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/checklist`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  const { data: countries } = await supabase.from("countries").select("id");

  const dynamicPages = countries
    ? countries.map((country) => ({
        url: `${baseUrl}/destination/${country.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    : [];

  return [...staticPages, ...dynamicPages];
}