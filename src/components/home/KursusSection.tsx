"use client";

import * as React from "react";
import { KursusCategoryChips } from "@/components/home/KursusCategoryChips";
import { RekomendasiSection } from "@/components/home/RekomendasiSection";

/**
 * Kursus home section: chips state co-located with rekomendasi so chip
 * selection filters the cards client-side.
 */
export function KursusSection() {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div className="space-y-5">
      <KursusCategoryChips selectedSlug={selected} onSelect={setSelected} />
      <RekomendasiSection category="kursus" filterMainCategory={selected} />
    </div>
  );
}
