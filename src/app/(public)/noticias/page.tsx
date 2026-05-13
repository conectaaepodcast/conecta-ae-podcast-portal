import type { Metadata } from "next";
import { NoticiaCard } from "@/components/public/noticia-card";
import { PaginationBar } from "@/components/public/pagination-bar";
import { getNoticiasPage } from "@/lib/data/public-queries";
import { buildListMetadata } from "@/lib/seo/article-metadata";
import { siteConfig } from "@/config/constants";

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  return buildListMetadata({
    title: "Notícias",
    description: `Todas as notícias — ${siteConfig.name}.`,
    path: "/noticias",
    searchParams: { page: sp.page, q: sp.q },
  });
}

export default async function NoticiasListPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const q = sp.q ?? "";
  const { rows, total, pageSize, error } = await getNoticiasPage(page, q);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Notícias</h1>
      <p className="mt-1 text-sm text-zinc-600">Do mais recente ao mais antigo.</p>

      <form
        method="get"
        className="mt-6 flex max-w-lg flex-col gap-2 sm:flex-row sm:items-center"
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Pesquisar por título ou texto…"
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Pesquisar
        </button>
      </form>

      {error ? (
        <p className="mt-6 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((item) => (
          <NoticiaCard key={item.id} item={item} />
        ))}
      </div>

      {rows.length === 0 && !error ? (
        <p className="mt-8 text-center text-sm text-zinc-500">Nenhum resultado.</p>
      ) : null}

      <PaginationBar
        path="/noticias"
        page={page}
        total={total}
        pageSize={pageSize}
        query={q}
      />
    </div>
  );
}
