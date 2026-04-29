"use client";

import * as React from "react";
import { ArrowRight, GraduationCap, School, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { RekomendasiSection } from "@/components/home/RekomendasiSection";
import { Reveal, RevealItem } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type CategoryId = "sekolah" | "universitas" | "kursus";

type Tab = {
  id: CategoryId;
  label: string;
  Icon: typeof School;
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
};

const TABS: Tab[] = [
  {
    id: "sekolah",
    label: "Sekolah",
    Icon: School,
    title: "Sekolah pilihan editorial",
    subtitle:
      "SD, SMP, SMA, dan SMK negeri / swasta / internasional dari seluruh Indonesia.",
    ctaHref: "/sekolah",
    ctaLabel: "Lihat semua sekolah",
  },
  {
    id: "universitas",
    label: "Universitas",
    Icon: GraduationCap,
    title: "Universitas pilihan editorial",
    subtitle:
      "Kampus S1, D3, dan D4 dengan informasi prodi, jalur masuk, dan biaya UKT.",
    ctaHref: "/universitas",
    ctaLabel: "Lihat semua universitas",
  },
  {
    id: "kursus",
    label: "Kursus",
    Icon: Sparkles,
    title: "Kursus pilihan editorial",
    subtitle:
      "Coding, bahasa, musik, olahraga, dan seni untuk melengkapi pendidikan formal.",
    ctaHref: "/kursus",
    ctaLabel: "Lihat semua kursus",
  },
];

/**
 * Combined category showcase with tabs. Replaces the previous three separate
 * CategoryFeature sections; no search/filter inside — pure recommendation
 * preview. For deeper exploration, each tab links to the full list page.
 */
export function CategoryTabs() {
  const [activeId, setActiveId] = React.useState<CategoryId>("sekolah");
  const active = TABS.find((t) => t.id === activeId)!;

  return (
    <section
      aria-labelledby="category-tabs-heading"
      className="mx-auto max-w-6xl px-4 sm:px-5 py-8 sm:py-16"
    >
      <Reveal className="text-center max-w-2xl mx-auto mb-5 sm:mb-10">
        <RevealItem>
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-700 mb-1.5 sm:mb-2">
            <span aria-hidden className="h-px w-5 bg-brand-300" />
            Jelajahi pilihan
            <span aria-hidden className="h-px w-5 bg-brand-300" />
          </p>
        </RevealItem>
        <RevealItem>
          <h2
            id="category-tabs-heading"
            className="text-xl sm:text-3xl lg:text-4xl font-semibold text-ink-700 leading-tight"
          >
            Rekomendasi per kategori
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="text-sm sm:text-base text-muted mt-2 sm:mt-3 leading-relaxed">
            Pilih kategori untuk lihat fasilitas terbaru yang sudah diverifikasi
            tim editorial.
          </p>
        </RevealItem>
      </Reveal>

      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Pilih kategori"
        className="flex justify-center mb-5 sm:mb-8"
      >
        <div className="inline-flex p-1 rounded-lg bg-ink-50 border border-ink-100 max-w-full">
          {TABS.map((t) => {
            const isActive = t.id === activeId;
            return (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${t.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveId(t.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-3 sm:px-5 rounded-md text-xs sm:text-sm font-semibold",
                  "transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200",
                  isActive
                    ? "bg-white text-ink-700 shadow-[0_2px_6px_-1px_rgb(28_47_112_/_0.1)]"
                    : "text-ink-500 hover:text-ink-700",
                )}
              >
                <t.Icon size={14} aria-hidden className="shrink-0" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab panel — one DOM panel that swaps content per active tab. */}
      <div
        role="tabpanel"
        id={`panel-${activeId}`}
        aria-labelledby={`tab-${activeId}`}
        key={activeId}
        className="space-y-4 sm:space-y-6 animate-[var(--animate-fade-up)]"
      >
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-base sm:text-2xl font-semibold text-ink-700">
            {active.title}
          </h3>
          <p className="text-sm sm:text-base text-muted mt-1.5 sm:mt-2 leading-relaxed">
            {active.subtitle}
          </p>
        </div>

        <RekomendasiSection category={active.id} />

        <div className="flex justify-center pt-1 sm:pt-2">
          <ButtonLink
            href={active.ctaHref}
            variant="primary"
            size="md"
            className="inline-flex items-center gap-2"
          >
            {active.ctaLabel}
            <ArrowRight size={16} aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
