import Link from "next/link";
import type { Tables } from "@/types/database";
import { siteConfig } from "@/config/constants";
import { sobreConfig } from "@/config/sobre";

type SocialRow = Pick<Tables<"social_links">, "platform" | "label" | "url">;

const platformLabel: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  other: "Web",
};

type Props = {
  links: SocialRow[];
};

export function SiteFooter({ links }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-zinc-900">{siteConfig.name}</p>
            <p className="mt-2 text-sm text-zinc-600">{siteConfig.description}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Redes sociais</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {links.length === 0 ? (
                <li className="text-sm text-zinc-500">Nenhum link cadastrado no painel.</li>
              ) : (
                links.map((l) => (
                  <li key={`${l.platform}-${l.url}`}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-700 underline-offset-4 hover:underline"
                    >
                      {l.label?.trim() || platformLabel[l.platform] || l.platform}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Parcerias</p>
            <ul className="mt-3 space-y-2">
              {sobreConfig.parcerias.map((p) => (
                <li key={p.nome}>
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-700 underline-offset-4 hover:underline"
                    >
                      {p.nome}
                    </a>
                  ) : (
                    <span className="text-sm text-zinc-700">{p.nome}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
          <p>
            © {year} {sobreConfig.empresa.nome}
          </p>
          <Link href="/admin/login" className="hover:text-zinc-800">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
