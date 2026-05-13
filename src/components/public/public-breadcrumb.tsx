import Link from "next/link";

export type PublicBreadcrumbItem = { label: string; href?: string };

type Props = { items: PublicBreadcrumbItem[] };

const MOBILE_TITLE_MAX_CHARS = 25;

function mobileBreadcrumbTitle(label: string): string {
  if (label.length <= MOBILE_TITLE_MAX_CHARS) {
    return label;
  }
  return `${label.slice(0, MOBILE_TITLE_MAX_CHARS)}...`;
}

/**
 * Trilha simples (ex.: Home / Podcasts / Título), estilo discreto alinhado à marca.
 */
export function PublicBreadcrumb({ items }: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Trilha de navegação" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${index}-${item.label}`} className="flex min-w-0 max-w-full items-center gap-1.5">
              {index > 0 ? (
                <span aria-hidden className="shrink-0 select-none text-[#d4d4d8]">
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="shrink-0 text-[#52525b] transition-colors hover:text-[#E0BE4D]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "min-w-0 font-medium text-[#18181b]"
                      : "shrink-0 text-[#52525b]"
                  }
                  aria-current={isLast ? "page" : undefined}
                  title={isLast && item.label.length > MOBILE_TITLE_MAX_CHARS ? item.label : undefined}
                >
                  {isLast ? (
                    <>
                      <span className="md:hidden">{mobileBreadcrumbTitle(item.label)}</span>
                      <span className="max-md:hidden md:block min-w-0 break-words">{item.label}</span>
                    </>
                  ) : (
                    item.label
                  )}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
