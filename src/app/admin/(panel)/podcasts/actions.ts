"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { isValidSlug } from "@/lib/slugify";
import { uploadSiteImage } from "@/lib/admin/upload-site-image";

export type ActionState = { error: string | null };

const schema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(2)
    .max(120)
    .refine(
      (s) => isValidSlug(s),
      "Slug só pode ter letras minúsculas, números e hífens.",
    ),
  title: z.string().min(1, "Título obrigatório."),
  summary: z.string().optional(),
  content: z.string().optional(),
  youtube_video_id: z.string().optional(),
  is_published: z.boolean(),
  is_featured: z.boolean(),
  published_at: z.string().nullable().optional(),
});

function normalizeYoutubeId(raw: string): string | null {
  const s = raw.trim();
  if (!s) {
    return null;
  }
  const watch = s.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watch) {
    return watch[1] ?? null;
  }
  const short = s.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (short) {
    return short[1] ?? null;
  }
  if (/^[a-zA-Z0-9_-]{6,}$/.test(s)) {
    return s;
  }
  return s;
}

export async function savePodcast(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase } = await requireStaffOrRedirect();

  const idRaw = String(formData.get("id") ?? "").trim();
  const publishedRaw = formData.get("published_at");
  const publishedAt =
    typeof publishedRaw === "string" && publishedRaw.length > 0 ? publishedRaw : null;

  const parsed = schema.safeParse({
    id: idRaw === "" ? undefined : idRaw,
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? ""),
    content: String(formData.get("content") ?? ""),
    youtube_video_id: String(formData.get("youtube_video_id") ?? ""),
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
    published_at: publishedAt,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const v = parsed.data;
  const youtubeId = normalizeYoutubeId(v.youtube_video_id ?? "");

  const payload = {
    slug: v.slug,
    title: v.title,
    summary: v.summary === "" ? null : v.summary,
    content: v.content === "" ? null : v.content,
    youtube_video_id: youtubeId,
    is_published: v.is_published,
    is_featured: v.is_featured,
    published_at:
      v.published_at && v.published_at.length > 0
        ? new Date(v.published_at).toISOString()
        : null,
  };

  const cover = formData.get("cover") as File | null;

  if (v.id) {
    const { error } = await supabase.from("podcasts").update(payload).eq("id", v.id);
    if (error) {
      return { error: error.message };
    }
    const up = await uploadSiteImage(supabase, "podcasts", v.id, cover);
    if (up.error) {
      return { error: up.error };
    }
    if (up.path) {
      await supabase
        .from("podcasts")
        .update({ cover_image_path: up.path })
        .eq("id", v.id);
    }
    revalidatePath("/");
    revalidatePath("/podcasts");
    revalidatePath(`/podcasts/${v.slug}`);
    revalidatePath("/admin/podcasts");
    redirect(`/admin/podcasts/${v.id}`);
  }

  const { data: inserted, error: insErr } = await supabase
    .from("podcasts")
    .insert(payload)
    .select("id")
    .single();

  if (insErr || !inserted) {
    return { error: insErr?.message ?? "Não foi possível criar." };
  }

  const up = await uploadSiteImage(supabase, "podcasts", inserted.id, cover);
  if (up.error) {
    return { error: up.error };
  }
  if (up.path) {
    await supabase
      .from("podcasts")
      .update({ cover_image_path: up.path })
      .eq("id", inserted.id);
  }

  revalidatePath("/");
  revalidatePath("/podcasts");
  revalidatePath(`/podcasts/${v.slug}`);
  revalidatePath("/admin/podcasts");
  redirect(`/admin/podcasts/${inserted.id}`);
}

export async function deletePodcast(formData: FormData) {
  const { supabase } = await requireStaffOrRedirect();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/podcasts");
  }
  const { error } = await supabase.from("podcasts").delete().eq("id", id);
  if (error) {
    redirect(`/admin/podcasts/${id}?err=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/");
  revalidatePath("/podcasts");
  revalidatePath("/admin/podcasts");
  redirect("/admin/podcasts");
}
