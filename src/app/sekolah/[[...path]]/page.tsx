import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { parseSekolahPath, type SekolahFilters } from "@/lib/routing/url-parser";
import {
  sekolahDetailPath,
  sekolahListPath,
} from "@/lib/routing/url-builder";
import { humanize } from "@/lib/routing/humanize";
import {
  fetchSekolahDetail,
  fetchSekolahList,
} from "@/lib/api/facilities";
import {
  detailMetadata,
  listMetadata,
  type ListMetaInput,
} from "@/lib/seo/meta";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  breadcrumbListJsonLd,
  facilityJsonLd,
} from "@/lib/seo/jsonld";
import { buildBreadcrumbs, type BreadcrumbItem } from "@/lib/seo/breadcrumbs";
import { absoluteUrl } from "@/lib/site/config";
import { isApiError } from "@/lib/api/error";
import { FacilityGrid } from "@/components/facility/FacilityCard";
import { Pagination } from "@/components/Pagination";
import { DetailHeader } from "@/components/facility/detail/Header";
import {
  AttributeRow,
  DetailSection,
} from "@/components/facility/detail/Section";
import { ContactBlock } from "@/components/facility/detail/ContactBlock";
import { MapEmbed } from "@/components/facility/detail/MapEmbed";
import { LastVerified } from "@/components/facility/detail/LastVerified";
import { GoneNotice } from "@/components/facility/detail/GoneNotice";
import { FavoriteButton } from "@/components/facility/engagement/FavoriteButton";
import { InquiryForm } from "@/components/facility/engagement/InquiryForm";
import { ReviewWidget } from "@/components/facility/engagement/ReviewWidget";
import type { components } from "@/types/api";

export const revalidate = 3600;

type Props = {
  params: Promise<{ path?: string[] }>;
};

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const route = parseSekolahPath(path);

  if (route.kind === "list") {
    const total = await safeListTotal(() =>
      fetchSekolahList(route.filters, route.page),
    );
    return listMetadata(toMetaInput(route.filters, route.page, total === 0));
  }

  if (route.kind === "detail") {
    try {
      const detail = await fetchSekolahDetail({
        provinsi: route.filters.provinsi,
        kabkota: route.filters.kabkota,
        kecamatan: route.filters.kecamatan,
        school_type: route.filters.school_type,
        slug: route.slug,
      });
      return detailMetadata({
        category: "sekolah",
        name: detail.name ?? route.slug,
        description: detail.description ?? null,
        imageUrl: detail.image_main_url ?? null,
        kabkota: detail.kabkota?.name
          ? { name: detail.kabkota.name }
          : undefined,
        provinsi: detail.province?.name
          ? { name: detail.province.name }
          : undefined,
        path: sekolahDetailPath(route.filters, route.slug),
      });
    } catch {
      return { title: "Sekolah", robots: { index: false, follow: false } };
    }
  }

  return {};
}

// =============================================================================
// Page entry
// =============================================================================

export default async function SekolahCatchAllPage({ params }: Props) {
  const { path } = await params;
  const route = parseSekolahPath(path);

  if (route.kind === "invalid") notFound();
  if (route.kind === "list") return renderList(route.filters, route.page);
  return renderDetail(route.filters, route.slug);
}

// =============================================================================
// LIST view
// =============================================================================

async function renderList(filters: SekolahFilters, page: number) {
  const result = await fetchSekolahList(filters, page);
  const facilities = result.data ?? [];
  const meta = result.meta;
  const totalPages = meta?.last_page ?? 1;
  const total = meta?.total ?? facilities.length;

  if (page > 1 && page > totalPages) notFound();

  const basePath = sekolahListPath(filters, 1);
  const breadcrumbs = buildBreadcrumbs(sekolahListBreadcrumbs(filters));
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
            currentPage={page}
            totalPages={totalPages}
          />
        </>
      ) : (
        <ListEmpty />
      )}
    </main>
  );
}

function ListEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 p-10 text-center">
      <p className="text-lg font-semibold text-ink-700 mb-2">
        Tidak ada sekolah ditemukan
      </p>
      <p className="text-muted">
        Coba persempit area pencarian atau pilih wilayah lain.
      </p>
    </div>
  );
}

// =============================================================================
// DETAIL view
// =============================================================================

