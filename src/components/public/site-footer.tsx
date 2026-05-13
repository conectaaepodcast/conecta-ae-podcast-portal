import Image from "next/image";
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
    <footer className="mt-auto border-t border-white/10 bg-[#000000]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link
              href="/"
              className="relative block h-24 w-[min(260px,72vw)] outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-gold)]/75 sm:h-28"
            >
              <Image
                src="/logov2.png"
                alt=""
                fill
                className="object-contain object-left"
                sizes="(max-width: 768px) 72vw, 260px"
              />
              <span className="sr-only">{siteConfig.name}</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              {siteConfig.description}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-[var(--brand-gold)]">
              Redes sociais
            </p>
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
                      className="text-sm font-medium text-zinc-300 underline-offset-4 transition-colors hover:text-[var(--brand-gold)] hover:underline"
                    >
                      {l.label?.trim() || platformLabel[l.platform] || l.platform}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-[var(--brand-gold)]">Parcerias</p>
            <ul className="mt-3 space-y-2">
              {sobreConfig.parcerias.map((p) => (
                <li key={p.nome}>
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-300 underline-offset-4 transition-colors hover:text-[var(--brand-gold)] hover:underline"
                    >
                      {p.nome}
                    </a>
                  ) : (
                    <span className="text-sm text-zinc-400">{p.nome}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-zinc-500">
          <p>
            © {year} {sobreConfig.empresa.nome}
          </p>
          <Link
            href="/admin/login"
            className="text-zinc-400 transition-colors hover:text-[var(--brand-gold)]"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
