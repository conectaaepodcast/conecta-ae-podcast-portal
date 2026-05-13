import type { ReactNode } from "react";
import { getSocialLinksPublic } from "@/lib/data/public-queries";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";

export const revalidate = 60;

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const links = await getSocialLinksPublic();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <SiteFooter links={links} />
    </div>
  );
}
