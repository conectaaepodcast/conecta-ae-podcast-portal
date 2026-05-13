import Link from "next/link";
import { requireStaffOrRedirect } from "@/lib/auth/staff";

export default async function AdminHomePage() {
  const { supabase } = await requireStaffOrRedirect();

  const [podcasts, noticias, equipe, redes] = await Promise.all([
    supabase.from("podcasts").select("id", { count: "exact", head: true }),
    supabase.from("noticias").select("id", { count: "exact", head: true }),
    supabase.from("equipe").select("id", { count: "exact", head: true }),
    supabase.from("social_links").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Podcasts", count: podcasts.count ?? 0, href: "/admin/podcasts" },
    { label: "Notícias", count: noticias.count ?? 0, href: "/admin/noticias" },
    { label: "Membros equipe", count: equipe.count ?? 0, href: "/admin/equipe" },
    { label: "Links redes", count: redes.count ?? 0, href: "/admin/redes" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[#18181b]">Painel</h1>
      <p className="mt-1 text-sm text-[#52525b]">
        Resumo do conteúdo gerido no Supabase.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="block rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-5 transition hover:border-[#d4d4d8] hover:bg-[#f4f4f5]"
            >
              <p className="text-sm font-medium text-[#71717a]">{s.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-[#18181b]">
                {s.count}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
