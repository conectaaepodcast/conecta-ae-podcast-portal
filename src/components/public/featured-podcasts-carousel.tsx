import Image from "next/image";
import Link from "next/link";
import { getSiteImagePublicUrl } from "@/lib/supabase/storage";

type Item = {
  slug: string;
  title: string;
  summary: string | null;
  cover_image_path: string | null;
};

export function FeaturedPodcastsCarousel({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600">
        Ainda não há podcasts em destaque. Publique conteúdo no painel admin.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => {
          const img = getSiteImagePublicUrl(item.cover_image_path);
          return (
            <article
              key={item.slug}
              className="w-[min(100%,22rem)] shrink-0 snap-center sm:w-[26rem]"
            >
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <Link href={`/podcasts/${item.slug}`} className="block">
                  <div className="relative aspect-[16/9] bg-zinc-100">
                    {img ? (
                      <Image
                        src={img}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="400px"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        Sem imagem
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold leading-snug text-zinc-900 hover:text-blue-800">
                      {item.title}
                    </h3>
                    {item.summary ? (
                      <p className="mt-2 line-clamp-3 text-sm text-zinc-600">
                        {item.summary}
                      </p>
                    ) : null}
                    <span className="mt-4 inline-flex text-sm font-medium text-blue-700">
                      Leia mais →
                    </span>
                  </div>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
