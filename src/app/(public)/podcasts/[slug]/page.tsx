import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPodcastBySlug, getRelatedPodcasts } from "@/lib/data/public-queries";
import { getSiteImagePublicUrl } from "@/lib/supabase/storage";
import { getYoutubeEmbedId } from "@/lib/youtube";
import { siteConfig } from "@/config/constants";
import { PodcastCard } from "@/components/public/podcast-card";
import { LazyYoutubeEmbed } from "@/components/public/lazy-youtube-embed";
import { buildArticleMetadata } from "@/lib/seo/article-metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await getPodcastBySlug(slug);
  if (!data) {
    return { title: "Podcast" };
  }
  const cover = getSiteImagePublicUrl(data.cover_image_path);
  return buildArticleMetadata({
    title: data.title,
    description: data.summary ?? siteConfig.description,
    path: `/podcasts/${slug}`,
    imageUrl: cover,
    publishedTime: data.published_at,
    modifiedTime: data.updated_at,
  });
}

export default async function PodcastDetailPage({ params }: Props) {
  const { slug } = await params;
  const { data: podcast, error } = await getPodcastBySlug(slug);

  if (error || !podcast) {
    notFound();
  }

  const related = await getRelatedPodcasts(podcast.id, 12);
  const cover = getSiteImagePublicUrl(podcast.cover_image_path);
  const yt = getYoutubeEmbedId(podcast.youtube_video_id);

  return (
    <article>
      <div className="mb-6 text-sm">
        <Link href="/podcasts" className="text-[#1d4ed8] hover:underline">
          ← Podcasts
        </Link>
      </div>

      <header className="border-b border-[#f4f4f5] pb-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#f4f4f5] lg:aspect-[4/3]">
            {cover ? (
              <Image
                src={cover}
                alt={podcast.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[#a1a1aa]">
                Sem imagem
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#18181b] sm:text-4xl">
              {podcast.title}
            </h1>
            {podcast.summary ? (
              <p className="mt-4 text-lg text-[#52525b]">{podcast.summary}</p>
            ) : null}
            {podcast.published_at ? (
              <p className="mt-4 text-sm text-[#71717a]">
                {new Date(podcast.published_at).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      {podcast.content ? (
        <div className="mt-10 max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-[#27272a]">
          {podcast.content}
        </div>
      ) : null}

      {yt ? (
        <div className="mt-10 max-w-3xl">
          <h2 className="mb-3 text-lg font-semibold text-[#18181b]">Vídeo</h2>
          <LazyYoutubeEmbed videoId={yt} title={`Vídeo: ${podcast.title}`} />
        </div>
      ) : null}

      <section className="mt-16 border-t border-[#e4e4e7] pt-12">
        <h2 className="text-xl font-bold text-[#18181b]">Veja também</h2>
        <p className="mt-1 text-sm text-[#52525b]">Últimos podcasts publicados.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <PodcastCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </article>
  );
}
