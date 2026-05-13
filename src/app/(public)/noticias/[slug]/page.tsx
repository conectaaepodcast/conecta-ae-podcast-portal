import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNoticiaBySlug, getRelatedNoticias } from "@/lib/data/public-queries";
import { getSiteImagePublicUrl } from "@/lib/supabase/storage";
import { siteConfig } from "@/config/constants";
import { NoticiaCard } from "@/components/public/noticia-card";
import { PublicBreadcrumb } from "@/components/public/public-breadcrumb";
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

  const related = await getRelatedNoticias(noticia.id, 3);
  const cover = getSiteImagePublicUrl(noticia.cover_image_path);

  return (
    <article>
      <PublicBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Notícias", href: "/noticias" },
          { label: noticia.title },
        ]}
      />

      <header className="border-b border-[#f4f4f5] pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="relative aspect-[745/745] w-full shrink-0 overflow-hidden rounded-2xl bg-[#f4f4f5] lg:mx-0 lg:w-[384px] lg:max-w-none">
            {cover ? (
              <Image
                src={cover}
                alt={noticia.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width:1023px) 100vw, 384px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[#a1a1aa]">
                Sem imagem
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#18181b] sm:text-4xl">
              {noticia.title}
            </h1>
            {noticia.summary ? (
              <p className="mt-4 text-lg text-[#52525b]">{noticia.summary}</p>
            ) : null}
            {noticia.published_at ? (
              <p className="mt-4 text-sm text-[#71717a]">
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
        <div className="mt-10 max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-[#27272a]">
          {noticia.content}
        </div>
      ) : null}

      <section className="mt-16 border-t border-[#e4e4e7] pt-12">
        <h2 className="text-xl font-bold text-[#18181b]">Veja também</h2>
        <p className="mt-1 text-sm text-[#52525b]">Últimas notícias publicadas.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <NoticiaCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </article>
  );
}
