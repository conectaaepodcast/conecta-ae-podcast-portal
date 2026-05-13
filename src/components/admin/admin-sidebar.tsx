import Link from "next/link";
import type { StaffRole } from "@/types/database";
import { SignOutButton } from "@/components/admin/sign-out-button";

const links = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/podcasts", label: "Podcasts" },
  { href: "/admin/noticias", label: "Notícias" },
  { href: "/admin/equipe", label: "Equipe" },
  { href: "/admin/redes", label: "Redes sociais" },
] as const;

export function AdminSidebar({ role }: { role: StaffRole }) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50">
      <div className="border-b border-zinc-200 px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Admin
        </p>
        <p className="mt-1 text-sm font-semibold text-zinc-900">Portal</p>
        <p className="mt-0.5 text-xs text-zinc-500">
          Função:{" "}
          <span className="text-zinc-800">
            {role === "admin" ? "Administrador" : "Editor"}
          </span>
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200/80 hover:text-zinc-950"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-zinc-200 p-3">
        <Link
          href="/"
          className="mb-2 block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900"
        >
          Ver site
        </Link>
        <SignOutButton />
      </div>
    </aside>
  );
}
