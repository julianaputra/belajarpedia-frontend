"use client";

import { cn } from "@/lib/utils";
import { useKursusCategories } from "@/hooks/useRegions";

type Props = {
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
};

/**
 * Chip nav for Kursus categories on the home page (spec §4.5).
 * Selecting a chip filters the Rekomendasi cards client-side. To drill into a
 * full list view (with region), the user uses the regional flow on a
 * category-filtered list page.
 */
export function KursusCategoryChips({ selectedSlug, onSelect }: Props) {
  const { data: categories, isLoading } = useKursusCategories();

  if (isLoading) {
    return (
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="h-9 w-24 rounded-lg bg-ink-100 animate-pulse"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter kategori kursus"
    >
      <Chip
        label="Semua"
        active={selectedSlug === null}
        onClick={() => onSelect(null)}
      />
      {categories.map((c) => (
        <Chip
          key={c.slug}
          label={c.name ?? ""}
          active={c.slug === selectedSlug}
          onClick={() => onSelect(c.slug ?? null)}
        />
      ))}
    </div>
  );
}

type ChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "h-9 px-4 rounded-lg text-sm font-semibold",
        "transition-[transform,background-color,box-shadow,border-color] duration-150 ease-[var(--ease-pop)]",
        "border-2 hover:-translate-y-0.5",
        active
          ? "bg-brand-500 text-white border-brand-700 shadow-[0_3px_0_0_var(--color-brand-700)]"
          : "bg-white text-ink-700 border-ink-200 hover:border-brand-300 hover:text-brand-700",
      )}
    >
      {label}
    </button>
  );
}
