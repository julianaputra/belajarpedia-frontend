import { FacilityGrid } from "@/components/facility/FacilityCard";
import { Pagination } from "@/components/Pagination";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { absoluteUrl } from "@/lib/site/config";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { SearchRefineBar } from "@/components/search/SearchRefineBar";
import { SearchEmptyState } from "@/components/search/SearchEmptyState";
import { SearchPrompt } from "@/components/search/SearchPrompt";
import type { PaginatedFacilityCardList } from "@/lib/api/facilities";

type Category = "sekolah" | "universitas" | "kursus";

type Props = {
  category: Category;
  query: string;
  page: number;
  results: PaginatedFacilityCardList;
};

const CAT_LABEL: Record<Category, string> = {
  sekolah: "Sekolah",
  universitas: "Universitas",
  kursus: "Kursus",
};

const CAT_LABEL_LOWER: Record<Category, string> = {
  sekolah: "sekolah",
  universitas: "universitas",
  kursus: "kursus",
};

export function SearchResultsView({ category, query, page, results }: Props) {
  const data = results.data ?? [];
  const meta = results.meta;
  const total = meta?.total ?? data.length;
  const totalPages = meta?.last_page ?? 1;
  const basePath = `/${category}/search?q=${encodeURIComponent(query)}`;

  const breadcrumbs = buildBreadcrumbs([
    { name: CAT_LABEL[category], url: absoluteUrl(`/${category}`) },
    {
      name: query ? `Pencarian: "${query}"` : "Pencarian",
      url: absoluteUrl(
        `/${category}/search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
      ),
    },
  ]);

  const hasQuery = query.length > 0;
  const hasResults = hasQuery && data.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-5 py-5 sm:py-10 space-y-4 sm:space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <SearchRefineBar category={category} initialQuery={query} />

      {hasQuery ? (
        <>
          <header className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-4xl text-ink-700">
              Pencarian &ldquo;{query}&rdquo;
            </h1>
            <p className="text-sm sm:text-base text-muted">
              {total > 0
                ? `${total.toLocaleString("id-ID")} ${CAT_LABEL_LOWER[category]} ditemukan`
                : `Tidak ada ${CAT_LABEL_LOWER[category]} yang cocok.`}
            </p>
          </header>

          {hasResults ? (
            <>
              <FacilityGrid
                facilities={data}
                className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              />
              <Pagination
                basePath={basePath}
                currentPage={page}
                totalPages={totalPages}
                pageMode="query"
              />
            </>
          ) : (
            <SearchEmptyState category={category} query={query} />
          )}
        </>
      ) : (
        <SearchPrompt category={category} />
      )}
    </main>
  );
}
