import type { Metadata } from "next";

import { fetchKursusSearch } from "@/lib/api/facilities";
import { searchMetadata } from "@/lib/seo/meta";
import { SearchResultsView } from "@/components/search/SearchResultsView";
import { isApiError } from "@/lib/api/error";

export const revalidate = 3600;

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q, page: pageRaw } = await searchParams;
  const query = (q ?? "").trim();
  const page = pageOf(pageRaw);
  return searchMetadata({
    category: "kursus",
    query,
    page,
    path: `/kursus/search?q=${encodeURIComponent(query)}`,
  });
}

export default async function KursusSearchPage({ searchParams }: Props) {
  const { q, page: pageRaw } = await searchParams;
  const query = (q ?? "").trim();
  const page = pageOf(pageRaw);

  const results = query
    ? await safe(() => fetchKursusSearch(query, page))
    : { data: [], meta: { current_page: 1, per_page: 50, total: 0, last_page: 1, noindex: true } };

  return (
    <SearchResultsView
      category="kursus"
      query={query}
      page={page}
      results={results}
    />
  );
}

function pageOf(raw: string | undefined): number {
  const n = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

async function safe<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (isApiError(e) && e.isNotFound) {
      return { data: [], meta: { total: 0, last_page: 1 } } as T;
    }
    throw e;
  }
}
