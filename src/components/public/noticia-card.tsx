import Image from "next/image";
import Link from "next/link";
import { getSiteImagePublicUrl } from "@/lib/supabase/storage";

type Card = {
  slug: string;
  title: string;
  summary: string | null;
  cover_image_path: string | null;
};

export function NoticiaCard({ item }: { item: Card }) {
  const img = getSiteImagePublicUrl(item.cover_image_path);

  return (
    <Link
      href={`/noticias/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#e4e4e7] bg-[#ffffff] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition hover:border-[#d4d4d8] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
    >
      <div className="relative aspect-[745/745] bg-[#f4f4f5]">
        {img ? (
          <Image
            src={img}
            alt={item.title}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#a1a1aa]">
            Sem imagem
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="line-clamp-2 text-base font-semibold text-[#18181b] group-hover:text-[#E0BE4D]">
          {item.title}
        </h2>
        {item.summary ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-[#52525b]">
            {item.summary}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
