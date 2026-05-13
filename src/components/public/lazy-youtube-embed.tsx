"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  videoId: string;
  title: string;
};

export function LazyYoutubeEmbed({ videoId, title }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "180px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900 shadow-lg">
      {show ? (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-sm text-zinc-400">
          Carregando vídeo…
        </div>
      )}
    </div>
  );
}
