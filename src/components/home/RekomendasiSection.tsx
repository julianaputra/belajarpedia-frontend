"use client";

import * as React from "react";
import useSWR from "swr";

import { FacilityCard } from "@/components/facility/FacilityCard";
import {
  fetchKursusRekomendasi,
  fetchSekolahRekomendasi,
  fetchUniversitasRekomendasi,
} from "@/lib/api/rekomendasi.client";
import type { components } from "@/types/api";

type FacilityCardData = components["schemas"]["FacilityCard"];

type Props = {
  category: "sekolah" | "universitas" | "kursus";
  /** Optional category filter applied client-side (used by Kursus chips). */
  filterMainCategory?: string | null;
};

const FETCHERS = {
  sekolah: fetchSekolahRekomendasi,
  universitas: fetchUniversitasRekomendasi,
  kursus: fetchKursusRekomendasi,
};

/**
 * Rekomendasi block (spec §4.5). Fetches client-side, no cache. Reshuffles on
 * every mount per acceptance criteria.
 */
export function RekomendasiSection({ category, filterMainCategory }: Props) {
  const { data, isLoading, error } = useSWR(
    `home:rekomendasi:${category}`,
    FETCHERS[category],
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      dedupingInterval: 0,
    },
  );

  if (isLoading) {
    return <SkeletonGrid count={8} />;
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl bg-white border-2 border-ink-100 p-6 text-muted text-sm">
        Gagal memuat rekomendasi. Coba muat ulang halaman.
      </div>
    );
  }

  const items = filterMainCategory
    ? data.filter((f) => extractKursusCategory(f) === filterMainCategory)
    : data;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white border-2 border-dashed border-ink-200 p-6 text-muted text-sm">
        Tidak ada rekomendasi untuk filter ini saat ini.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((f, i) => (
        <FacilityCard
          key={f.id ?? `${f.slug}-${i}`}
          facility={f}
        />
      ))}
    </div>
  );
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white border-2 border-ink-100 overflow-hidden"
          aria-hidden
        >
          <div className="aspect-[4/3] bg-ink-100 animate-pulse" />
          <div className="p-5 space-y-2">
            <div className="h-4 w-4/5 bg-ink-100 rounded animate-pulse" />
            <div className="h-3 w-3/5 bg-ink-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Best-effort extract of Kursus main_category slug from facility URL. */
function extractKursusCategory(f: FacilityCardData): string | null {
  if (f.category !== "kursus" || !f.url) return null;
  const segs = f.url.replace(/^\//, "").split("/");
  // /kursus/{provinsi}/{kabkota}/{kecamatan}/{main_category}/{slug}
  return segs[4] ?? null;
}
