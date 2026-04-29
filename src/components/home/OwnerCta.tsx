import Link from "next/link";

/**
 * Subordinate CTA for facility owners. Quiet on the parent home so it doesn't
 * compete with the primary parent journey.
 */
export function OwnerCta() {
  return (
    <section
      aria-labelledby="owner-cta-heading"
      className="mx-auto max-w-6xl px-5 py-12 sm:py-14"
    >
      <div className="bg-ink-700 text-white rounded-2xl p-7 sm:p-10 grid lg:grid-cols-[1.5fr_1fr] gap-6 items-center">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
            Untuk pemilik fasilitas
          </p>
          <h2
            id="owner-cta-heading"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight"
          >
            Punya sekolah, kampus, atau lembaga kursus?
          </h2>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl">
            Daftarkan fasilitas Anda secara gratis. Tim kami akan memverifikasi
            informasi sebelum dipublikasi. Tanpa biaya, tanpa kewajiban.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <Link
            href="/submit-listing"
            className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-white text-ink-700 font-semibold text-sm hover:bg-ink-50 transition-colors"
          >
            Daftarkan fasilitas →
          </Link>
          <Link
            href="/request-correction"
            className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-transparent border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Perbaiki info yang ada
          </Link>
        </div>
      </div>
    </section>
  );
}
