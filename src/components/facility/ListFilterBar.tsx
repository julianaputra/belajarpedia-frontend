"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  useKabkotas,
  useKecamatans,
  useKursusCategories,
  useProvinces,
} from "@/hooks/useRegions";
import {
  kursusListPath,
  sekolahListPath,
  universitasListPath,
} from "@/lib/routing/url-builder";
import type {
  KursusFilters,
  SchoolType,
  SekolahFilters,
  UniversitasFilters,
} from "@/lib/routing/url-parser";

type Category = "sekolah" | "universitas" | "kursus";

type Filters =
  | ({ category: "sekolah" } & SekolahFilters)
  | ({ category: "universitas" } & UniversitasFilters)
  | ({ category: "kursus" } & KursusFilters);

type Props = {
  category: Category;
  currentFilters: SekolahFilters | UniversitasFilters | KursusFilters;
};

const SCHOOL_TYPE_OPTIONS: Array<{ value: SchoolType; label: string }> = [
  { value: "negeri", label: "Negeri" },
  { value: "swasta", label: "Swasta" },
  { value: "international", label: "Internasional" },
];

/**
 * Search + filter bar for list pages. The keyword search routes to
 * `/{category}/search?q=` (existing search route), while region/type
 * dropdowns drive the path-based URL via the existing list builders.
 */
