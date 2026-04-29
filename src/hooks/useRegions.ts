"use client";

import useSWR from "swr";
import {
  fetchKabkotas,
  fetchKecamatans,
  fetchKursusCategories,
  fetchProvinces,
} from "@/lib/api/regions.client";

const SWR_OPTS = {
  revalidateOnFocus: false,
  shouldRetryOnError: false,
  dedupingInterval: 60_000, // regions rarely change
};

export function useProvinces() {
  return useSWR("regions:provinces", fetchProvinces, SWR_OPTS);
}

export function useKabkotas(provinceSlug: string | null | undefined) {
  return useSWR(
    provinceSlug ? `regions:kabkotas:${provinceSlug}` : null,
    () => fetchKabkotas(provinceSlug!),
    SWR_OPTS,
  );
}

export function useKecamatans(kabkotaSlug: string | null | undefined) {
  return useSWR(
    kabkotaSlug ? `regions:kecamatans:${kabkotaSlug}` : null,
    () => fetchKecamatans(kabkotaSlug!),
    SWR_OPTS,
  );
}

export function useKursusCategories() {
  return useSWR("kursus-categories", fetchKursusCategories, SWR_OPTS);
}
