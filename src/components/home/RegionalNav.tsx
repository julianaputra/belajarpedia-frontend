"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Input";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useKabkotas, useProvinces } from "@/hooks/useRegions";

type Props = {
  category: "sekolah" | "universitas";
};

const CATEGORY_LABEL: Record<Props["category"], string> = {
  sekolah: "sekolah",
  universitas: "universitas",
};

/**
 * Cascading provinsi → kabkota dropdowns with search. Submitting navigates
 * to the deepest filled level. Mobile-first: stacks fully, full-width submit.
 */
export function RegionalNav({ category }: Props) {
  const router = useRouter();
  const { data: provinces, isLoading: pLoading } = useProvinces();
  const [provinceSlug, setProvinceSlug] = React.useState<string>("");
  const [kabkotaSlug, setKabkotaSlug] = React.useState<string>("");
  const { data: kabkotas, isLoading: kLoading } = useKabkotas(provinceSlug);

  const submit = () => {
    if (!provinceSlug) return;
    const path = kabkotaSlug
      ? `/${category}/${provinceSlug}/${kabkotaSlug}`
      : `/${category}/${provinceSlug}`;
    router.push(path);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${category}-province`}>Provinsi</Label>
          <SearchableSelect
            id={`${category}-province`}
            value={provinceSlug}
            onChange={(v) => {
              setProvinceSlug(v);
              setKabkotaSlug("");
            }}
            disabled={pLoading}
            options={(provinces ?? []).map((p) => ({
              value: p.slug ?? "",
              label: p.name ?? "",
            }))}
            placeholder={pLoading ? "Memuat…" : "Pilih provinsi"}
            searchPlaceholder="Cari provinsi…"
          />
        </div>

        <div>
          <Label htmlFor={`${category}-kabkota`}>Kab/Kota</Label>
          <SearchableSelect
            id={`${category}-kabkota`}
            value={kabkotaSlug}
            onChange={setKabkotaSlug}
            disabled={!provinceSlug || kLoading}
            options={(kabkotas ?? []).map((k) => ({
              value: k.slug ?? "",
              label: k.name ?? "",
            }))}
            placeholder={
              !provinceSlug
                ? "Pilih provinsi dulu"
                : kLoading
                  ? "Memuat…"
                  : "Semua kab/kota"
            }
            searchPlaceholder="Cari kab/kota…"
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={submit}
        disabled={!provinceSlug}
        className="w-full sm:w-auto justify-center"
      >
        <Search size={18} aria-hidden /> Cari {CATEGORY_LABEL[category]}
      </Button>

      {!provinceSlug && (
        <p className="text-xs text-muted">
          Pilih provinsi untuk mulai. Kab/Kota opsional — kosongkan untuk lihat
          se-provinsi.
        </p>
      )}
    </div>
  );
}
