import type { Metadata } from "next";
import { PodcastCard } from "@/components/public/podcast-card";
import { PublicBreadcrumb } from "@/components/public/public-breadcrumb";
import { PaginationBar } from "@/components/public/pagination-bar";
import { getPodcastsPage } from "@/lib/data/public-queries";
import { buildListMetadata } from "@/lib/seo/article-metadata";
import { siteConfig } from "@/config/constants";

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  return buildListMetadata({
    title: "Podcasts",
    description: `Todos os podcasts — ${siteConfig.name}.`,
    path: "/podcasts",
    searchParams: { page: sp.page, q: sp.q },
  });
}

export default async function PodcastsListPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const q = sp.q ?? "";
  const { rows, total, pageSize, error } = await getPodcastsPage(page, q);

  return (
    <div>
      <PublicBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Podcasts" }]}
      />
      <h1 className="text-2xl font-bold text-[#18181b] sm:text-3xl">Podcasts</h1>
      <p className="mt-1 text-sm text-[#52525b]">Do mais recente ao mais antigo.</p>

      <form
        method="get"
        className="mt-6 flex max-w-lg flex-col gap-2 sm:flex-row sm:items-center"
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Pesquisar por título ou texto…"
          className="flex-1 rounded-lg border border-[#d4d4d8] px-3 py-2 text-sm text-[#18181b]"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#18181b] px-4 py-2 text-sm font-medium text-[#ffffff] hover:bg-[#27272a]"
        >
          Pesquisar
        </button>
      </form>

      {error ? (
        <p className="mt-6 text-sm text-[#dc2626]" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((item) => (
          <PodcastCard key={item.id} item={item} />
        ))}
      </div>

      {rows.length === 0 && !error ? (
        <p className="mt-8 text-center text-sm text-[#71717a]">Nenhum resultado.</p>
      ) : null}

      <PaginationBar
        path="/podcasts"
        page={page}
        total={total}
        pageSize={pageSize}
        query={q}
      />
    </div>
  );
}
