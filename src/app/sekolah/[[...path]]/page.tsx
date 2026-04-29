import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { parseSekolahPath, type SekolahFilters } from "@/lib/routing/url-parser";
import { sekolahListPath } from "@/lib/routing/url-builder";
import { humanize } from "@/lib/routing/humanize";
import { fetchSekolahList } from "@/lib/api/facilities";
import { listMetadata, type ListMetaInput } from "@/lib/seo/meta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { breadcrumbListJsonLd } from "@/lib/seo/jsonld";
import { buildBreadcrumbs, type BreadcrumbItem } from "@/lib/seo/breadcrumbs";
import { absoluteUrl } from "@/lib/site/config";
import { isApiError } from "@/lib/api/error";
import { FacilityGrid } from "@/components/facility/FacilityCard";
import { Pagination } from "@/components/Pagination";

export const revalidate = 3600;

type Props = {
  params: Promise<{ path?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const route = parseSekolahPath(path);
  if (route.kind !== "list") return {};

  const total = await safeListTotal(() =>
    fetchSekolahList(route.filters, route.page),
  );

  return listMetadata(toMetaInput(route.filters, route.page, total === 0));
}

export default async function SekolahCatchAllPage({ params }: Props) {
  const { path } = await params;
  const route = parseSekolahPath(path);

  if (route.kind === "invalid") notFound();
  // Phase 4 will handle the detail kind. Until then, return 404 so URLs that
  // happen to have 5 valid segments don't render an empty list.
  if (route.kind === "detail") notFound();

  const result = await fetchSekolahList(route.filters, route.page);
  const facilities = result.data ?? [];
  const meta = result.meta;
  const totalPages = meta?.last_page ?? 1;
  const total = meta?.total ?? facilities.length;

  if (route.page > 1 && route.page > totalPages) notFound();

  const filters = route.filters;
  const basePath = sekolahListPath(filters, 1);
  const breadcrumbItems = sekolahBreadcrumbs(filters);
  const breadcrumbs = buildBreadcrumbs(breadcrumbItems);
  const heading = sekolahHeading(filters);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 space-y-8">
      <JsonLd data={breadcrumbListJsonLd(breadcrumbs)} id="ld-breadcrumbs" />
      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl text-ink-700">{heading}</h1>
        <p className="text-muted">
          {total > 0
            ? `${total.toLocaleString("id-ID")} sekolah ditemukan`
            : "Belum ada sekolah yang terdaftar di area ini."}
        </p>
      </header>

      {facilities.length > 0 ? (
        <>
          <FacilityGrid facilities={facilities} />
          <Pagination
            basePath={basePath}
            currentPage={route.page}
            totalPages={totalPages}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-ink-200 p-10 text-center">
      <p className="text-lg font-semibold text-ink-700 mb-2">
        Tidak ada sekolah ditemukan
      </p>
      <p className="text-muted">
        Coba persempit area pencarian atau pilih wilayah lain.
      </p>
    </div>
  );
}

async function safeListTotal(
  fetcher: () => Promise<{ meta?: { total?: number } }>,
): Promise<number> {
  try {
    const r = await fetcher();
    return r.meta?.total ?? 0;
  } catch (e) {
    if (isApiError(e) && e.isNotFound) return 0;
    // Don't fail metadata generation on network blips — assume content exists.
    return 1;
  }
}

function sekolahHeading(filters: SekolahFilters): string {
  const region = [
    filters.kecamatan ? humanize(filters.kecamatan) : null,
    filters.kabkota ? humanize(filters.kabkota) : null,
    filters.provinsi ? humanize(filters.provinsi) : null,
  ]
    .filter(Boolean)
    .join(", ");

  let prefix = "Sekolah";
  if (filters.school_type) {
    const label =
      filters.school_type === "international"
        ? "Internasional"
        : humanize(filters.school_type);
    prefix = `Sekolah ${label}`;
  }
  return region ? `${prefix} di ${region}` : `${prefix} di Indonesia`;
}

function sekolahBreadcrumbs(filters: SekolahFilters): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: "Sekolah", url: absoluteUrl("/sekolah") },
  ];
  if (filters.provinsi) {
    items.push({
      name: humanize(filters.provinsi),
      url: absoluteUrl(sekolahListPath({ provinsi: filters.provinsi })),
    });
  }
  if (filters.provinsi && filters.kabkota) {
    items.push({
      name: humanize(filters.kabkota),
      url: absoluteUrl(
        sekolahListPath({
          provinsi: filters.provinsi,
          kabkota: filters.kabkota,
        }),
      ),
    });
  }
  if (filters.provinsi && filters.kabkota && filters.kecamatan) {
    items.push({
      name: humanize(filters.kecamatan),
      url: absoluteUrl(
        sekolahListPath({
          provinsi: filters.provinsi,
          kabkota: filters.kabkota,
          kecamatan: filters.kecamatan,
        }),
      ),
    });
  }
  if (
    filters.provinsi &&
    filters.kabkota &&
    filters.kecamatan &&
    filters.school_type
  ) {
    const label =
      filters.school_type === "international"
        ? "Internasional"
        : humanize(filters.school_type);
    items.push({
      name: label,
      url: absoluteUrl(sekolahListPath(filters)),
    });
  }
  return items;
}

function toMetaInput(
  filters: SekolahFilters,
  page: number,
  isZeroResult: boolean,
): ListMetaInput {
  return {
    category: "sekolah",
    provinsi: filters.provinsi
      ? { name: humanize(filters.provinsi), slug: filters.provinsi }
      : undefined,
    kabkota: filters.kabkota
      ? { name: humanize(filters.kabkota), slug: filters.kabkota }
      : undefined,
    kecamatan: filters.kecamatan
      ? { name: humanize(filters.kecamatan), slug: filters.kecamatan }
      : undefined,
    schoolType: filters.school_type,
    page,
    path: sekolahListPath(filters, page),
    isZeroResult,
  };
}
