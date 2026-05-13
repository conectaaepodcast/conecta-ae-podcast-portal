import type { Metadata } from "next";
import { PodcastCard } from "@/components/public/podcast-card";
import { NoticiaCard } from "@/components/public/noticia-card";
import { globalSearch, type SearchKind } from "@/lib/data/public-queries";
import { buildListMetadata } from "@/lib/seo/article-metadata";
import { siteConfig } from "@/config/constants";

type Props = {
  searchParams: Promise<{ q?: string; tipo?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const title = q ? `Busca: ${q}` : "Pesquisar";
  return buildListMetadata({
    title,
    description: `Busque podcasts e notícias no ${siteConfig.name}.`,
    path: "/pesquisa",
    searchParams: { q: sp.q, tipo: sp.tipo },
  });
}

function parseTipo(raw: string | undefined): SearchKind {
  if (raw === "podcast") {
    return "podcast";
  }
  if (raw === "noticia") {
    return "noticia";
  }
  return "all";
}

export default async function PesquisaPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const tipo = parseTipo(sp.tipo);

  const results = q ? await globalSearch(q, tipo) : { podcasts: [], noticias: [] };

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Pesquisar</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Pesquisa global em podcasts e notícias (título, resumo e conteúdo).
      </p>

      <form
        method="get"
        className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="q" className="block text-sm font-medium text-zinc-700">
              Termo
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Ex.: entrevista, eleições…"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-zinc-700">
              Categoria
            </label>
            <select
              id="tipo"
              name="tipo"
              defaultValue={tipo}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:w-48"
            >
              <option value="all">Tudo (#Podcast + #Notícia)</option>
              <option value="podcast">#Podcast</option>
              <option value="noticia">#Notícia</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Pesquisar
          </button>
        </div>
      </form>

      {!q ? (
        <p className="mt-8 text-sm text-zinc-500">
          Escreva um termo e escolha a categoria.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {(tipo === "all" || tipo === "podcast") && (
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">
                <span className="text-blue-800">#Podcast</span>{" "}
                <span className="text-sm font-normal text-zinc-500">
                  ({results.podcasts.length})
                </span>
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.podcasts.map((item) => (
                  <PodcastCard key={item.id} item={item} />
                ))}
              </div>
              {results.podcasts.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-500">Nenhum podcast encontrado.</p>
              ) : null}
            </section>
          )}
          {(tipo === "all" || tipo === "noticia") && (
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">
                <span className="text-emerald-800">#Notícia</span>{" "}
                <span className="text-sm font-normal text-zinc-500">
                  ({results.noticias.length})
                </span>
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.noticias.map((item) => (
                  <NoticiaCard key={item.id} item={item} />
                ))}
              </div>
              {results.noticias.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-500">
                  Nenhuma notícia encontrada.
                </p>
              ) : null}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
