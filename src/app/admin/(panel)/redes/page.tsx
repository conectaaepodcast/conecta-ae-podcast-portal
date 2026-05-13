import Link from "next/link";
import { requireStaffOrRedirect } from "@/lib/auth/staff";

const platformLabels: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  other: "Outro",
};

export default async function AdminRedesPage() {
  const { supabase } = await requireStaffOrRedirect();

  const { data: rows, error } = await supabase
    .from("social_links")
    .select("id, platform, label, url, ordem, is_active")
    .order("ordem", { ascending: true });

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
          <h1 className="text-2xl font-semibold text-zinc-900">Redes sociais</h1>
          <p className="mt-1 text-sm text-zinc-600">Links do rodapé e contatos.</p>
        </div>
        <Link
          href="/admin/redes/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Novo link
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Plataforma</th>
              <th className="px-4 py-3">Rótulo</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Ordem</th>
              <th className="px-4 py-3">Ativo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {(rows ?? []).map((r) => (
              <tr key={r.id} className="hover:bg-zinc-50/80">
                <td className="px-4 py-3 font-medium text-zinc-900">
                  <Link
                    href={`/admin/redes/${r.id}`}
                    className="text-blue-700 hover:underline"
                  >
                    {platformLabels[r.platform] ?? r.platform}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-700">{r.label ?? "—"}</td>
                <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-zinc-600">
                  {r.url}
                </td>
                <td className="px-4 py-3 text-zinc-600">{r.ordem}</td>
                <td className="px-4 py-3 text-zinc-700">
                  {r.is_active ? "Sim" : "Não"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows?.length ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">
            Ainda não há links.
          </p>
        ) : null}
      </div>
    </div>
  );
}
