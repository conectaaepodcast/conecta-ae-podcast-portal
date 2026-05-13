const SITE_IMAGES_BUCKET = "site-images";

/**
 * URL pública de um objeto no bucket `site-images`.
 * `path` deve ser a chave relativa (ex.: `podcasts/slug/capa.webp`).
 */
export function getSiteImagePublicUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) {
    return null;
  }
  const trimmed = path.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/${SITE_IMAGES_BUCKET}/${trimmed}`;
}
