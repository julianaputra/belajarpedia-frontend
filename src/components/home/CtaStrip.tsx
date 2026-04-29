import Link from "next/link";
import { StarBurst } from "@/components/decorations/Decorations";

const MARQUEE_ITEMS = [
  "Daftarkan fasilitasmu",
  "✦",
  "Gratis 100%",
  "✦",
  "Kelola informasi sendiri",
  "✦",
  "Dapatkan inquiry langsung",
  "✦",
  "Tanpa biaya tersembunyi",
  "✦",
];

/**
 * CTA strip targeting facility owners (Pak Budi persona). Marquee for
 * playful effect; static center card for actual CTA.
 */
export function CtaStrip() {
  // Repeat once for seamless marquee
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className="relative my-16 sm:my-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5">
        <div className="relative bg-ink-700 text-white rounded-2xl border-2 border-ink-900 shadow-[8px_8px_0_0_var(--color-ink-900)] overflow-hidden">
          {/* Marquee background strip */}
          <div className="absolute inset-x-0 top-0 h-14 border-b-2 border-ink-900/40 bg-brand-500 overflow-hidden flex items-center">
            <div className="fx-marquee flex gap-8 whitespace-nowrap text-ink-900 font-display font-semibold text-lg uppercase tracking-wider px-6">
              {items.map((it, i) => (
                <span key={i}>{it}</span>
              ))}
            </div>
          </div>

          {/* Decorative star bursts */}
          <StarBurst
            className="absolute top-20 right-12 text-sun-400 fx-burst hidden sm:block"
            size={42}
          />
          <StarBurst
            className="absolute bottom-12 left-8 text-coral-400 fx-burst hidden md:block"
            size={28}
          />

          <div className="relative pt-24 pb-10 px-6 sm:px-12 sm:pb-14 grid gap-6 lg:grid-cols-[1.5fr_1fr] items-center">
            <div className="space-y-4">
              <span className="fx-sticker fx-stick-rot-l-soft bg-sun-400 border-ink-900 shadow-[3px_3px_0_0_var(--color-ink-900)] text-ink-900">
                💼 Untuk Pemilik Sekolah & Kursus
              </span>
              <h2 className="font-display font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight">
                Punya sekolah atau kursus?{" "}
                <span className="text-sun-400">Daftarkan gratis.</span>
              </h2>
              <p className="text-white/80 text-base sm:text-lg max-w-xl">
                Ribuan calon siswa & orangtua mencari fasilitas pendidikan setiap
                hari. Pastikan punyamu kelihatan.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/submit-listing"
                className="inline-flex items-center justify-center h-14 px-7 rounded-lg bg-sun-400 text-ink-900 font-semibold text-lg border-b-4 border-sun-500 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-transform"
              >
                Daftarkan fasilitasku →
              </Link>
              <Link
                href="/request-correction"
                className="inline-flex items-center justify-center h-12 px-5 rounded-lg bg-transparent border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Atau perbaiki info yang ada
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
