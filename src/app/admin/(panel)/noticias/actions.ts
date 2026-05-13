"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { isValidSlug } from "@/lib/slugify";
import { uploadSiteImage } from "@/lib/admin/upload-site-image";

export type NoticiaActionState = { error: string | null };

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
  is_published: z.boolean(),
  is_featured: z.boolean(),
  published_at: z.string().nullable().optional(),
});

export async function saveNoticia(
  _prev: NoticiaActionState,
  formData: FormData,
): Promise<NoticiaActionState> {
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
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
    published_at: publishedAt,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const v = parsed.data;

  const payload = {
    slug: v.slug,
    title: v.title,
    summary: v.summary === "" ? null : v.summary,
    content: v.content === "" ? null : v.content,
    is_published: v.is_published,
    is_featured: v.is_featured,
    published_at:
      v.published_at && v.published_at.length > 0
        ? new Date(v.published_at).toISOString()
        : null,
  };

  const cover = formData.get("cover") as File | null;

  if (v.id) {
    const { error } = await supabase.from("noticias").update(payload).eq("id", v.id);
    if (error) {
      return { error: error.message };
    }
    const up = await uploadSiteImage(supabase, "noticias", v.id, cover);
    if (up.error) {
      return { error: up.error };
    }
    if (up.path) {
      await supabase
        .from("noticias")
        .update({ cover_image_path: up.path })
        .eq("id", v.id);
    }
    revalidatePath("/");
    revalidatePath("/noticias");
    revalidatePath(`/noticias/${v.slug}`);
    revalidatePath("/admin/noticias");
    redirect(`/admin/noticias/${v.id}`);
  }

  const { data: inserted, error: insErr } = await supabase
    .from("noticias")
    .insert(payload)
    .select("id")
    .single();

  if (insErr || !inserted) {
    return { error: insErr?.message ?? "Não foi possível criar." };
  }

  const up = await uploadSiteImage(supabase, "noticias", inserted.id, cover);
  if (up.error) {
    return { error: up.error };
  }
  if (up.path) {
    await supabase
      .from("noticias")
      .update({ cover_image_path: up.path })
      .eq("id", inserted.id);
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath(`/noticias/${v.slug}`);
  revalidatePath("/admin/noticias");
  redirect(`/admin/noticias/${inserted.id}`);
}

export async function deleteNoticia(formData: FormData) {
  const { supabase } = await requireStaffOrRedirect();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/noticias");
  }
  const { error } = await supabase.from("noticias").delete().eq("id", id);
  if (error) {
    redirect(`/admin/noticias/${id}?err=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}
