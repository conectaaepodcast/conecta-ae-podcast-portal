import Image from "next/image";
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
  const participarPodcastAlt =
    "Deseja participar do podcast Conecta Aê? Clique em Quero participar e preencha o formulário de interesse.";
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

      <section className="space-y-4 mb-8 sm:mb-12">
        <FeaturedPodcastsCarousel items={featured} />
      </section>

      <section
        aria-label="Participar do podcast Conecta Aê"
        className="ml-[calc(50%-50vw)] w-screen max-w-[100vw] mb-8 sm:mb-12"
      >
        <div className="relative hidden aspect-[2000/400] w-full md:block">
          <Image
            src="/participarpodcastdesktop.png"
            alt={participarPodcastAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized
          />
        </div>
        <div className="relative aspect-[1000/1000] w-full md:hidden">
          <Image
            src="/participarpodcastmobile.png"
            alt={participarPodcastAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized
          />
        </div>
      </section>

      <section className="mb-8 sm:mb-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#18181b] sm:text-2xl">
              Últimas notícias
            </h2>
            <p className="mt-1 text-sm text-[#52525b]">
              As seis publicações mais recentes.
            </p>
          </div>
          <Link
            href="/noticias"
            className="text-sm font-medium text-[var(--brand-gold)] underline-offset-4 transition hover:text-[var(--brand-gold-dark)] hover:underline"
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
          <p className="text-sm text-[#71717a]">Ainda não há notícias publicadas.</p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-[#e4e4e7] bg-[rgb(250_250_250_/_0.8)] p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-[#18181b]">Newsletter</h2>
        <p className="mt-2 max-w-xl text-sm text-[#52525b]">
          Em breve será possível se inscrever para receber atualizações por e-mail. Enquanto isso, siga-nos nas
          redes sociais no rodapé.
        </p>
        <div className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            disabled
            placeholder="o@seu.email"
            className="flex-1 rounded-lg border border-[#e4e4e7] bg-[#ffffff] px-3 py-2 text-sm text-[#71717a]"
          />
          <button
            type="button"
            disabled
            className="rounded-lg bg-[#d4d4d8] px-4 py-2 text-sm font-medium text-[#71717a]"
          >
            Em breve
          </button>
        </div>
      </section>
    </div>
  );
}
