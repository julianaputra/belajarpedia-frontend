"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Input";
import { useKabkotas, useProvinces } from "@/hooks/useRegions";

type Props = {
  category: "sekolah" | "universitas";
};

const CATEGORY_LABEL: Record<Props["category"], string> = {
  sekolah: "sekolah",
  universitas: "universitas",
};

/**
 * Cascading provinsi → kabkota dropdowns. Submitting navigates to the deepest
 * filled level. Mobile-first: stacks fully, full-width submit button.
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
          <Select
            id={`${category}-province`}
            value={provinceSlug}
            onChange={(e) => {
              setProvinceSlug(e.target.value);
              setKabkotaSlug("");
            }}
            disabled={pLoading}
          >
            <option value="">{pLoading ? "Memuat…" : "Pilih provinsi"}</option>
            {provinces?.map((p) => (
              <option key={p.slug} value={p.slug ?? ""}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor={`${category}-kabkota`}>Kab/Kota</Label>
          <Select
            id={`${category}-kabkota`}
            value={kabkotaSlug}
            onChange={(e) => setKabkotaSlug(e.target.value)}
            disabled={!provinceSlug || kLoading}
          >
            <option value="">
              {!provinceSlug
                ? "Pilih provinsi dulu"
                : kLoading
                  ? "Memuat…"
                  : "Semua kab/kota"}
            </option>
            {kabkotas?.map((k) => (
              <option key={k.slug} value={k.slug ?? ""}>
                {k.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Button
        type="button"
        onClick={submit}
        disabled={!provinceSlug}
        className="w-full sm:w-auto justify-center"
      >
        🔎 Cari {CATEGORY_LABEL[category]}
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
