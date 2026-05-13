/** Escapa `%` e `_` para uso seguro em filtros `.ilike()` com wildcards manuais. */
export function escapeIlikePattern(raw: string): string {
  return raw.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}
