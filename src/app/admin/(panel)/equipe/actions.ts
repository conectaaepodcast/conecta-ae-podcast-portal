"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaffOrRedirect } from "@/lib/auth/staff";
import { uploadSiteImage } from "@/lib/admin/upload-site-image";

export type EquipeActionState = { error: string | null };

const cargos = ["diretor", "jornalista"] as const;
const cargoSchema = z.enum(cargos);

const schema = z.object({
  id: z.string().uuid().optional(),
  cargo: cargoSchema,
  nome: z.string().min(1, "Nome obrigatório."),
  descricao: z.string().optional(),
  instagram_url: z
    .string()
    .transform((s) => s.trim())
    .refine(
      (s) => s === "" || /^https:\/\/.+/i.test(s),
      "URL inválida (use https://…).",
    ),
  ordem: z.coerce.number().int().min(0),
  is_active: z.boolean(),
});

export async function saveEquipeMember(
  _prev: EquipeActionState,
  formData: FormData,
): Promise<EquipeActionState> {
  const { supabase } = await requireStaffOrRedirect();

  const idRaw = String(formData.get("id") ?? "").trim();

  const parsed = schema.safeParse({
    id: idRaw === "" ? undefined : idRaw,
    cargo: String(formData.get("cargo") ?? ""),
    nome: String(formData.get("nome") ?? "").trim(),
    descricao: String(formData.get("descricao") ?? ""),
    instagram_url: String(formData.get("instagram_url") ?? ""),
    ordem: formData.get("ordem"),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const v = parsed.data;

  const payload = {
    cargo: v.cargo,
    nome: v.nome,
    descricao: v.descricao === "" ? null : v.descricao,
    instagram_url: v.instagram_url === "" ? null : v.instagram_url,
    ordem: v.ordem,
    is_active: v.is_active,
  };

  const foto = formData.get("foto") as File | null;

  if (v.id) {
    const { error } = await supabase.from("equipe").update(payload).eq("id", v.id);
    if (error) {
      return { error: error.message };
    }
    const up = await uploadSiteImage(supabase, "equipe", v.id, foto);
    if (up.error) {
      return { error: up.error };
    }
    if (up.path) {
      await supabase.from("equipe").update({ foto_path: up.path }).eq("id", v.id);
    }
    revalidatePath("/");
    revalidatePath("/sobre");
    revalidatePath("/admin/equipe");
    redirect(`/admin/equipe/${v.id}`);
  }

  const { data: inserted, error: insErr } = await supabase
    .from("equipe")
    .insert(payload)
    .select("id")
    .single();

  if (insErr || !inserted) {
    return { error: insErr?.message ?? "Não foi possível criar." };
  }

  const up = await uploadSiteImage(supabase, "equipe", inserted.id, foto);
  if (up.error) {
    return { error: up.error };
  }
  if (up.path) {
    await supabase.from("equipe").update({ foto_path: up.path }).eq("id", inserted.id);
  }

  revalidatePath("/");
  revalidatePath("/sobre");
  revalidatePath("/admin/equipe");
  redirect(`/admin/equipe/${inserted.id}`);
}

export async function deleteEquipeMember(formData: FormData) {
  const { supabase } = await requireStaffOrRedirect();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/equipe");
  }
  const { error } = await supabase.from("equipe").delete().eq("id", id);
  if (error) {
    redirect(`/admin/equipe/${id}?err=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/");
  revalidatePath("/sobre");
  revalidatePath("/admin/equipe");
  redirect("/admin/equipe");
}
