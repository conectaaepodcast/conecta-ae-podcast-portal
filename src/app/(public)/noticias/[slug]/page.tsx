import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getNoticiaBySlug, getRelatedNoticias } from "@/lib/data/public-queries";
import { getSiteImagePublicUrl } from "@/lib/supabase/storage";
import { siteConfig } from "@/config/constants";
import { NoticiaCard } from "@/components/public/noticia-card";
import { buildArticleMetadata } from "@/lib/seo/article-metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await getNoticiaBySlug(slug);
  if (!data) {
    return { title: "Notícia" };
  }
  const cover = getSiteImagePublicUrl(data.cover_image_path);
  return buildArticleMetadata({
    title: data.title,
    description: data.summary ?? siteConfig.description,
    path: `/noticias/${slug}`,
    imageUrl: cover,
    publishedTime: data.published_at,
    modifiedTime: data.updated_at,
  });
}

export default async function NoticiaDetailPage({ params }: Props) {
  const { slug } = await params;
  const { data: noticia, error } = await getNoticiaBySlug(slug);

  if (error || !noticia) {
    notFound();
  }

  const related = await getRelatedNoticias(noticia.id, 12);
  const cover = getSiteImagePublicUrl(noticia.cover_image_path);

  return (
    <article>
      <div className="mb-6 text-sm">
        <Link href="/noticias" className="text-blue-700 hover:underline">
          ← Notícias
        </Link>
      </div>

      <header className="border-b border-zinc-100 pb-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100 lg:aspect-[4/3]">
            {cover ? (
              <Image
                src={cover}
                alt={noticia.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                Sem imagem
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {noticia.title}
            </h1>
            {noticia.summary ? (
              <p className="mt-4 text-lg text-zinc-600">{noticia.summary}</p>
            ) : null}
            {noticia.published_at ? (
              <p className="mt-4 text-sm text-zinc-500">
                {new Date(noticia.published_at).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      {noticia.content ? (
        <div className="mt-10 max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-zinc-800">
          {noticia.content}
        </div>
      ) : null}

      <section className="mt-16 border-t border-zinc-200 pt-12">
        <h2 className="text-xl font-bold text-zinc-900">Veja também</h2>
        <p className="mt-1 text-sm text-zinc-600">Últimas notícias publicadas.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <NoticiaCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </article>
  );
}
