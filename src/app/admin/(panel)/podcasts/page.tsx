import Link from "next/link";
import { requireStaffOrRedirect } from "@/lib/auth/staff";

export default async function AdminPodcastsPage() {
  const { supabase } = await requireStaffOrRedirect();

  const { data: rows, error } = await supabase
    .from("podcasts")
    .select("id, slug, title, is_published, published_at, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <p className="text-[#dc2626]">Erro ao carregar: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#18181b]">Podcasts</h1>
          <p className="mt-1 text-sm text-[#52525b]">
            Criar, editar e publicar episódios.
          </p>
        </div>
        <Link
          href="/admin/podcasts/new"
          className="rounded-lg bg-[#18181b] px-4 py-2 text-sm font-medium text-[#ffffff] hover:bg-[#27272a]"
        >
          Novo podcast
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border border-[#e4e4e7]">
        <table className="min-w-full divide-y divide-[#e4e4e7] text-sm">
          <thead className="bg-[#fafafa] text-left text-xs font-medium uppercase tracking-wide text-[#71717a]">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Publicação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f4f4f5] bg-[#ffffff]">
            {(rows ?? []).map((r) => (
              <tr key={r.id} className="hover:bg-[rgb(250_250_250_/0.8)]">
                <td className="px-4 py-3 font-medium text-[#18181b]">
                  <Link
                    href={`/admin/podcasts/${r.id}`}
                    className="text-[#1d4ed8] hover:underline"
                  >
                    {r.title}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-[#52525b]">{r.slug}</td>
                <td className="px-4 py-3 text-[#3f3f46]">
                  {r.is_published ? "Publicado" : "Rascunho"}
                </td>
                <td className="px-4 py-3 text-[#52525b]">
                  {r.published_at
                    ? new Date(r.published_at).toLocaleString("pt-BR")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows?.length ? (
          <p className="px-4 py-8 text-center text-sm text-[#71717a]">
            Ainda não há podcasts.
          </p>
        ) : null}
      </div>
    </div>
  );
}
