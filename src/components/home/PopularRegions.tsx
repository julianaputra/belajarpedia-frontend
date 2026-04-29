import Link from "next/link";
import { MapPin } from "lucide-react";

import { Reveal, RevealItem } from "@/components/Reveal";

/**
 * Popular regions — 8 destination cards. Helps parents who already know the
 * city they want and would rather skip the cascading dropdown flow.
 *
 * Counts are illustrative for now; backend can supply real per-region totals
 * via /api/regions when ready.
 */

const REGIONS = [
  {
    href: "/sekolah/dki-jakarta",
    label: "Jakarta",
    count: "2.840 sekolah",
  },
  {
    href: "/sekolah/jawa-barat/kota-bandung",
    label: "Bandung",
    count: "1.620 sekolah",
  },
  {
    href: "/sekolah/jawa-barat/kab-bogor",
    label: "Bogor",
    count: "1.140 sekolah",
  },
  {
    href: "/sekolah/bali/kota-denpasar",
    label: "Denpasar",
    count: "470 sekolah",
  },
  {
    href: "/sekolah/bali/kab-badung",
    label: "Badung",
    count: "320 sekolah",
  },
  {
    href: "/sekolah/dki-jakarta/kota-jakarta-selatan",
    label: "Jakarta Selatan",
    count: "780 sekolah",
  },
  {
    href: "/universitas/dki-jakarta",
    label: "Jakarta · Universitas",
    count: "210 kampus",
  },
  {
    href: "/universitas/jawa-barat/kota-bandung",
    label: "Bandung · Universitas",
    count: "130 kampus",
  },
];

export function PopularRegions() {
  return (
    <section
      aria-labelledby="regions-heading"
      className="mx-auto max-w-6xl px-4 sm:px-5 py-8 sm:py-16"
    >
      <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-8">
        <RevealItem>
          <h2
            id="regions-heading"
            className="text-xl sm:text-3xl font-semibold text-ink-700 flex items-center gap-2"
          >
            <span aria-hidden className="h-2 w-2 rounded-full bg-sun-400 shrink-0" />
            Wilayah populer
          </h2>
          <p className="text-sm sm:text-base text-muted mt-1 pl-4">
            Lompat langsung ke kota Anda — tanpa perlu pilih provinsi dulu.
          </p>
        </RevealItem>
        <RevealItem>
          <Link
            href="/sekolah"
            className="text-brand-700 hover:underline font-semibold text-sm whitespace-nowrap"
          >
            Lihat semua wilayah →
          </Link>
        </RevealItem>
      </Reveal>

      <Reveal
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4"
        stagger={0.05}
      >
        {REGIONS.map((r) => (
          <RevealItem key={r.href}>
            <Link
              href={r.href}
              className="group block bg-white border border-ink-100 rounded-lg sm:rounded-xl p-3 sm:p-5 hover:border-brand-300 hover:shadow-[0_8px_20px_-10px_rgb(28_47_112_/_0.2)] transition-all"
            >
              <div className="flex items-center gap-1.5 text-ink-500 text-[10px] sm:text-xs">
                <MapPin size={12} aria-hidden />
                <span className="uppercase tracking-wider font-medium">Wilayah</span>
              </div>
              <div className="font-semibold text-sm sm:text-lg text-ink-700 mt-1 sm:mt-1.5 group-hover:text-brand-700 transition-colors line-clamp-1">
                {r.label}
              </div>
              <div className="text-xs sm:text-sm text-muted mt-0.5 sm:mt-1">{r.count}</div>
            </Link>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}

