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
    <aside className="flex w-56 shrink-0 flex-col border-r border-[#e4e4e7] bg-[#fafafa]">
      <div className="border-b border-[#e4e4e7] px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[#71717a]">
          Admin
        </p>
        <p className="mt-1 text-sm font-semibold text-[#18181b]">Portal</p>
        <p className="mt-0.5 text-xs text-[#71717a]">
          Função:{" "}
          <span className="text-[#27272a]">
            {role === "admin" ? "Administrador" : "Editor"}
          </span>
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#3f3f46] hover:bg-[rgb(228_228_231_/0.8)] hover:text-[#09090b]"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-[#e4e4e7] p-3">
        <Link
          href="/"
          className="mb-2 block rounded-lg px-3 py-2 text-sm text-[#52525b] hover:bg-[rgb(228_228_231_/0.6)] hover:text-[#18181b]"
        >
          Ver site
        </Link>
        <SignOutButton />
      </div>
    </aside>
  );
}