export function ListFilterBar({ category, currentFilters }: Props) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  // Region slugs from current path-based filters.
  const provinceSlug = currentFilters.provinsi ?? "";
  const kabkotaSlug = currentFilters.kabkota ?? "";
  const kecamatanSlug = currentFilters.kecamatan ?? "";

  const schoolType =
    category === "sekolah"
      ? (currentFilters as SekolahFilters).school_type ?? ""
      : "";
  const mainCategory =
    category === "kursus"
      ? (currentFilters as KursusFilters).main_category ?? ""
      : "";

  const { data: provinces } = useProvinces();
  const { data: kabkotas } = useKabkotas(provinceSlug || null);
  const { data: kecamatans } = useKecamatans(kabkotaSlug || null);
  const { data: kursusCategories } = useKursusCategories();

  const navigate = (next: Filters) => {
    if (next.category === "sekolah") {
      router.push(sekolahListPath(stripCategory(next)));
    } else if (next.category === "universitas") {
      router.push(universitasListPath(stripCategory(next)));
    } else {
      router.push(kursusListPath(stripCategory(next)));
    }
  };

  const onProvinceChange = (slug: string) => {
    if (!slug) {
      navigate({ category } as Filters);
      return;
    }
    navigate({ category, provinsi: slug } as Filters);
  };

  const onKabkotaChange = (slug: string) => {
    if (!provinceSlug) return;
    if (!slug) {
      navigate({ category, provinsi: provinceSlug } as Filters);
      return;
    }
    navigate({
      category,
      provinsi: provinceSlug,
      kabkota: slug,
    } as Filters);
  };

  const onKecamatanChange = (slug: string) => {
    if (!provinceSlug || !kabkotaSlug) return;
    if (!slug) {
      navigate({
        category,
        provinsi: provinceSlug,
        kabkota: kabkotaSlug,
      } as Filters);
      return;
    }
    navigate({
      category,
      provinsi: provinceSlug,
      kabkota: kabkotaSlug,
      kecamatan: slug,
    } as Filters);
  };

  const onTypeChange = (value: string) => {
    if (!provinceSlug || !kabkotaSlug || !kecamatanSlug) return;
    const base = {
      provinsi: provinceSlug,
      kabkota: kabkotaSlug,
      kecamatan: kecamatanSlug,
    };
    if (!value) {
      navigate({ category, ...base } as Filters);
      return;
    }
    if (category === "sekolah") {
      navigate({
        category,
        ...base,
        school_type: value as SchoolType,
      });
    } else if (category === "kursus") {
      navigate({
        category,
        ...base,
        main_category: value,
      });
    }
  };

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length === 0) return;
    router.push(`/${category}/search?q=${encodeURIComponent(q)}`);
  };

  const hasAnyFilter = Boolean(
    provinceSlug || kabkotaSlug || kecamatanSlug || schoolType || mainCategory,
  );

  const onReset = () => {
    setQuery("");
    router.push(`/${category}`);
  };

  const showTypeFilter = category === "sekolah" || category === "kursus";
  const typeFilterEnabled = Boolean(
    provinceSlug && kabkotaSlug && kecamatanSlug,
  );

  const typeOptions =
    category === "sekolah"
      ? SCHOOL_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))
      : (kursusCategories ?? []).map((c) => ({
          value: c.slug ?? "",
          label: c.name ?? "",
        }));

  const typeValue = category === "sekolah" ? schoolType : mainCategory;
  const typeLabel = category === "sekolah" ? "Jenis sekolah" : "Kategori kursus";

  return (
    <section
      aria-label="Cari & filter"
      className="rounded-2xl bg-white border border-ink-100 p-4 sm:p-5 space-y-4"
    >
      <form
        onSubmit={onSubmitSearch}
        role="search"
        className="grid gap-2 sm:grid-cols-[1fr_auto]"
      >
        <div className="relative">
          <Search
            size={16}
            aria-hidden
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
          />
          <Input
            type="search"
            aria-label={`Cari ${categoryLabel(category)}`}
            placeholder={`Cari nama ${categoryLabel(category).toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          type="submit"
          size="md"
          disabled={query.trim().length === 0}
          className="w-full sm:w-auto justify-center"
        >
          <Search size={16} aria-hidden /> Cari
        </Button>
      </form>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Saring berdasarkan wilayah
          </p>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-coral-500 hover:text-coral-500/80"
            >
              <X size={12} aria-hidden /> Reset
            </button>
          )}
        </div>
        <div
          className={`grid gap-2 ${
            showTypeFilter
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : "sm:grid-cols-3"
          }`}
        >
          <SearchableSelect
            value={provinceSlug}
            onChange={onProvinceChange}
            options={(provinces ?? []).map((p) => ({
              value: p.slug ?? "",
              label: p.name ?? "",
            }))}
            placeholder="Semua provinsi"
            searchPlaceholder="Cari provinsi…"
          />
          <SearchableSelect
            value={kabkotaSlug}
            onChange={onKabkotaChange}
            disabled={!provinceSlug}
            options={(kabkotas ?? []).map((k) => ({
              value: k.slug ?? "",
              label: k.name ?? "",
            }))}
            placeholder={
              provinceSlug ? "Semua kab/kota" : "Pilih provinsi dulu"
            }
            searchPlaceholder="Cari kab/kota…"
          />
          <SearchableSelect
            value={kecamatanSlug}
            onChange={onKecamatanChange}
            disabled={!kabkotaSlug}
            options={(kecamatans ?? []).map((k) => ({
              value: k.slug ?? "",
              label: k.name ?? "",
            }))}
            placeholder={
              kabkotaSlug ? "Semua kecamatan" : "Pilih kab/kota dulu"
            }
            searchPlaceholder="Cari kecamatan…"
          />
          {showTypeFilter && (
            <SearchableSelect
              value={typeValue}
              onChange={onTypeChange}
              disabled={!typeFilterEnabled}
              options={typeOptions}
              placeholder={
                typeFilterEnabled ? `Semua ${typeLabel.toLowerCase()}` : "Pilih kecamatan dulu"
              }
              searchPlaceholder={`Cari ${typeLabel.toLowerCase()}…`}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function stripCategory<T extends { category: Category }>(
  filters: T,
): Omit<T, "category"> {
  const rest: Record<string, unknown> = { ...filters };
  delete rest.category;
  return rest as Omit<T, "category">;
}

function categoryLabel(c: Category): string {
  if (c === "sekolah") return "Sekolah";
  if (c === "universitas") return "Universitas";
  return "Kursus";
}
