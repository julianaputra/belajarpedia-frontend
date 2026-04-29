import { CountUp } from "@/components/CountUp";
import { Reveal, RevealItem } from "@/components/Reveal";

/**
 * Why-trust-us section, parent audience.
 *
 * 4 pillars with concrete numbers + supporting copy. Calm grid layout, no
 * decorative chaos. Each pillar reinforces a different anxiety: data quality,
 * neutrality, cost, breadth.
 */

const PILLARS = [
  {
    value: 12000,
    suffix: "+",
    label: "Sekolah terdata",
    body: "Database terus diperbarui setiap tahun ajaran baru oleh tim editorial Belajarpedia.",
  },
  {
    value: 100,
    suffix: "%",
    label: "Bebas iklan",
    body: "Tidak ada paid placement. Listing Featured Partner ditandai jelas dan transparan.",
  },
  {
    value: 514,
    suffix: "",
    label: "Kab/Kota tercover",
    body: "Cakupan nasional dari Sabang sampai Merauke, termasuk wilayah 3T.",
  },
  {
    value: 0,
    suffix: "",
    label: "Biaya untuk Anda",
    body: "Pencarian, perbandingan, dan komunikasi dengan fasilitas — semua gratis selamanya.",
  },
];

export function TrustPillars() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="bg-[var(--color-surface-soft)] border-y border-ink-100"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-5 py-10 sm:py-16">
        <Reveal className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <RevealItem>
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-700 mb-2">
              <span aria-hidden className="h-px w-5 bg-brand-300" />
              Mengapa Belajarpedia?
              <span aria-hidden className="h-px w-5 bg-brand-300" />
            </p>
          </RevealItem>
          <RevealItem>
            <h2
              id="trust-heading"
              className="text-xl sm:text-3xl lg:text-4xl font-semibold text-ink-700 leading-tight"
            >
              Dibuat untuk membantu orang tua, bukan menjual iklan
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="text-sm sm:text-base text-muted mt-2 sm:mt-3 leading-relaxed">
              Tim editorial kami memverifikasi setiap data sebelum dipublikasi.
              Listing tidak bisa dibeli — semua institusi tampil dengan kriteria
              yang sama.
            </p>
          </RevealItem>
        </Reveal>

        <Reveal
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
          stagger={0.07}
        >
          {PILLARS.map((p) => (
            <RevealItem
              key={p.label}
              className="bg-white border border-ink-100 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <CountUp
                value={p.value}
                suffix={p.suffix}
                className="block text-2xl sm:text-4xl font-semibold text-brand-700 leading-none tabular-nums"
              />
              <div className="text-sm font-semibold text-ink-700 mt-1.5">
                {p.label}
              </div>
              <p className="text-xs sm:text-sm text-muted mt-2 sm:mt-3 leading-relaxed">
                {p.body}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
