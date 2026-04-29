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

const LIST_REVALIDATE_SECONDS = 3600; // 60-minute ISR per spec §1.1

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
