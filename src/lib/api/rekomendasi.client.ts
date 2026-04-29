import "client-only";

import { apiClientFetch } from "@/lib/api/client";
import type { components } from "@/types/api";

type FacilityCard = components["schemas"]["FacilityCard"];

/**
 * Rekomendasi endpoints. Per spec §1.1, these MUST bypass cache so each
 * page-load reshuffles the displayed picks. apiClientFetch by default uses
 * default cache; here we don't pass a cache hint — `fetch()` defaults to
 * "default" but the API can return Cache-Control: no-store. We rely on
 * Next.js client-side fetch behavior + SWR's revalidation to keep it fresh.
 */

export async function fetchSekolahRekomendasi(): Promise<FacilityCard[]> {
  return apiClientFetch<FacilityCard[]>("/api/home/rekomendasi/sekolah");
}

export async function fetchUniversitasRekomendasi(): Promise<FacilityCard[]> {
  return apiClientFetch<FacilityCard[]>("/api/home/rekomendasi/universitas");
}

export async function fetchKursusRekomendasi(): Promise<FacilityCard[]> {
  return apiClientFetch<FacilityCard[]>("/api/home/rekomendasi/kursus");
}
