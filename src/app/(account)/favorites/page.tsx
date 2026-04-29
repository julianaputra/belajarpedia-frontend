"use client";

import * as React from "react";
import Link from "next/link";
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
      <main className="mx-auto max-w-6xl px-5 py-10 text-muted">
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
    <main className="mx-auto max-w-6xl px-5 py-10 space-y-7">
      <header className="space-y-2 animate-[var(--animate-fade-up)]">
        <span className="fx-sticker fx-stick-rot-l-soft bg-coral-400 text-white border-ink-900 shadow-[3px_3px_0_0_var(--color-ink-900)]">
          ♥ Favorit Saya
        </span>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-ink-700">
          Fasilitas yang kamu simpan
        </h1>
        <p className="text-muted">
          {total > 0
            ? `${total.toLocaleString("id-ID")} fasilitas tersimpan`
            : "Mulai jelajahi dan simpan fasilitas favoritmu."}
        </p>
      </header>

      {loading ? (
        <SkeletonGrid />
      ) : facilities.length > 0 ? (
        <>
          <FacilityGrid facilities={facilities} />
          <Pagination
            basePath="/favorites"
            currentPage={initialPage}
            totalPages={totalPages}
            pageMode="query"
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
    <div className="rounded-2xl bg-white border-2 border-dashed border-ink-200 p-8 sm:p-10 text-center space-y-4 animate-[var(--animate-bounce-in)]">
      <div className="text-5xl" aria-hidden>
        ♡
      </div>
      <h2 className="font-display font-semibold text-xl text-ink-700">
        Belum ada favorit
      </h2>
      <p className="text-muted max-w-md mx-auto">
        Klik tombol <strong className="text-ink-700">♡ Simpan ke Favorit</strong> di
        halaman detail fasilitas untuk mulai membangun daftar pilihanmu.
      </p>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <ButtonLink href="/sekolah" variant="primary">
          🏫 Cari Sekolah
        </ButtonLink>
        <ButtonLink href="/universitas" variant="secondary">
          🎓 Cari Universitas
        </ButtonLink>
        <ButtonLink href="/kursus" variant="sun">
          🚀 Cari Kursus
        </ButtonLink>
      </div>

      <p className="text-xs text-muted pt-2">
        Tips: favorit bersifat kumulatif — sekali disimpan, fasilitas tersebut
        akan muncul di sini untuk selalu kamu tinjau ulang.
      </p>

      <Link
        href="/profile"
        className="inline-block text-brand-700 hover:underline text-sm font-semibold pt-2"
      >
        ← Kembali ke profil
      </Link>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
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
