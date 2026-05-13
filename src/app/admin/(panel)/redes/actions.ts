"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { uploadSiteImage } from "@/lib/admin/upload-site-image";

const platforms = ["instagram", "facebook", "youtube", "tiktok", "other"] as const;

const platformSchema = z.enum(platforms);

export type RedeActionState = { error: string | null };

const schema = z.object({
  id: z.string().uuid().optional(),
  platform: platformSchema,
  label: z.string().optional(),
  url: z
    .string()
    .min(1, "URL obrigatória.")
    .transform((s) => s.trim())
    .refine((s) => /^https:\/\/.+/i.test(s), "Use uma URL https:// válida."),
  ordem: z.coerce.number().int().min(0),
  is_active: z.boolean(),
});

export async function saveSocialLink(
  _prev: RedeActionState,
  formData: FormData,
): Promise<RedeActionState> {
  const { supabase } = await requireStaffOrRedirect();

  const idRaw = String(formData.get("id") ?? "").trim();
  const iconRaw = formData.get("icon");
  const icon = iconRaw instanceof File && iconRaw.size > 0 ? iconRaw : null;

  const parsed = schema.safeParse({
    id: idRaw === "" ? undefined : idRaw,
    platform: String(formData.get("platform") ?? ""),
    label: String(formData.get("label") ?? ""),
    url: String(formData.get("url") ?? ""),
    ordem: formData.get("ordem"),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const v = parsed.data;

  const payload = {
    platform: v.platform,
    label: v.label === "" ? null : v.label,
    url: v.url,
    ordem: v.ordem,
    is_active: v.is_active,
  };

  if (v.id) {
    const { error } = await supabase
      .from("social_links")
      .update(payload)
      .eq("id", v.id);
    if (error) {
      return { error: error.message };
    }
    if (icon) {
      const up = await uploadSiteImage(supabase, "social", v.id, icon);
      if (up.error) {
        return { error: up.error };
      }
      if (up.path) {
        await supabase.from("social_links").update({ icon_path: up.path }).eq("id", v.id);
      }
    }
    revalidatePath("/");
    revalidatePath("/admin/redes");
    redirect(`/admin/redes/${v.id}`);
  }

  const { data: inserted, error: insErr } = await supabase
    .from("social_links")
    .insert(payload)
    .select("id")
    .single();

  if (insErr || !inserted) {
    return { error: insErr?.message ?? "Não foi possível criar." };
  }

  if (icon) {
    const up = await uploadSiteImage(supabase, "social", inserted.id, icon);
    if (up.error) {
      return { error: up.error };
    }
    if (up.path) {
      await supabase.from("social_links").update({ icon_path: up.path }).eq("id", inserted.id);
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/redes");
  redirect(`/admin/redes/${inserted.id}`);
}

export async function deleteSocialLink(formData: FormData) {
  const { supabase } = await requireStaffOrRedirect();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/redes");
  }
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) {
    redirect(`/admin/redes/${id}?err=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/");
  revalidatePath("/admin/redes");
  redirect("/admin/redes");
}
