import { createClient } from "@/lib/supabase/server";
import { escapeIlikePattern } from "@/lib/data/ilike";

const PAGE_SIZE = 12;

function orIlikeThreeCols(table: "podcasts" | "noticias", raw: string) {
  const q = raw.trim().replace(/,/g, " ");
  const e = escapeIlikePattern(q);
  const p = `%${e}%`;
  return `title.ilike.${p},summary.ilike.${p},content.ilike.${p}`;
}

export async function getFeaturedPodcasts(limit = 8) {
  const supabase = await createClient();
  const { data: featured } = await supabase
    .from("podcasts")
    .select("id, slug, title, summary, cover_image_path, published_at")
    .eq("is_featured", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (featured && featured.length > 0) {
    return featured;
  }

  const { data: latest } = await supabase
    .from("podcasts")
    .select("id, slug, title, summary, cover_image_path, published_at")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  return latest ?? [];
}

export async function getLatestNoticias(limit: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("noticias")
    .select("id, slug, title, summary, cover_image_path, published_at")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  return data ?? [];
}

export async function getPodcastsPage(page: number, search?: string) {
  const supabase = await createClient();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("podcasts")
    .select("id, slug, title, summary, cover_image_path, published_at", {
      count: "exact",
    })
    .order("published_at", { ascending: false, nullsFirst: false });

  const q = search?.trim();
  if (q) {
    query = query.or(orIlikeThreeCols("podcasts", q));
  }

  const { data, error, count } = await query.range(from, to);

  return {
    rows: data ?? [],
    total: count ?? 0,
    page: safePage,
    pageSize: PAGE_SIZE,
    error: error?.message,
  };
}

export async function getNoticiasPage(page: number, search?: string) {
  const supabase = await createClient();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("noticias")
    .select("id, slug, title, summary, cover_image_path, published_at", {
      count: "exact",
    })
    .order("published_at", { ascending: false, nullsFirst: false });

  const q = search?.trim();
  if (q) {
    query = query.or(orIlikeThreeCols("noticias", q));
  }

  const { data, error, count } = await query.range(from, to);

  return {
    rows: data ?? [],
    total: count ?? 0,
    page: safePage,
    pageSize: PAGE_SIZE,
    error: error?.message,
  };
}

export async function getPodcastBySlug(slug: string) {
  const supabase = await createClient();
  return supabase.from("podcasts").select("*").eq("slug", slug).maybeSingle();
}

export async function getNoticiaBySlug(slug: string) {
  const supabase = await createClient();
  return supabase.from("noticias").select("*").eq("slug", slug).maybeSingle();
}

export async function getRelatedPodcasts(excludeId: string, limit = 12) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("podcasts")
    .select("id, slug, title, summary, cover_image_path, published_at")
    .neq("id", excludeId)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  return data ?? [];
}

export async function getRelatedNoticias(excludeId: string, limit = 12) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("noticias")
    .select("id, slug, title, summary, cover_image_path, published_at")
    .neq("id", excludeId)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  return data ?? [];
}

export async function getEquipePublic() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("equipe")
    .select("id, cargo, nome, descricao, instagram_url, foto_path, ordem")
    .eq("is_active", true)
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true });

  return data ?? [];
}

export async function getSocialLinksPublic() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("social_links")
    .select("id, platform, label, url, ordem")
    .eq("is_active", true)
    .order("ordem", { ascending: true });

  return data ?? [];
}

export type SearchKind = "all" | "podcast" | "noticia";

export async function globalSearch(query: string, kind: SearchKind) {
  const q = query.trim().replace(/,/g, " ");
  if (!q) {
    return { podcasts: [], noticias: [] };
  }

  const supabase = await createClient();

  const out: {
    podcasts: Awaited<ReturnType<typeof getRelatedPodcasts>>;
    noticias: Awaited<ReturnType<typeof getRelatedNoticias>>;
  } = { podcasts: [], noticias: [] };

  if (kind === "all" || kind === "podcast") {
    const { data } = await supabase
      .from("podcasts")
      .select("id, slug, title, summary, cover_image_path, published_at")
      .or(orIlikeThreeCols("podcasts", q))
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(24);
    out.podcasts = data ?? [];
  }

  if (kind === "all" || kind === "noticia") {
    const { data } = await supabase
      .from("noticias")
      .select("id, slug, title, summary, cover_image_path, published_at")
      .or(orIlikeThreeCols("noticias", q))
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(24);
    out.noticias = data ?? [];
  }

  return out;
}
