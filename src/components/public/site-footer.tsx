import Image from "next/image";
import Link from "next/link";
import type { Tables } from "@/types/database";
import { siteConfig } from "@/config/constants";
import { sobreConfig } from "@/config/sobre";
import { getSiteImagePublicUrl } from "@/lib/supabase/storage";

type SocialRow = Pick<Tables<"social_links">, "platform" | "label" | "url" | "icon_path">;

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
    <footer className="mt-auto border-t border-[rgba(255,255,255,0.1)] bg-[#000000]">
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
            <p className="max-w-sm text-sm leading-relaxed text-[#d4d4d8]">
              {siteConfig.description}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-[var(--brand-gold)]">
              Redes sociais
            </p>
            <ul className="mt-3 flex flex-col gap-3">
              {links.length === 0 ? (
                <li className="text-sm text-[#71717a]">Nenhum link cadastrado no painel.</li>
              ) : (
                links.map((l) => {
                  const iconUrl = getSiteImagePublicUrl(l.icon_path);
                  const text = l.label?.trim() || platformLabel[l.platform] || l.platform;
                  return (
                    <li key={`${l.platform}-${l.url}`}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm font-medium text-[#d4d4d8] underline-offset-4 transition-colors hover:text-[var(--brand-gold)] hover:underline"
                      >
                        {iconUrl ? (
                          <Image
                            src={iconUrl}
                            alt=""
                            width={32}
                            height={32}
                            className="h-8 w-8 shrink-0 object-contain"
                            sizes="32px"
                            unoptimized={(l.icon_path ?? "").toLowerCase().includes(".svg")}
                          />
                        ) : null}
                        <span>{text}</span>
                      </a>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-wide text-[var(--brand-gold)]">Realização e apoio</p>
            <ul className="mt-3 flex w-full flex-col gap-4 md:flex-row md:flex-wrap">
              {sobreConfig.parcerias.map((p) => (
                <li key={p.nome} className={p.imagem ? "w-full" : undefined}>
                  {p.imagem ? (
                    p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block aspect-[1120/540] w-full outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-gold)]/75 md:max-w-[400px]"
                      >
                        <Image
                          src={p.imagem}
                          alt={p.nome}
                          fill
                          className="object-contain object-center"
                          sizes="(max-width: 767px) 100vw, (max-width: 1152px) 33vw, 400px"
                        />
                      </a>
                    ) : (
                      <span className="relative block aspect-[1120/540] w-full md:max-w-[400px]">
                        <Image
                          src={p.imagem}
                          alt={p.nome}
                          fill
                          className="object-contain object-center"
                          sizes="(max-width: 767px) 100vw, (max-width: 1152px) 33vw, 400px"
                        />
                      </span>
                    )
                  ) : p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#d4d4d8] underline-offset-4 transition-colors hover:text-[var(--brand-gold)] hover:underline"
                    >
                      {p.nome}
                    </a>
                  ) : (
                    <span className="text-sm text-[#a1a1aa]">{p.nome}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.1)] pt-6 text-xs text-[#71717a]">
          <p>
            © {year} {sobreConfig.empresa.nome}
          </p>
          <Link
            href="/admin/login"
            className="text-[#a1a1aa] transition-colors hover:text-[var(--brand-gold)]"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
