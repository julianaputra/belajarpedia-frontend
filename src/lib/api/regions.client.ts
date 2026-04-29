import "client-only";

import { apiClientFetch } from "@/lib/api/client";
import type { components } from "@/types/api";

export type Province = components["schemas"]["Province"];
export type Kabkota = components["schemas"]["Kabkota"];
export type Kecamatan = components["schemas"]["Kecamatan"];
export type KursusCategory = components["schemas"]["KursusCategory"];

export async function fetchProvinces(): Promise<Province[]> {
  return apiClientFetch<Province[]>("/api/regions/provinces");
}

export async function fetchKabkotas(provinciaSlug: string): Promise<Kabkota[]> {
  return apiClientFetch<Kabkota[]>(
    `/api/regions/kabkota?provinsi_slug=${encodeURIComponent(provinciaSlug)}`,
  );
}

export async function fetchKecamatans(kabkotaSlug: string): Promise<Kecamatan[]> {
  return apiClientFetch<Kecamatan[]>(
    `/api/regions/kecamatan?kabkota_slug=${encodeURIComponent(kabkotaSlug)}`,
  );
}

export async function fetchKursusCategories(): Promise<KursusCategory[]> {
  return apiClientFetch<KursusCategory[]>("/api/kursus-categories");
}
