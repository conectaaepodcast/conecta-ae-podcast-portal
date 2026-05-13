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

export function AdminSidebar({
  role,
  onMobileDismiss,
}: {
  role: StaffRole;
  /** Fecha o drawer no mobile ao navegar ou ao pedir fecho explícito. */
  onMobileDismiss?: () => void;
}) {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-[#e4e4e7] bg-[#fafafa] md:min-h-screen">
      {onMobileDismiss ? (
        <div className="flex items-center justify-end border-b border-[#e4e4e7] px-2 py-2 md:hidden">
          <button
            type="button"
            onClick={onMobileDismiss}
            className="rounded-lg p-2 text-[#52525b] transition-colors hover:bg-[rgb(228_228_231_/0.8)] hover:text-[#18181b]"
            aria-label="Fechar menu"
          >
            <span aria-hidden className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>
      ) : null}
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
            onClick={() => onMobileDismiss?.()}
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#3f3f46] hover:bg-[rgb(228_228_231_/0.8)] hover:text-[#09090b]"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-[#e4e4e7] p-3">
        <Link
          href="/"
          onClick={() => onMobileDismiss?.()}
          className="mb-2 block rounded-lg px-3 py-2 text-sm text-[#52525b] hover:bg-[rgb(228_228_231_/0.6)] hover:text-[#18181b]"
        >
          Ver site
        </Link>
        <SignOutButton />
      </div>
    </aside>
  );
}
