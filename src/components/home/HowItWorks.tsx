import { HandArrow, WavyUnderline } from "@/components/decorations/Decorations";

const STEPS = [
  {
    n: "01",
    emoji: "🎯",
    title: "Pilih kategori",
    body: "Sekolah, universitas, atau kursus — pilih yang lagi kamu cari.",
    rotate: "-rotate-1",
    bg: "bg-brand-50",
  },
  {
    n: "02",
    emoji: "📍",
    title: "Saring wilayah & topik",
    body: "Provinsi, kab/kota, sampai kecamatan. Atau topik kursus yang kamu mau.",
    rotate: "rotate-1",
    bg: "bg-sun-400/30",
  },
  {
    n: "03",
    emoji: "💬",
    title: "Hubungi langsung",
    body: "Kirim pertanyaan, simpan favorit. Balasan langsung ke email kamu.",
    rotate: "-rotate-1",
    bg: "bg-coral-400/30",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-16 sm:py-20 fx-paper border-y-2 border-ink-100 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 space-y-12">
        <header className="text-center space-y-2 animate-[var(--animate-fade-up)]">
          <p className="fx-hand text-2xl text-brand-600 -rotate-2">
            cuma 3 langkah —
          </p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-ink-700">
            <span className="relative inline-block">
              Gampang banget
              <WavyUnderline
                className="absolute -bottom-2 left-0 text-sun-500 w-full"
                width={400}
                stroke={5}
              />
            </span>{" "}
            dipakai.
          </h2>
        </header>

        <div className="relative grid gap-6 md:grid-cols-3 md:gap-8">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className={`relative ${s.bg} ${s.rotate} rounded-[var(--radius-xl)] border-2 border-ink-700 p-6 sm:p-7 shadow-[6px_6px_0_0_var(--color-ink-700)] animate-[var(--animate-bounce-in)] hover:rotate-0 hover:-translate-y-1 transition-all duration-200`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="font-display font-extrabold text-5xl text-ink-700/30 leading-none"
                  aria-hidden
                >
                  {s.n}
                </span>
                <span className="text-4xl" aria-hidden>
                  {s.emoji}
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl text-ink-700 mt-4">
                {s.title}
              </h3>
              <p className="text-ink-700 mt-2 leading-relaxed">{s.body}</p>

              {/* Connector arrow between cards (desktop only) */}
              {i < STEPS.length - 1 && (
                <HandArrow
                  className="hidden md:block absolute -right-10 top-1/2 -translate-y-1/2 text-ink-400 z-10"
                  width={50}
                  rotate={-5}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
