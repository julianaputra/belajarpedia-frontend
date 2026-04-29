import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  HandCoins,
  Heart,
  School,
  ShieldCheck,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import { SearchBar } from "@/components/home/SearchBar";
import { Reveal, RevealItem } from "@/components/Reveal";

const TRUST_PILLS: Array<{ Icon: LucideIcon; label: string }> = [
  { Icon: ShieldCheck, label: "Data terverifikasi" },
  { Icon: Sparkles, label: "Tanpa iklan" },
  { Icon: HandCoins, label: "Selalu gratis" },
];

/**
 * Parent-targeted hero.
 *
 * Tone: confident, calm, trust-first — but with a bit more atmosphere.
 * Layout: centered headline + search + ambient floating ornaments.
 */
export function ParentHero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-[#f6faf7] via-white to-white">
      {/* Soft glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-brand-100 opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-6 sm:right-16 w-44 h-44 rounded-full bg-sun-400 opacity-25 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-12 left-4 sm:left-12 w-48 h-48 rounded-full bg-brand-300 opacity-20 blur-3xl"
      />

      {/* Drifting decorative icons (desktop only — would crowd mobile) */}
      <FloatingIcon
        Icon={BookOpen}
        className="hidden md:flex top-16 left-[8%] text-brand-500/30"
        size={28}
        delay="0s"
      />
      <FloatingIcon
        Icon={GraduationCap}
        className="hidden md:flex top-24 right-[10%] text-ink-700/20"
        size={32}
        delay="1s"
      />
      <FloatingIcon
        Icon={Star}
        className="hidden lg:flex top-1/2 left-[6%] text-sun-400/60"
        size={20}
        delay="0.5s"
      />
      <FloatingIcon
        Icon={Heart}
        className="hidden lg:flex bottom-32 right-[14%] text-coral-400/40"
        size={22}
        delay="1.5s"
      />
      <FloatingIcon
        Icon={School}
        className="hidden lg:flex bottom-20 left-[16%] text-ink-700/20"
        size={26}
        delay="2s"
      />
      <FloatingIcon
        Icon={Sparkles}
        className="hidden md:flex top-1/3 right-[4%] text-brand-500/40"
        size={18}
        delay="2.5s"
      />

      {/* Tiny dot speckles */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-20 left-8 hidden sm:block w-1.5 h-1.5 rounded-full bg-brand-400"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-32 right-20 hidden sm:block w-2 h-2 rounded-full bg-sun-400"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-28 right-10 hidden md:block w-1.5 h-1.5 rounded-full bg-brand-500"
      />

      <Reveal
        className="relative mx-auto max-w-5xl px-4 sm:px-5 py-10 sm:py-20 lg:py-24 text-center space-y-5 sm:space-y-7"
        once
        stagger={0.1}
      >
        {/* Social proof badge */}
        <RevealItem className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-200 shadow-[0_2px_8px_-3px_rgb(28_47_112_/_0.08)] text-xs sm:text-sm font-medium text-ink-700">
            <span className="inline-flex -space-x-1.5" aria-hidden>
              <span className="w-5 h-5 rounded-full bg-brand-500 border-2 border-white" />
              <span className="w-5 h-5 rounded-full bg-sun-400 border-2 border-white" />
              <span className="w-5 h-5 rounded-full bg-coral-400 border-2 border-white" />
            </span>
            Dipercaya{" "}
            <span className="font-semibold text-brand-700">12.000+ keluarga</span>{" "}
            di Indonesia
          </span>
        </RevealItem>

        <RevealItem>
          <h1 className="text-[28px] sm:text-5xl lg:text-7xl font-semibold text-ink-700 leading-[1.1] tracking-tight max-w-4xl mx-auto">
            Bantu Anda memilih{" "}
            <span className="relative inline-block text-brand-700">
              <span
                aria-hidden
                className="absolute left-0 right-0 bottom-1 sm:bottom-1.5 h-2 sm:h-3 bg-sun-400/50 rounded-full"
              />
              <span className="relative">pendidikan terbaik</span>
            </span>
            <br className="hidden sm:block" />
            {" "}untuk anak Anda
          </h1>
        </RevealItem>

        <RevealItem>
          <p className="text-sm sm:text-lg text-ink-600 max-w-2xl mx-auto leading-relaxed">
            Bandingkan sekolah, universitas, dan kursus dari seluruh Indonesia.
            Lihat biaya, kurikulum, akreditasi, dan kontak — semua dalam satu
            tempat, transparan dan terpercaya.
          </p>
        </RevealItem>

        <RevealItem className="pt-1 sm:pt-2 max-w-3xl mx-auto">
          <SearchBar />
        </RevealItem>

        {/* Quick category links */}
        <RevealItem>
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
        </RevealItem>

        {/* Inline trust pills — replaces heavier 3-card row */}
        <RevealItem className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-3 sm:pt-4">
          {TRUST_PILLS.map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink-100 text-xs sm:text-sm font-medium text-ink-700 shadow-[0_1px_3px_-1px_rgb(28_47_112_/_0.06)]"
            >
              <p.Icon
                size={14}
                aria-hidden
                className="text-ink-400 hidden sm:inline"
              />
              {p.label}
            </span>
          ))}
        </RevealItem>
      </Reveal>
    </section>
  );
}

function FloatingIcon({
  Icon,
  className,
  size,
  delay,
}: {
  Icon: LucideIcon;
  className: string;
  size: number;
  delay: string;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute fx-drift ${className}`}
      style={{ animationDelay: delay }}
    >
      <Icon size={size} strokeWidth={1.75} />
    </span>
  );
}
