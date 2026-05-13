import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";
import { createPublicAnonClient } from "@/lib/supabase/public-anon";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl().origin;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/podcasts`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/noticias`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/pesquisa`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  try {
    const supabase = createPublicAnonClient();
    const [podcastsRes, noticiasRes] = await Promise.all([
      supabase.from("podcasts").select("slug, updated_at"),
      supabase.from("noticias").select("slug, updated_at"),
    ]);

    const podcastEntries: MetadataRoute.Sitemap = (podcastsRes.data ?? []).map((row) => ({
      url: `${base}/podcasts/${row.slug}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const noticiaEntries: MetadataRoute.Sitemap = (noticiasRes.data ?? []).map((row) => ({
      url: `${base}/noticias/${row.slug}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticEntries, ...podcastEntries, ...noticiaEntries];
  } catch {
    return staticEntries;
  }
}
