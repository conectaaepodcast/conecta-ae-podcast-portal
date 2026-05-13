"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { StaffRole } from "@/types/database";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";

type Props = { role: StaffRole; children: ReactNode };

export function AdminPanelChrome({ role, children }: Props) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileNav();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileNavOpen, closeMobileNav]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-[#ffffff] md:flex-row">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-[#e4e4e7] bg-[#ffffff] px-4 md:hidden">
        <span className="text-sm font-semibold text-[#18181b]">Admin</span>
        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#e4e4e7] bg-[#fafafa] text-[#18181b]"
          aria-expanded={mobileNavOpen}
          aria-controls="admin-nav-drawer"
          aria-label={mobileNavOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMobileNavOpen((o) => !o)}
        >
          <span
            className={cn(
              "block h-0.5 w-5 rounded-full bg-[#3f3f46] transition-transform duration-200",
              mobileNavOpen && "translate-y-[5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-5 rounded-full bg-[#3f3f46] transition-opacity duration-200",
              mobileNavOpen && "opacity-0",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-5 rounded-full bg-[#3f3f46] transition-transform duration-200",
              mobileNavOpen && "-translate-y-[5px] -rotate-45",
            )}
          />
        </button>
      </header>

      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[rgba(0,0,0,0.35)] md:hidden"
          aria-label="Fechar menu"
          onClick={closeMobileNav}
        />
      ) : null}

      <div
        id="admin-nav-drawer"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-56 max-w-[min(100%,18rem)] transition-transform duration-200 ease-out md:static md:z-0 md:max-w-none md:translate-x-0 md:transition-none",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <AdminSidebar role={role} onMobileDismiss={closeMobileNav} />
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-auto">{children}</div>
    </div>
  );
}
