"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSiteImagePublicUrl } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";

type Item = {
  slug: string;
  title: string;
  summary: string | null;
  cover_image_path: string | null;
};

type Props = { items: Item[] };

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sai do `main` limitado e ocupa a largura da viewport. */
function FullBleed({ children }: { children: ReactNode }) {
  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-visible">
      {children}
    </div>
  );
}

const AUTOPLAY_MS = 6500;

export function FeaturedPodcastsCarousel({ items }: Props) {
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [autoplayHoverPause, setAutoplayHoverPause] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (n === 0) return;
      setIndex((i) => (i + dir + n) % n);
    },
    [n],
  );

  const goTo = useCallback(
    (i: number) => {
      if (i >= 0 && i < n) setIndex(i);
    },
    [n],
  );

  useEffect(() => {
    if (n === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, n]);

  useEffect(() => {
    if (n <= 1 || autoplayHoverPause) return;
    if (typeof window.matchMedia === "function") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;
    }

    const id = window.setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      go(1);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [n, go, index, autoplayHoverPause]);

  if (n === 0) {
    return (
      <FullBleed>
        <div className="border-b border-[#f4f4f5] bg-[#ffffff] px-4 py-16 text-center sm:px-6">
          <p className="mx-auto max-w-lg text-sm text-[#52525b]">
            Ainda não há podcasts em destaque. Publique conteúdo no painel admin.
          </p>
        </div>
      </FullBleed>
    );
  }

  const item = items[index];
  const img = getSiteImagePublicUrl(item.cover_image_path);

  return (
    <FullBleed>
      <section
        className="relative overflow-visible border-b border-[#f4f4f5] bg-[#ffffff]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Podcasts em destaque"
        onMouseEnter={() => setAutoplayHoverPause(true)}
        onMouseLeave={() => setAutoplayHoverPause(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          if (start == null) return;
          const end = e.changedTouches[0]?.clientX ?? start;
          const dx = end - start;
          if (dx > 48) go(-1);
          else if (dx < -48) go(1);
        }}
      >
        <div className="relative z-0 mx-auto max-w-6xl px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6 md:pb-14 md:pt-12">
          <div
            key={item.slug}
            className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[minmax(0,384px)_1fr] md:items-center md:gap-10 lg:gap-14"
          >
            <Link
              href={`/podcasts/${item.slug}`}
              className="relative mx-auto aspect-[384/480] w-full max-w-[min(100%,384px)] overflow-hidden rounded-xl border border-[var(--brand-gold)]/35 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] shadow-[0_6px_20px_rgba(228,228,231,0.85)] ring-1 ring-[var(--brand-gold)]/10 md:mx-0 md:max-w-[384px]"
              aria-label={`Capa: ${item.title}`}
            >
              {img ? (
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 384px"
                  priority={index === 0}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#e4e4e7] text-sm text-[#71717a]">
                  Sem imagem
                </div>
              )}
            </Link>

            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <h3 className="hidden text-balance text-2xl font-bold leading-tight tracking-tight text-[#18181b] md:block md:text-3xl lg:text-4xl lg:leading-tight">
                <Link
                  href={`/podcasts/${item.slug}`}
                  className="transition-colors hover:text-[var(--brand-gold)]"
                >
                  {item.title}
                </Link>
              </h3>
              {item.summary ? (
                <p className="hidden max-w-2xl text-pretty text-sm leading-relaxed text-[#52525b] md:mt-4 md:block md:text-base">
                  {item.summary}
                </p>
              ) : (
                <p className="hidden text-sm text-[#71717a] md:mt-4 md:block">Sem resumo para este episódio.</p>
              )}
              <div className="mt-0 flex flex-wrap items-center justify-center gap-3 sm:mt-6 sm:gap-4 md:mt-8 md:justify-start">
                <Link
                  href={`/podcasts/${item.slug}`}
                  className={cn(
                    "inline-flex min-h-[2.75rem] items-center justify-center rounded-full px-8 py-2.5 text-sm font-semibold text-[#ffffff]",
                    "bg-metallic-gold shadow-metallic-gold",
                    "border border-[var(--brand-gold-dark)]/50",
                    "transition hover:brightness-105 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-gold)]/70",
                  )}
                >
                  Leia mais
                </Link>
                <Link
                  href="/podcasts"
                  className={cn(
                    "inline-flex min-h-[2.75rem] items-center justify-center rounded-full border-2 border-[var(--brand-gold)] bg-[#ffffff] px-8 py-2.5 text-sm font-semibold text-[var(--brand-gold)]",
                    "transition hover:bg-[#fafafa] hover:border-[var(--brand-gold-dark)] hover:text-[var(--brand-gold-dark)]",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-gold)]/70",
                  )}
                >
                  Ver todos
                </Link>
              </div>
            </div>
          </div>

          <div
            className="mt-4 flex justify-center gap-2 md:mt-8"
            role="tablist"
            aria-label="Selecionar episódio"
          >
            {items.map((dot, i) => (
              <button
                key={`dot-${dot.slug}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Episódio ${i + 1} de ${n}`}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all",
                  i === index
                    ? "scale-110 bg-[var(--brand-gold)] shadow-[0_0_12px_rgba(224,190,77,0.55)]"
                    : "bg-[#d4d4d8] hover:bg-[#a1a1aa]",
                )}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="pointer-events-auto absolute top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e4e4e7] bg-[#ffffff] text-[#3f3f46] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:border-[var(--brand-gold)]/45 hover:text-[var(--brand-gold)] md:left-6 md:flex lg:left-8"
          aria-label="Episódio anterior"
          onClick={() => go(-1)}
        >
          <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
        <button
          type="button"
          className="pointer-events-auto absolute top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e4e4e7] bg-[#ffffff] text-[#3f3f46] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:border-[var(--brand-gold)]/45 hover:text-[var(--brand-gold)] md:right-6 md:flex lg:right-8"
          aria-label="Próximo episódio"
          onClick={() => go(1)}
        >
          <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
      </section>
    </FullBleed>
  );
}
