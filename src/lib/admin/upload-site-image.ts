import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export async function uploadSiteImage(
  supabase: SupabaseClient<Database>,
  folder: string,
  id: string,
  file: File | null,
): Promise<{ path: string | null; error?: string }> {
  if (!file || file.size === 0) {
    return { path: null };
  }
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const path = `${folder}/${id}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from("site-images").upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) {
    return { path: null, error: error.message };
  }
  return { path };
}
