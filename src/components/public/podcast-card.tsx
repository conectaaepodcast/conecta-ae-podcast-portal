import Image from "next/image";
import Link from "next/link";
import { getSiteImagePublicUrl } from "@/lib/supabase/storage";

type Card = {
  slug: string;
  title: string;
  summary: string | null;
  cover_image_path: string | null;
};

export function PodcastCard({
  item,
  hrefPrefix = "/podcasts",
}: {
  item: Card;
  hrefPrefix?: string;
}) {
  const img = getSiteImagePublicUrl(item.cover_image_path);

  return (
    <Link
      href={`${hrefPrefix}/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] bg-zinc-100">
        {img ? (
          <Image
            src={img}
            alt={item.title}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Sem imagem
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="line-clamp-2 text-base font-semibold text-zinc-900 group-hover:text-blue-800">
          {item.title}
        </h2>
        {item.summary ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-zinc-600">
            {item.summary}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
