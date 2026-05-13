import type { Metadata } from "next";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/site";
import { siteConfig } from "@/config/constants";

export function buildArticleMetadata(input: {
  title: string;
  description: string;
  path: string;
  imageUrl?: string | null;
  publishedTime?: string | null;
  modifiedTime?: string | null;
}): Metadata {
  const canonical = absoluteUrl(input.path);
  const ogImages = input.imageUrl
    ? [{ url: input.imageUrl, width: 1200, height: 630, alt: input.title }]
    : undefined;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    authors: [{ name: siteConfig.name, url: getSiteUrl().toString() }],
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: siteConfig.name,
      url: canonical,
      title: input.title,
      description: input.description,
      images: ogImages,
      publishedTime: input.publishedTime ?? undefined,
      modifiedTime: input.modifiedTime ?? undefined,
    },
    twitter: {
      card: input.imageUrl ? "summary_large_image" : "summary",
      title: input.title,
      description: input.description,
      images: input.imageUrl ? [input.imageUrl] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export function buildListMetadata(input: {
  title: string;
  description: string;
  path: string;
  searchParams?: Record<string, string | undefined>;
}): Metadata {
  const u = new URL(input.path, getSiteUrl());
  if (input.searchParams) {
    for (const [k, v] of Object.entries(input.searchParams)) {
      if (v === undefined || v === "") {
        continue;
      }
      if (k === "page" && (v === "1" || v === "0")) {
        continue;
      }
      u.searchParams.set(k, v);
    }
  }
  const canonical = u.toString();
  const fullTitle = `${input.title} | ${siteConfig.name}`;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: siteConfig.name,
      url: canonical,
      title: fullTitle,
      description: input.description,
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description: input.description,
    },
    robots: { index: true, follow: true },
  };
}
