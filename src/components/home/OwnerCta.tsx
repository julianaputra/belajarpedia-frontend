import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Reveal, RevealItem } from "@/components/Reveal";

/**
 * Subordinate CTA for facility owners. Quiet on the parent home so it doesn't
 * compete with the primary parent journey.
 */
export function OwnerCta() {
  return (
    <section
      aria-labelledby="owner-cta-heading"
      className="mx-auto max-w-6xl px-4 sm:px-5 py-8 sm:py-14"
    >
      <div className="relative bg-ink-700 text-white rounded-xl sm:rounded-2xl p-5 sm:p-10 grid lg:grid-cols-[1.5fr_1fr] gap-5 sm:gap-6 items-center overflow-hidden">
        {/* Decorative glows + sparkle */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-8 w-48 h-48 rounded-full bg-brand-500 opacity-20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-1/4 w-40 h-40 rounded-full bg-sun-400 opacity-10 blur-3xl"
        />
        <Sparkles
          aria-hidden
          size={16}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-sun-400 opacity-70"
        />

        <Reveal className="relative space-y-2 sm:space-y-3">
          <RevealItem>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
              <span aria-hidden className="h-px w-5 bg-brand-300/60" />
              Untuk pemilik fasilitas
            </p>
          </RevealItem>
          <RevealItem>
            <h2
              id="owner-cta-heading"
              className="text-lg text-white sm:text-2xl lg:text-3xl font-semibold leading-tight"
            >
              Punya sekolah, kampus, atau lembaga kursus?
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl">
              Daftarkan fasilitas Anda secara gratis. Tim kami akan memverifikasi
              informasi sebelum dipublikasi. Tanpa biaya, tanpa kewajiban.
            </p>
          </RevealItem>
        </Reveal>
        <Reveal className="relative flex flex-col gap-2 sm:gap-2.5" stagger={0.08}>
          <RevealItem>
            <Link
              href="/submit-listing"
              className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-white text-ink-700 font-semibold text-sm hover:bg-ink-50 transition-colors"
            >
              Daftarkan fasilitas →
            </Link>
          </RevealItem>
          <RevealItem>
            <Link
              href="/request-correction"
              className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-transparent border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Perbaiki info yang ada
            </Link>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
