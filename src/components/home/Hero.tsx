import Link from "next/link";
import { SearchBar } from "@/components/home/SearchBar";
import {
  CircleScribble,
  HandArrow,
  StarBurst,
  WavyUnderline,
  ZigZag,
} from "@/components/decorations/Decorations";

const POPULAR = [
  { label: "informatika", href: "/universitas/search?q=informatika" },
  { label: "kursus coding", href: "/kursus/search?q=coding" },
  { label: "swasta jakarta", href: "/sekolah/search?q=swasta+jakarta" },
  { label: "internasional bali", href: "/sekolah/search?q=internasional+bali" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink-700 fx-grid-paper">
      {/* Floating background decorations */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-16 w-72 h-72 rounded-full bg-brand-200 opacity-30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-32 -right-20 w-80 h-80 rounded-full bg-sun-400 opacity-25 blur-3xl"
      />

      {/* Floating stickers — hidden on smallest screens to reduce clutter */}
      <span
        aria-hidden
        className="hidden md:inline-flex absolute top-12 right-[10%] fx-sticker fx-stick-rot-r fx-drift"
        style={{ ["--drift-rot" as string]: "3deg" }}
      >
        🎓 Edukasi
      </span>
      <span
        aria-hidden
        className="hidden lg:inline-flex absolute bottom-24 left-[6%] fx-sticker fx-stick-rot-l fx-drift"
        style={{ ["--drift-rot" as string]: "-3deg", animationDelay: "1.5s" }}
      >
        📚 Cari yang pas
      </span>
      <StarBurst
        className="hidden md:block absolute top-40 left-[8%] text-sun-500 fx-burst"
        size={36}
      />
      <ZigZag
        className="hidden md:block absolute bottom-12 right-[12%] text-brand-500"
        width={140}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:py-16 lg:py-20 grid gap-10 lg:grid-cols-[1.4fr_1fr] items-center">
        {/* Left column — headline + search */}
        <div className="space-y-6 sm:space-y-8 animate-[var(--animate-fade-up)]">
          <span className="fx-sticker fx-stick-rot-l-soft text-ink-700">
            <span className="text-brand-500">●</span> Direktori Pendidikan #1 di Indonesia
          </span>

          <h1
            className="font-display font-semibold text-[2.5rem] leading-[1.05] sm:text-6xl lg:text-7xl text-ink-700"
            style={{ letterSpacing: "-0.02em" }}
          >
            Cari{" "}
            <span className="relative inline-block">
              <span className="fx-highlight">sekolah</span>
            </span>
            ,
            <br />
            <span className="relative inline-block">
              kursus
              <WavyUnderline
                className="absolute -bottom-2 left-0 text-brand-500 w-full"
                width={300}
                stroke={5}
              />
            </span>
            ,{" "}
            <span className="relative inline-block">
              kampus
              <CircleScribble
                className="absolute -top-3 -right-7 text-coral-500 fx-burst"
                size={70}
              />
            </span>
            <br />
            yang{" "}
            <span className="fx-hand text-brand-500 text-[1.2em] inline-block -rotate-2 align-baseline">
              pas buat kamu.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-ink-600 max-w-xl leading-relaxed">
            Bandingkan biaya, kurikulum, dan lokasi.{" "}
            <strong className="text-ink-800">Tanpa iklan ribet</strong>, tanpa biaya
            tersembunyi.
          </p>

          {/* Search w/ hand-drawn arrow annotation (desktop only) */}
          <div className="relative">
            <div className="hidden lg:flex absolute -left-32 top-1/2 -translate-y-1/2 items-center gap-1 text-brand-700">
              <span className="fx-hand text-2xl rotate-[-8deg]">mulai cari</span>
              <HandArrow
                className="text-brand-700"
                width={70}
                rotate={-15}
              />
            </div>
            <SearchBar />
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted font-medium">🔥 Lagi populer:</span>
            {POPULAR.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="px-3 py-1.5 rounded-lg bg-white border-2 border-ink-200 text-ink-700 font-semibold hover:border-brand-500 hover:bg-brand-50 hover:-translate-y-0.5 transition-all duration-150"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right column — stats card "stuck on" */}
        <aside
          className="relative animate-[var(--animate-bounce-in)]"
          style={{ animationDelay: "200ms" }}
        >
          <div className="relative fx-tape rounded-2xl bg-white border-2 border-ink-700 p-6 sm:p-7 rotate-[1.5deg] shadow-[8px_8px_0_0_var(--color-ink-700)]">
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="font-display font-semibold text-5xl sm:text-6xl text-brand-500 leading-none">
                  12K+
                </span>
                <span className="text-ink-700 font-semibold">sekolah terdata</span>
              </div>
              <div className="border-t-2 border-dashed border-ink-200" />
              <Stat label="Universitas" value="800+" tone="ink" />
              <Stat label="Kursus" value="3.500+" tone="brand" />
              <Stat label="Kab/Kota" value="514" tone="ink" />
            </div>

            <span
              aria-hidden
              className="absolute -bottom-4 -right-4 fx-sticker fx-stick-rot-r bg-sun-400 border-ink-900 shadow-[3px_3px_0_0_var(--color-ink-900)] text-ink-900"
            >
              🚀 100% gratis
            </span>
          </div>

          <span
            aria-hidden
            className="hidden sm:inline-flex absolute -top-6 -left-4 fx-sticker fx-stick-rot-l bg-coral-400 text-white border-ink-900 shadow-[3px_3px_0_0_var(--color-ink-900)]"
          >
            ✓ Verified
          </span>
        </aside>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "brand" | "ink";
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-ink-700 font-medium">{label}</span>
      <span
        className={`font-display font-semibold text-2xl ${
          tone === "brand" ? "text-brand-600" : "text-ink-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