async function renderDetail(
  filters: Required<SekolahFilters>,
  slug: string,
) {
  let detail: components["schemas"]["SekolahDetail"];
  try {
    detail = await fetchSekolahDetail({
      provinsi: filters.provinsi,
      kabkota: filters.kabkota,
      kecamatan: filters.kecamatan,
      school_type: filters.school_type,
      slug,
    });
  } catch (e) {
    if (isApiError(e) && e.isGone) {
      return (
        <GoneNotice
          category="sekolah"
          parentHref={sekolahListPath({
            provinsi: filters.provinsi,
            kabkota: filters.kabkota,
            kecamatan: filters.kecamatan,
            school_type: filters.school_type,
          })}
        />
      );
    }
    if (isApiError(e) && e.isNotFound) notFound();
    throw e;
  }

  if (detail.status === "removed") {
    return (
      <GoneNotice
        category="sekolah"
        parentHref={sekolahListPath({
          provinsi: filters.provinsi,
          kabkota: filters.kabkota,
          kecamatan: filters.kecamatan,
          school_type: filters.school_type,
        })}
      />
    );
  }

  const breadcrumbs = buildBreadcrumbs(
    sekolahDetailBreadcrumbs(filters, slug, detail.name ?? slug),
  );

  const subtitle = [
    schoolTypeLabel(filters.school_type),
    detail.kabkota?.name,
    detail.province?.name,
  ]
    .filter(Boolean)
    .join(" • ");

  const facilityUrl = absoluteUrl(sekolahDetailPath(filters, slug));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 space-y-8">
      <JsonLd data={breadcrumbListJsonLd(breadcrumbs)} id="ld-breadcrumbs" />
      <JsonLd
        data={facilityJsonLd({
          category: "sekolah",
          name: detail.name ?? slug,
          url: facilityUrl,
          description: detail.description ?? null,
          imageUrl: detail.image_main_url ?? null,
          address: detail.address ?? null,
          region: {
            kabkota: detail.kabkota?.name,
            provinsi: detail.province?.name,
          },
          email: detail.email ?? null,
          phone: detail.phone ?? null,
          website: detail.website ?? null,
          latitude: detail.latitude ?? null,
          longitude: detail.longitude ?? null,
        })}
        id="ld-facility"
      />

      <Breadcrumbs items={breadcrumbs} />

      <DetailHeader facility={detail} subtitle={subtitle} />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-6">
          {detail.description && (
            <section className="rounded-2xl bg-white border border-ink-100 p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-ink-700 mb-3">
                Tentang {detail.name}
              </h2>
              <p className="text-body whitespace-pre-line">{detail.description}</p>
            </section>
          )}

          <DetailSection title="Profil Sekolah">
            <AttributeRow label="Akreditasi" value={detail.accreditation} />
            <AttributeRow label="Kurikulum" value={detail.curriculum} />
            <AttributeRow
              label="Jenis"
              value={schoolTypeLabel(filters.school_type)}
            />
          </DetailSection>

          <DetailSection title="Biaya & Operasional">
            <AttributeRow label="Biaya" value={detail.biaya} />
            <AttributeRow label="Jam Sekolah" value={detail.jam_sekolah} />
          </DetailSection>

          <DetailSection title="Fasilitas">
            <AttributeRow label="Fasilitas" value={detail.fasilitas} />
          </DetailSection>

          <ContactBlock facility={detail} />

          <MapEmbed
            latitude={detail.latitude}
            longitude={detail.longitude}
            name={detail.name ?? slug}
          />

          {detail.email && detail.id !== undefined && (
            <InquiryForm facilityId={detail.id} facilityName={detail.name ?? slug} />
          )}

          <LastVerified
            date={detail.last_verified_at ?? null}
            facilityPath={sekolahDetailPath(filters, slug)}
          />
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {detail.id !== undefined && (
            <div className="rounded-2xl bg-white border border-ink-100 p-5 space-y-4">
              <FavoriteButton facilityId={detail.id} />
              <div className="border-t border-ink-100 pt-4">
                <ReviewWidget facilityId={detail.id} />
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

// =============================================================================
// Helpers
// =============================================================================

async function safeListTotal(
  fetcher: () => Promise<{ meta?: { total?: number } }>,
): Promise<number> {
  try {
    const r = await fetcher();
    return r.meta?.total ?? 0;
  } catch (e) {
    if (isApiError(e) && e.isNotFound) return 0;
    return 1;
  }
}

function schoolTypeLabel(t: string | undefined): string {
  if (t === "international") return "Internasional";
  if (t === "negeri") return "Negeri";
  if (t === "swasta") return "Swasta";
  return t ?? "";
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
    prefix = `Sekolah ${schoolTypeLabel(filters.school_type)}`;
  }
  return region ? `${prefix} di ${region}` : `${prefix} di Indonesia`;
}

function sekolahListBreadcrumbs(filters: SekolahFilters): BreadcrumbItem[] {
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
    items.push({
      name: schoolTypeLabel(filters.school_type),
      url: absoluteUrl(sekolahListPath(filters)),
    });
  }
  return items;
}

function sekolahDetailBreadcrumbs(
  filters: Required<SekolahFilters>,
  slug: string,
  facilityName: string,
): BreadcrumbItem[] {
  const list = sekolahListBreadcrumbs(filters);
  list.push({
    name: facilityName,
    url: absoluteUrl(sekolahDetailPath(filters, slug)),
  });
  return list;
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
