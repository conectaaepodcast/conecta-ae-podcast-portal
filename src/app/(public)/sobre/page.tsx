import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { sobreConfig } from "@/config/sobre";
import { getEquipePublic, getSocialLinksPublic } from "@/lib/data/public-queries";
import { getSiteImagePublicUrl } from "@/lib/supabase/storage";
import { buildListMetadata } from "@/lib/seo/article-metadata";
import { siteConfig } from "@/config/constants";

export const metadata: Metadata = buildListMetadata({
  title: "Sobre",
  description: `Conheça a equipe e a missão do ${siteConfig.name}.`,
  path: "/sobre",
});

const platformLabel: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  other: "Web",
};

type EmpresaRedeLinha = {
  label: string;
  url: string;
  icon_path?: string | null;
};

export default async function SobrePage() {
  const [equipe, socialLinks] = await Promise.all([getEquipePublic(), getSocialLinksPublic()]);
  const officeSrc = sobreConfig.imagemEscritorio?.trim();

  const redesFromPainel: EmpresaRedeLinha[] = socialLinks.map((l) => ({
    label: l.label?.trim() || platformLabel[l.platform] || l.platform,
    url: l.url,
    icon_path: l.icon_path,
  }));
  const redes: EmpresaRedeLinha[] =
    sobreConfig.empresa.redesSociais && sobreConfig.empresa.redesSociais.length > 0
      ? sobreConfig.empresa.redesSociais.map((r) => ({
          label: r.label,
          url: r.url,
        }))
      : redesFromPainel;

  const diretores = equipe.filter((m) => m.cargo === "diretor");
  const jornalistas = equipe.filter((m) => m.cargo === "jornalista");

  return (
    <div className="space-y-14">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-[#18181b] sm:text-4xl">Sobre</h1>
        <p className="mt-2 text-sm text-[#52525b]">Institucional, equipe e contatos.</p>
      </header>

      <section className="grid gap-8 lg:grid-cols-2 lg:items-center mb-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f4f4f5]">
          {officeSrc ? (
            <Image
              src={officeSrc}
              alt="Escritório"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-[#52525b]">
              <p className="text-sm font-medium">Imagem do escritório</p>
              <p className="mt-2 max-w-xs text-xs">
                Em <code className="rounded bg-[rgba(255,255,255,0.6)] px-1">src/config/sobre.ts</code>{" "}
                defina <code className="rounded bg-[rgba(255,255,255,0.6)] px-1">imagemEscritorio</code>{" "}
                com o caminho em <code className="rounded bg-[rgba(255,255,255,0.6)] px-1">public/</code>{" "}
                (ex.: <code className="rounded bg-[rgba(255,255,255,0.6)] px-1">/escritorio.webp</code>) ou
                uma URL https pública.
              </p>
            </div>
          )}
        </div>
        <div className="space-y-4 text-[#3f3f46]">
          {sobreConfig.textoInstitucional.map((p) => (
            <p key={p} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#18181b]">Empresa</h2>
        <div className="mt-4 rounded-2xl border border-[#e4e4e7] bg-[#ffffff] p-6 text-sm text-[#3f3f46] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <p className="font-semibold text-[#18181b]">{sobreConfig.empresa.nome}</p>
          <p className="mt-2 leading-relaxed text-[#52525b]">{sobreConfig.empresa.descricao}</p>
          <p className="mt-3 text-[#71717a]">{sobreConfig.empresa.endereco}</p>
          <p className="mt-1">
            <a
              href={`mailto:${sobreConfig.empresa.email}`}
              className="font-medium text-[#3f3f46] underline-offset-4 transition-colors hover:text-[#18181b] hover:underline"
            >
              {sobreConfig.empresa.email}
            </a>
          </p>
          {redes.length > 0 ? (
            <>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#71717a]">
                Redes sociais
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {redes.map((r) => {
                  const iconUrl = getSiteImagePublicUrl(r.icon_path);
                  return (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-medium text-[#3f3f46] underline-offset-4 transition-colors hover:text-[#18181b] hover:underline"
                      >
                        {iconUrl ? (
                          <Image
                            src={iconUrl}
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6 shrink-0 object-contain"
                            sizes="24px"
                            unoptimized={(r.icon_path ?? "").toLowerCase().includes(".svg")}
                          />
                        ) : null}
                        <span>{r.label}</span>
                      </a>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="mt-5 text-sm text-[#71717a]">
                Nenhuma rede cadastrada. Adicione links em Admin → Redes (aparecem também no rodapé).
              </p>
            )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#18181b]">Equipe</h2>
        <div className="mt-6 space-y-10">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#71717a]">
              Direção
            </h3>
            <ul className="mt-4 grid gap-6 sm:grid-cols-2">
              {diretores.map((m) => (
                <li key={m.id}>
                  <TeamMemberCard member={m} />
                </li>
              ))}
            </ul>
            {diretores.length === 0 ? (
              <p className="mt-2 text-sm text-[#71717a]">
                Nenhum membro cadastrado como diretor.
              </p>
            ) : null}
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#71717a]">
              Jornalismo
            </h3>
            <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jornalistas.map((m) => (
                <li key={m.id}>
                  <TeamMemberCard member={m} />
                </li>
              ))}
            </ul>
            {jornalistas.length === 0 ? (
              <p className="mt-2 text-sm text-[#71717a]">
                Sem jornalistas na lista pública.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function TeamMemberCard({
  member,
}: {
  member: {
    nome: string;
    descricao: string | null;
    instagram_url: string | null;
    foto_path: string | null;
  };
}) {
  const foto = getSiteImagePublicUrl(member.foto_path);

  return (
    <div className="flex gap-4 rounded-xl border border-[#e4e4e7] bg-[#ffffff] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-[#f4f4f5]">
        {foto ? (
          <Image src={foto} alt="" fill className="object-cover" sizes="96px" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#a1a1aa]">
            —
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#18181b]">{member.nome}</p>
        {member.descricao ? (
          <p className="mt-1 text-sm leading-relaxed text-[#52525b]">
            {member.descricao}
          </p>
        ) : null}
        {member.instagram_url ? (
          <Link
            href={member.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-[#3f3f46] underline-offset-4 transition-colors hover:text-[#18181b] hover:underline"
          >
            Instagram
          </Link>
        ) : null}
      </div>
    </div>
  );
}
