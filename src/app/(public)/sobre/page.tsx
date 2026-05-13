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
        <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Sobre</h1>
        <p className="mt-2 text-sm text-zinc-600">Institucional, equipe e contatos.</p>
      </header>

      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300">
          {officeSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- URL arbitrária via env (sem remotePatterns fixos)
            <img
              src={officeSrc}
              alt="Escritório"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-600">
              <p className="text-sm font-medium">Imagem do escritório</p>
              <p className="mt-2 max-w-xs text-xs">
                Configure{" "}
                <code className="rounded bg-white/60 px-1">
                  NEXT_PUBLIC_OFFICE_IMAGE_URL
                </code>{" "}
                no <code className="rounded bg-white/60 px-1">.env.local</code> (URL
                https de uma imagem).
              </p>
            </div>
          )}
        </div>
        <div className="space-y-4 text-zinc-700">
          {sobreConfig.textoInstitucional.map((p) => (
            <p key={p} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Empresa</h2>
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 text-sm text-zinc-800">
          <p className="font-semibold text-zinc-900">{sobreConfig.empresa.nome}</p>
          <p className="mt-2 leading-relaxed">{sobreConfig.empresa.descricao}</p>
          <p className="mt-3 text-zinc-600">{sobreConfig.empresa.endereco}</p>
          <p className="mt-1">
            <a
              href={`mailto:${sobreConfig.empresa.email}`}
              className="text-blue-700 hover:underline"
            >
              {sobreConfig.empresa.email}
            </a>
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900">Equipe</h2>
        <div className="mt-6 space-y-10">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
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
              <p className="mt-2 text-sm text-zinc-500">
                Nenhum membro cadastrado como diretor.
              </p>
            ) : null}
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
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
              <p className="mt-2 text-sm text-zinc-500">
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
    <div className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-100">
        {foto ? (
          <Image src={foto} alt="" fill className="object-cover" sizes="96px" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
            —
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-zinc-900">{member.nome}</p>
        {member.descricao ? (
          <p className="mt-1 text-sm leading-relaxed text-zinc-600">
            {member.descricao}
          </p>
        ) : null}
        {member.instagram_url ? (
          <Link
            href={member.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-blue-700 hover:underline"
          >
            Instagram
          </Link>
        ) : null}
      </div>
    </div>
  );
}
