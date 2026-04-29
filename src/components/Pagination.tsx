import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  /** Base path WITHOUT trailing /page/{n}. e.g. "/sekolah/bali/kab-badung". */
  basePath: string;
  currentPage: number;
  totalPages: number;
  className?: string;
};

/**
 * Path-segment pagination per Decision §6.4: `/page/{n}` for n >= 2.
 * Page 1 has no suffix.
 *
 * Layout: « Prev   1 ... 4 [5] 6 ... 12   Next »
 *
 * Disabled at edges. Numbered window of 5; ellipsis when far from edge.
 * Uses anchor links so it works without JS — supports SEO crawling (AC-02).
 */
export function Pagination({
  basePath,
  currentPage,
  totalPages,
  className,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = computePageWindow(currentPage, totalPages);

  return (
    <nav
      aria-label="Halaman"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      <PageLink
        basePath={basePath}
        page={currentPage - 1}
        disabled={currentPage <= 1}
        rel="prev"
        aria-label="Halaman sebelumnya"
      >
        ‹ Sebelumnya
      </PageLink>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-muted select-none"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <PageLink
            key={p}
            basePath={basePath}
            page={p}
            active={p === currentPage}
            aria-label={`Halaman ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </PageLink>
        ),
      )}

      <PageLink
        basePath={basePath}
        page={currentPage + 1}
        disabled={currentPage >= totalPages}
        rel="next"
        aria-label="Halaman berikutnya"
      >
        Berikutnya ›
      </PageLink>
    </nav>
  );
}

type PageLinkProps = {
  basePath: string;
  page: number;
  disabled?: boolean;
  active?: boolean;
  rel?: "prev" | "next";
  children: React.ReactNode;
  "aria-label"?: string;
  "aria-current"?: "page";
};

function PageLink({
  basePath,
  page,
  disabled,
  active,
  children,
  ...rest
}: PageLinkProps) {
  const className = cn(
    "min-w-[2.5rem] h-10 px-3 inline-flex items-center justify-center",
    "rounded-[var(--radius)] font-semibold text-sm",
    "transition-[transform,background-color,box-shadow] duration-150 ease-[var(--ease-pop)]",
    active
      ? "bg-brand-500 text-white shadow-[0_3px_0_0_var(--color-brand-700)]"
      : "bg-white text-ink-700 border-2 border-ink-100 hover:border-brand-300 hover:text-brand-700 hover:-translate-y-0.5",
    disabled && "opacity-40 cursor-not-allowed pointer-events-none",
  );

  if (disabled || active) {
    return (
      <span className={className} aria-disabled={disabled || undefined} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={pageHref(basePath, page)}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}

function pageHref(basePath: string, page: number): string {
  return page > 1 ? `${basePath}/page/${page}` : basePath;
}

/**
 * Compute the numbered page window. Returns mix of numbers and "…" markers.
 *
 * Rules:
 *   - Always show 1 and totalPages.
 *   - Always show currentPage and its neighbors.
 *   - Ellipsis fills gaps.
 */
function computePageWindow(
  current: number,
  total: number,
): Array<number | "…"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const window = new Set<number>([1, total, current - 1, current, current + 1]);
  if (current <= 3) window.add(2).add(3);
  if (current >= total - 2) window.add(total - 1).add(total - 2);

  const sorted = [...window]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const out: Array<number | "…"> = [];
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i]!;
    if (i > 0 && n - sorted[i - 1]! > 1) out.push("…");
    out.push(n);
  }
  return out;
}
