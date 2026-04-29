import Link from "next/link";
import {
  HandCoins,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SearchBar } from "@/components/home/SearchBar";

const TRUST_BADGES: Array<{ Icon: LucideIcon; title: string; body: string }> = [
  {
    Icon: ShieldCheck,
    title: "Data terverifikasi",
    body: "Setiap fasilitas diverifikasi tim editorial sebelum tampil.",
  },
  {
    Icon: Sparkles,
    title: "Tanpa iklan & pembayaran",
    body: "Urutan murni berbasis kelengkapan data, bukan paid ranking.",
  },
  {
    Icon: HandCoins,
    title: "Selalu gratis",
    body: "Tidak ada langganan, tidak ada biaya tersembunyi.",
  },
];

/**
 * Parent-targeted hero.
 *
 * Tone: confident, calm, trust-first. Drops sticker/tilt aesthetic.
 * Layout: centered headline + prominent search + 3 trust pillars below.
 */
export function ParentHero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-[#f7faf8] to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-brand-100 opacity-40 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-5 py-10 sm:py-16 lg:py-20 text-center space-y-5 sm:space-y-7">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-700">
          Direktori pendidikan Indonesia
        </p>

        <h1 className="text-[26px] sm:text-5xl lg:text-6xl font-semibold text-ink-700 leading-[1.15] max-w-3xl mx-auto">
          Bantu Anda memilih{" "}
          <span className="text-brand-700">pendidikan terbaik</span> untuk anak
        </h1>

        <p className="text-sm sm:text-lg text-ink-600 max-w-2xl mx-auto leading-relaxed">
          Bandingkan sekolah, universitas, dan kursus dari seluruh Indonesia.
          Lihat biaya, kurikulum, akreditasi, dan kontak — semua dalam satu
          tempat, transparan dan terpercaya.
        </p>

        <div className="pt-1 sm:pt-2 max-w-3xl mx-auto">
          <SearchBar />
        </div>

        {/* Quick category links */}
        <p className="text-xs sm:text-sm text-muted pt-0.5 sm:pt-1">
          Atau jelajahi langsung:{" "}
          <Link
            href="/sekolah"
            className="text-brand-700 hover:underline font-semibold"
          >
            Sekolah
          </Link>
          {" · "}
          <Link
            href="/universitas"
            className="text-brand-700 hover:underline font-semibold"
          >
            Universitas
          </Link>
          {" · "}
          <Link
            href="/kursus"
            className="text-brand-700 hover:underline font-semibold"
          >
            Kursus
          </Link>
        </p>

        {/* Trust badges row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-8 max-w-4xl mx-auto">
          {TRUST_BADGES.map((b) => (
            <div
              key={b.title}
              className="bg-white border border-ink-100 rounded-xl p-3 sm:p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center flex-shrink-0"
                >
                  <b.Icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-700">{b.title}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">
                    {b.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
