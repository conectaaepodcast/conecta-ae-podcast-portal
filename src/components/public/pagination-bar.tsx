import Link from "next/link";

type Props = {
  path: string;
  page: number;
  total: number;
  pageSize: number;
  query?: string;
};

export function PaginationBar({ path, page, total, pageSize, query }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) {
    return null;
  }

  function href(p: number) {
    const sp = new URLSearchParams();
    if (p > 1) {
      sp.set("page", String(p));
    }
    if (query?.trim()) {
      sp.set("q", query.trim());
    }
    const qs = sp.toString();
    return qs ? `${path}?${qs}` : path;
  }

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="Paginação"
    >
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className="rounded-lg border border-[#d4d4d8] bg-[#ffffff] px-3 py-1.5 text-sm font-medium text-[#27272a] hover:bg-[#fafafa]"
        >
          Anterior
        </Link>
      ) : null}
      <span className="px-2 text-sm text-[#52525b]">
        Página {page} de {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          className="rounded-lg border border-[#d4d4d8] bg-[#ffffff] px-3 py-1.5 text-sm font-medium text-[#27272a] hover:bg-[#fafafa]"
        >
          Próximo
        </Link>
      ) : null}
    </nav>
  );
}
