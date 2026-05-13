"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/constants";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/podcasts", label: "Podcasts" },
  { href: "/noticias", label: "Notícias" },
  { href: "/sobre", label: "Sobre" },
  { href: "/pesquisa", label: "Pesquisar" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(active: boolean) {
  return cn(
    "rounded-lg px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200",
    active
      ? "bg-[rgba(255,255,255,0.1)] text-[var(--brand-gold)] shadow-[inset_0_0_0_1px_rgba(224,190,77,0.35)]"
      : "text-[#d4d4d8] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--brand-gold)]",
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const onPointerDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.1)] bg-[#000000] shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-[5.25rem] items-center justify-between gap-4 sm:h-[6rem]">
          <Link
            href="/"
            className="group relative flex shrink-0 items-center gap-2 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-gold)]/75"
            onClick={closeMenu}
          >
            <span className="relative h-14 w-[min(280px,64vw)] sm:h-16 md:h-18">
              <Image
                src="/logov2.png"
                alt=""
                fill
                className="object-contain object-left"
                sizes="(max-width: 640px) 64vw, 280px"
                priority
              />
            </span>
            <span className="sr-only">{siteConfig.name}</span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex md:gap-1" aria-label="Principal">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link key={item.href} href={item.href} className={navLinkClass(active)}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px] rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-[var(--brand-gold)] transition hover:border-[var(--brand-gold)]/35 hover:bg-[rgba(255,255,255,0.1)] md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span
              className={cn(
                "block h-0.5 w-5 rounded-full bg-[var(--brand-gold)] transition-transform duration-200 ease-out",
                menuOpen && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 rounded-full bg-[var(--brand-gold)] transition-opacity duration-200",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 rounded-full bg-[var(--brand-gold)] transition-transform duration-200 ease-out",
                menuOpen && "-translate-y-[7px] -rotate-45",
              )}
            />
          </button>
        </div>

        <div
          id="mobile-nav"
          className={cn(
            "absolute left-0 right-0 top-full z-50 overflow-hidden border-b border-[rgba(255,255,255,0.1)] bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-[max-height,opacity] duration-300 ease-out md:hidden",
            menuOpen
              ? "max-h-[min(75vh,26rem)] opacity-100"
              : "pointer-events-none max-h-0 opacity-0",
          )}
          aria-hidden={!menuOpen}
          aria-label="Menu mobile"
        >
          <nav className="flex flex-col gap-1 p-4 pt-2">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                    active
                      ? "bg-[var(--brand-gold)]/15 text-[var(--brand-gold)]"
                      : "text-[#e4e4e7] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#ffffff]",
                  )}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="border-t border-[rgba(255,255,255,0.1)] px-4 py-3 text-center text-[11px] leading-relaxed text-[#71717a]">
            Conexões · Histórias · Oportunidades
          </p>
        </div>
      </div>
    </header>
  );
}
