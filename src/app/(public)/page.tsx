import Link from "next/link";
import type { Metadata } from "next";
import { FeaturedPodcastsCarousel } from "@/components/public/featured-podcasts-carousel";
import { NoticiaCard } from "@/components/public/noticia-card";
import { getFeaturedPodcasts, getLatestNoticias } from "@/lib/data/public-queries";
import { siteConfig } from "@/config/constants";
import { buildListMetadata } from "@/lib/seo/article-metadata";
import { getSiteUrl } from "@/lib/seo/site";

export const metadata: Metadata = buildListMetadata({
  title: "Início",
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const [featured, noticias] = await Promise.all([
    getFeaturedPodcasts(8),
    getLatestNoticias(6),
  ]);

  const siteUrl = getSiteUrl().toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl.replace(/\/$/, "")}/pesquisa?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Podcasts em destaque
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Deslize para ver mais — episódios em evidência.
            </p>
          </div>
          <Link
            href="/podcasts"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            Ver todos os podcasts
          </Link>
        </div>
        <FeaturedPodcastsCarousel items={featured} />
      </section>

      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
              Últimas notícias
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              As seis publicações mais recentes.
            </p>
          </div>
          <Link
            href="/noticias"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            Ver todas
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((n) => (
            <NoticiaCard key={n.id} item={n} />
          ))}
        </div>
        {noticias.length === 0 ? (
          <p className="text-sm text-zinc-500">Ainda não há notícias publicadas.</p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-zinc-900">Newsletter</h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-600">
          Em breve será possível se inscrever para receber atualizações por e-mail. Enquanto isso, siga-nos nas
          redes sociais no rodapé.
        </p>
        <div className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            disabled
            placeholder="o@seu.email"
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500"
          />
          <button
            type="button"
            disabled
            className="rounded-lg bg-zinc-300 px-4 py-2 text-sm font-medium text-zinc-500"
          >
            Em breve
          </button>
        </div>
      </section>
    </div>
  );
}
