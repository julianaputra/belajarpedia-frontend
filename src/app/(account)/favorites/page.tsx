"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import { ButtonLink } from "@/components/ui/Button";
import { FacilityGrid } from "@/components/facility/FacilityCard";
import { Pagination } from "@/components/Pagination";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { listMyFavorites } from "@/lib/api/engagement.client";
import type { components } from "@/types/api";

type Favorite = NonNullable<components["schemas"]["Favorite"]>;
type FacilityCard = NonNullable<components["schemas"]["FacilityCard"]>;

export default function FavoritesPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useCurrentUser();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?returnTo=/favorites");
    }
  }, [isLoading, isAuthenticated, router]);

  const initialPage = React.useMemo(() => {
    if (typeof window === "undefined") return 1;
    const raw = new URLSearchParams(window.location.search).get("page");
    const n = raw ? Number.parseInt(raw, 10) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, []);

  const { data, isLoading: loading } = useSWR(
    isAuthenticated ? `user:favorites:${initialPage}` : null,
    () => listMyFavorites(initialPage),
  );

  if (isLoading || !isAuthenticated) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-5 py-5 sm:py-10 text-sm sm:text-base text-muted">
        Memuat…
      </main>
    );
  }

  const favorites = (data?.data ?? []) as Favorite[];
  const facilities = favorites
    .map((f) => f.facility)
    .filter((f): f is FacilityCard => Boolean(f));
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.last_page ?? 1;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-5 py-5 sm:py-10 space-y-4 sm:space-y-8">
      <header className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-4xl text-ink-700">Favorit Saya</h1>
        <p className="text-sm sm:text-base text-muted">
          {total > 0
            ? `${total.toLocaleString("id-ID")} fasilitas tersimpan`
            : "Belum ada fasilitas yang Anda simpan."}
        </p>
      </header>

      {loading ? (
        <SkeletonGrid />
      ) : facilities.length > 0 ? (
        <>
          <FacilityGrid
            facilities={facilities}
            className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          />
          <Pagination
            basePath="/favorites"
            currentPage={initialPage}
            totalPages={totalPages}
            pageMode="query"
          />
        </>
      ) : (
        <FavoritesEmpty />
      )}
    </main>
  );
}

function FavoritesEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 p-8 sm:p-10 text-center space-y-3">
      <p className="text-lg font-semibold text-ink-700">Belum ada favorit</p>
      <p className="text-sm sm:text-base text-muted max-w-md mx-auto">
        Klik tombol{" "}
        <strong className="text-ink-700">Simpan ke Favorit</strong> di halaman
        detail fasilitas untuk mulai membangun daftar pilihan Anda.
      </p>
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        <ButtonLink href="/sekolah" variant="primary" size="sm">
          Cari Sekolah
        </ButtonLink>
        <ButtonLink href="/universitas" variant="secondary" size="sm">
          Cari Universitas
        </ButtonLink>
        <ButtonLink href="/kursus" variant="outline" size="sm">
          Cari Kursus
        </ButtonLink>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-3 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg sm:rounded-2xl bg-white border border-ink-100 overflow-hidden"
          aria-hidden
        >
          <div className="aspect-[4/3] bg-ink-100 animate-pulse" />
          <div className="p-3 sm:p-5 space-y-2">
            <div className="h-4 w-4/5 bg-ink-100 rounded animate-pulse" />
            <div className="h-3 w-3/5 bg-ink-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
