import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { sobreConfig } from "@/config/sobre";
import { getEquipePublic } from "@/lib/data/public-queries";
import { getSiteImagePublicUrl } from "@/lib/supabase/storage";
import { buildListMetadata } from "@/lib/seo/article-metadata";
import { siteConfig } from "@/config/constants";

export const metadata: Metadata = buildListMetadata({
  title: "Sobre",
  description: `Conheça a equipe e a missão do ${siteConfig.name}.`,
  path: "/sobre",
});

export default async function SobrePage() {
  const equipe = await getEquipePublic();
  const officeSrc = process.env.NEXT_PUBLIC_OFFICE_IMAGE_URL?.trim();

  const diretores = equipe.filter((m) => m.cargo === "diretor");
  const jornalistas = equipe.filter((m) => m.cargo === "jornalista");

  return (
    <div className="space-y-14">
      <header>
        <h1 className="text-3xl font-bold text-[#18181b] sm:text-4xl">Sobre</h1>
        <p className="mt-2 text-sm text-[#52525b]">Institucional, equipe e contatos.</p>
      </header>

      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[#e4e4e7] to-[#d4d4d8]">
          {officeSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- URL arbitrária via env (sem remotePatterns fixos)
            <img
              src={officeSrc}
              alt="Escritório"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-[#52525b]">
              <p className="text-sm font-medium">Imagem do escritório</p>
              <p className="mt-2 max-w-xs text-xs">
                Configure{" "}
                <code className="rounded bg-[rgba(255,255,255,0.6)] px-1">
                  NEXT_PUBLIC_OFFICE_IMAGE_URL
                </code>{" "}
                no <code className="rounded bg-[rgba(255,255,255,0.6)] px-1">.env.local</code> (URL
                https de uma imagem).
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

      <section>
        <h2 className="text-xl font-bold text-[#18181b]">Empresa</h2>
        <div className="mt-4 rounded-2xl border border-[#e4e4e7] bg-[rgb(250_250_250_/_0.8)] p-6 text-sm text-[#27272a]">
          <p className="font-semibold text-[#18181b]">{sobreConfig.empresa.nome}</p>
          <p className="mt-2 leading-relaxed">{sobreConfig.empresa.descricao}</p>
          <p className="mt-3 text-[#52525b]">{sobreConfig.empresa.endereco}</p>
          <p className="mt-1">
            <a
              href={`mailto:${sobreConfig.empresa.email}`}
              className="text-[#1d4ed8] hover:underline"
            >
              {sobreConfig.empresa.email}
            </a>
          </p>
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
            className="mt-2 inline-block text-sm font-medium text-[#1d4ed8] hover:underline"
          >
            Instagram
          </Link>
        ) : null}
      </div>
    </div>
  );
}
