import "server-only";

import { apiServerFetch } from "@/lib/api/server";
import type { components } from "@/types/api";
import type {
  KursusFilters,
  SekolahFilters,
  UniversitasFilters,
} from "@/lib/routing/url-parser";

export type FacilityCard = components["schemas"]["FacilityCard"];
export type PaginatedFacilityCardList =
  components["schemas"]["PaginatedFacilityCardList"];
export type SekolahDetail = components["schemas"]["SekolahDetail"];
export type UniversitasDetail = components["schemas"]["UniversitasDetail"];
export type KursusDetail = components["schemas"]["KursusDetail"];

const LIST_REVALIDATE_SECONDS = 3600; // 60-minute ISR per spec §1.1
const DETAIL_REVALIDATE_SECONDS = 3600;

function appendFilter(
  params: URLSearchParams,
  key: string,
  value: string | undefined,
): void {
  if (value !== undefined && value !== "") params.set(key, value);
}

export async function fetchSekolahList(
  filters: SekolahFilters,
  page: number,
): Promise<PaginatedFacilityCardList> {
  const params = new URLSearchParams();
  appendFilter(params, "provinsi", filters.provinsi);
  appendFilter(params, "kabkota", filters.kabkota);
  appendFilter(params, "kecamatan", filters.kecamatan);
  appendFilter(params, "school_type", filters.school_type);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return apiServerFetch<PaginatedFacilityCardList>(
    `/api/sekolah${query ? `?${query}` : ""}`,
    {
      revalidate: LIST_REVALIDATE_SECONDS,
      tags: ["facilities:sekolah"],
    },
  );
}

export async function fetchUniversitasList(
  filters: UniversitasFilters,
  page: number,
): Promise<PaginatedFacilityCardList> {
  const params = new URLSearchParams();
  appendFilter(params, "provinsi", filters.provinsi);
  appendFilter(params, "kabkota", filters.kabkota);
  appendFilter(params, "kecamatan", filters.kecamatan);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return apiServerFetch<PaginatedFacilityCardList>(
    `/api/universitas${query ? `?${query}` : ""}`,
    {
      revalidate: LIST_REVALIDATE_SECONDS,
      tags: ["facilities:universitas"],
    },
  );
}

export async function fetchSekolahDetail(args: {
  provinsi: string;
  kabkota: string;
  kecamatan: string;
  school_type: string;
  slug: string;
}): Promise<SekolahDetail> {
  return apiServerFetch<SekolahDetail>(
    `/api/sekolah/${args.provinsi}/${args.kabkota}/${args.kecamatan}/${args.school_type}/${args.slug}`,
    {
      revalidate: DETAIL_REVALIDATE_SECONDS,
      tags: ["facilities:sekolah", `facility:sekolah:${args.slug}`],
    },
  );
}

export async function fetchUniversitasDetail(args: {
  provinsi: string;
  kabkota: string;
  kecamatan: string;
  slug: string;
}): Promise<UniversitasDetail> {
  return apiServerFetch<UniversitasDetail>(
    `/api/universitas/${args.provinsi}/${args.kabkota}/${args.kecamatan}/${args.slug}`,
    {
      revalidate: DETAIL_REVALIDATE_SECONDS,
      tags: ["facilities:universitas", `facility:universitas:${args.slug}`],
    },
  );
}

export async function fetchKursusDetail(args: {
  provinsi: string;
  kabkota: string;
  kecamatan: string;
  main_category: string;
  slug: string;
}): Promise<KursusDetail> {
  return apiServerFetch<KursusDetail>(
    `/api/kursus/${args.provinsi}/${args.kabkota}/${args.kecamatan}/${args.main_category}/${args.slug}`,
    {
      revalidate: DETAIL_REVALIDATE_SECONDS,
      tags: ["facilities:kursus", `facility:kursus:${args.slug}`],
    },
  );
}

export async function fetchSekolahSearch(
  q: string,
  page: number,
): Promise<PaginatedFacilityCardList> {
  const params = new URLSearchParams({ q });
  if (page > 1) params.set("page", String(page));
  return apiServerFetch<PaginatedFacilityCardList>(
    `/api/sekolah/search?${params.toString()}`,
    { revalidate: LIST_REVALIDATE_SECONDS, tags: ["facilities:sekolah"] },
  );
}

export async function fetchUniversitasSearch(
  q: string,
  page: number,
): Promise<PaginatedFacilityCardList> {
  const params = new URLSearchParams({ q });
  if (page > 1) params.set("page", String(page));
  return apiServerFetch<PaginatedFacilityCardList>(
    `/api/universitas/search?${params.toString()}`,
    { revalidate: LIST_REVALIDATE_SECONDS, tags: ["facilities:universitas"] },
  );
}

export async function fetchKursusSearch(
  q: string,
  page: number,
): Promise<PaginatedFacilityCardList> {
  const params = new URLSearchParams({ q });
  if (page > 1) params.set("page", String(page));
  return apiServerFetch<PaginatedFacilityCardList>(
    `/api/kursus/search?${params.toString()}`,
    { revalidate: LIST_REVALIDATE_SECONDS, tags: ["facilities:kursus"] },
  );
}

export async function fetchKursusList(
  filters: KursusFilters,
  page: number,
): Promise<PaginatedFacilityCardList> {
  const params = new URLSearchParams();
  appendFilter(params, "provinsi", filters.provinsi);
  appendFilter(params, "kabkota", filters.kabkota);
  appendFilter(params, "kecamatan", filters.kecamatan);
  appendFilter(params, "category", filters.main_category);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return apiServerFetch<PaginatedFacilityCardList>(
    `/api/kursus${query ? `?${query}` : ""}`,
    {
      revalidate: LIST_REVALIDATE_SECONDS,
      tags: ["facilities:kursus"],
    },
  );
}
