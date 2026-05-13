import Link from "next/link";
import { requireStaffOrRedirect } from "@/lib/auth/staff";

export default async function AdminNoticiasPage() {
  const { supabase } = await requireStaffOrRedirect();

  const { data: rows, error } = await supabase
    .from("noticias")
    .select("id, slug, title, is_published, published_at, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">Erro ao carregar: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Notícias</h1>
          <p className="mt-1 text-sm text-zinc-600">Artigos e atualizações.</p>
        </div>
        <Link
          href="/admin/noticias/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Nova notícia
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Publicação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {(rows ?? []).map((r) => (
              <tr key={r.id} className="hover:bg-zinc-50/80">
                <td className="px-4 py-3 font-medium text-zinc-900">
                  <Link
                    href={`/admin/noticias/${r.id}`}
                    className="text-blue-700 hover:underline"
                  >
                    {r.title}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-zinc-600">{r.slug}</td>
                <td className="px-4 py-3 text-zinc-700">
                  {r.is_published ? "Publicado" : "Rascunho"}
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {r.published_at
                    ? new Date(r.published_at).toLocaleString("pt-BR")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows?.length ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">
            Ainda não há notícias.
          </p>
        ) : null}
      </div>
    </div>
  );
}
