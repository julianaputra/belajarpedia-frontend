import Link from "next/link";

import { FacilityGrid } from "@/components/facility/FacilityCard";
import { Pagination } from "@/components/Pagination";
import type { PaginatedFacilityCardList } from "@/lib/api/facilities";

type Props = {
  category: "sekolah" | "universitas" | "kursus";
  query: string;
  page: number;
  results: PaginatedFacilityCardList;
};

const CAT_LABEL = {
  sekolah: "Sekolah",
  universitas: "Universitas",
  kursus: "Kursus",
} as const;

export function SearchResultsView({ category, query, page, results }: Props) {
  const data = results.data ?? [];
  const meta = results.meta;
  const total = meta?.total ?? data.length;
  const totalPages = meta?.last_page ?? 1;
  const basePath = `/${category}/search?q=${encodeURIComponent(query)}`;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-muted">
          Hasil pencarian di {CAT_LABEL[category]}
        </p>
        <h1 className="text-3xl sm:text-4xl text-ink-700">
          “{query}”
        </h1>
        <p className="text-muted">
          {total > 0
            ? `${total.toLocaleString("id-ID")} hasil ditemukan`
            : "Tidak ada hasil yang cocok."}
        </p>
      </header>

      {data.length > 0 ? (
        <>
          <FacilityGrid facilities={data} />
          {/* Pagination uses query-string for search per OpenAPI conventions. */}
          <Pagination
            basePath={basePath}
            currentPage={page}
            totalPages={totalPages}
          />
        </>
      ) : (
        <div className="rounded-[var(--radius-lg)] bg-white border-2 border-dashed border-ink-200 p-10 text-center space-y-3">
          <p className="text-lg font-semibold text-ink-700">
            Tidak ada {CAT_LABEL[category].toLowerCase()} yang cocok
          </p>
          <p className="text-muted">
            Coba kata kunci yang berbeda atau jelajahi daftar lengkap.
          </p>
          <Link
            href={`/${category}`}
            className="inline-block text-brand-700 hover:underline font-semibold"
          >
            Lihat semua {CAT_LABEL[category].toLowerCase()} →
          </Link>
        </div>
      )}
    </main>
  );
}
