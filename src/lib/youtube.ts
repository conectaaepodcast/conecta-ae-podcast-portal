/** ID de vídeo para embed a partir de ID ou URL do YouTube. */
export function getYoutubeEmbedId(raw: string | null | undefined): string | null {
  if (!raw) {
    return null;
  }
  const s = raw.trim();
  if (!s) {
    return null;
  }
  const watch = s.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watch?.[1]) {
    return watch[1];
  }
  const short = s.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (short?.[1]) {
    return short[1];
  }
  if (/^[a-zA-Z0-9_-]{6,}$/.test(s)) {
    return s;
  }
  return null;
}
