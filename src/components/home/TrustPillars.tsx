/**
 * Why-trust-us section, parent audience.
 *
 * 4 pillars with concrete numbers + supporting copy. Calm grid layout, no
 * decorative chaos. Each pillar reinforces a different anxiety: data quality,
 * neutrality, cost, breadth.
 */

const PILLARS = [
  {
    stat: "12.000+",
    label: "Sekolah terdata",
    body: "Database terus diperbarui setiap tahun ajaran baru oleh tim editorial Belajarpedia.",
  },
  {
    stat: "100%",
    label: "Bebas iklan",
    body: "Tidak ada paid placement. Listing Featured Partner ditandai jelas dan transparan.",
  },
  {
    stat: "514",
    label: "Kab/Kota tercover",
    body: "Cakupan nasional dari Sabang sampai Merauke, termasuk wilayah 3T.",
  },
  {
    stat: "0",
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
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-700 mb-2">
            Mengapa Belajarpedia?
          </p>
          <h2
            id="trust-heading"
            className="text-xl sm:text-3xl lg:text-4xl font-semibold text-ink-700 leading-tight"
          >
            Dibuat untuk membantu orang tua, bukan menjual iklan
          </h2>
          <p className="text-sm sm:text-base text-muted mt-2 sm:mt-3 leading-relaxed">
            Belajarpedia adalah inisiatif Timedoor untuk memberikan akses
            informasi pendidikan yang netral dan terverifikasi.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {PILLARS.map((p) => (
            <div
              key={p.label}
              className="bg-white border border-ink-100 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <div className="text-2xl sm:text-4xl font-semibold text-brand-700 leading-none">
                {p.stat}
              </div>
              <div className="text-sm font-semibold text-ink-700 mt-1.5">
                {p.label}
              </div>
              <p className="text-xs sm:text-sm text-muted mt-2 sm:mt-3 leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
