import Link from "next/link";
import { requireStaffOrRedirect } from "@/lib/auth/staff";

export default async function AdminEquipePage() {
  const { supabase } = await requireStaffOrRedirect();

  const { data: rows, error } = await supabase
    .from("equipe")
    .select("id, nome, cargo, ordem, is_active")
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true });

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
          <h1 className="text-2xl font-semibold text-[#18181b]">Equipe</h1>
          <p className="mt-1 text-sm text-[#52525b]">
            Página Sobre — direção e jornalismo.
          </p>
        </div>
        <Link
          href="/admin/equipe/new"
          className="rounded-lg bg-[#18181b] px-4 py-2 text-sm font-medium text-[#ffffff] hover:bg-[#27272a]"
        >
          Novo membro
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border border-[#e4e4e7]">
        <table className="min-w-full divide-y divide-[#e4e4e7] text-sm">
          <thead className="bg-[#fafafa] text-left text-xs font-medium uppercase tracking-wide text-[#71717a]">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Função</th>
              <th className="px-4 py-3">Ordem</th>
              <th className="px-4 py-3">Visível</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f4f4f5] bg-[#ffffff]">
            {(rows ?? []).map((r) => (
              <tr key={r.id} className="hover:bg-[rgb(250_250_250_/0.8)]">
                <td className="px-4 py-3 font-medium text-[#18181b]">
                  <Link
                    href={`/admin/equipe/${r.id}`}
                    className="text-[#1d4ed8] hover:underline"
                  >
                    {r.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize text-[#3f3f46]">{r.cargo}</td>
                <td className="px-4 py-3 text-[#52525b]">{r.ordem}</td>
                <td className="px-4 py-3 text-[#3f3f46]">
                  {r.is_active ? "Sim" : "Não"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows?.length ? (
          <p className="px-4 py-8 text-center text-sm text-[#71717a]">
            Ainda não há membros.
          </p>
        ) : null}
      </div>
    </div>
  );
}
