import Link from "next/link";

/**
 * Quick-access cards by jenjang pendidikan. For parents who already know
 * the level they're looking for. One click → filtered list.
 *
 * Note: SD/SMP/SMA filtering happens via API name search (no dedicated
 * jenjang filter in spec). For now we link to the search endpoint; backend
 * can add a `jenjang` query later for stricter filtering.
 */

const JENJANG = [
  {
    label: "SD",
    sublabel: "Sekolah Dasar",
    href: "/sekolah/search?q=SD",
    color: "bg-brand-50 text-brand-800 border-brand-200",
  },
  {
    label: "SMP",
    sublabel: "Menengah Pertama",
    href: "/sekolah/search?q=SMP",
    color: "bg-ink-50 text-ink-800 border-ink-200",
  },
  {
    label: "SMA / SMK",
    sublabel: "Menengah Atas",
    href: "/sekolah/search?q=SMA",
    color: "bg-brand-50 text-brand-800 border-brand-200",
  },
  {
    label: "Universitas",
    sublabel: "S1, D3, D4",
    href: "/universitas",
    color: "bg-ink-50 text-ink-800 border-ink-200",
  },
  {
    label: "Kursus",
    sublabel: "Semua jenjang",
    href: "/kursus",
    color: "bg-brand-50 text-brand-800 border-brand-200",
  },
];

export function JenjangFilter() {
  return (
    <section
      aria-labelledby="jenjang-heading"
      className="mx-auto max-w-6xl px-4 sm:px-5 py-8 sm:py-14"
    >
      <div className="mb-4 sm:mb-8">
        <h2
          id="jenjang-heading"
          className="text-xl sm:text-3xl font-semibold text-ink-700 flex items-center gap-2"
        >
          <span aria-hidden className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />
          Mulai dari jenjang pendidikan
        </h2>
        <p className="text-sm sm:text-base text-muted mt-1 pl-4">
          Pilih sesuai usia anak Anda untuk hasil paling relevan.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {JENJANG.map((j) => (
          <Link
            key={j.label}
            href={j.href}
            className={`block rounded-xl border-2 ${j.color} p-3 sm:p-5 transition-transform hover:-translate-y-1 hover:shadow-[0_8px_20px_-10px_rgb(28_47_112_/_0.25)]`}
          >
            <div className="font-semibold text-base sm:text-xl">{j.label}</div>
            <div className="text-xs sm:text-sm opacity-80 mt-0.5">
              {j.sublabel}
            </div>
            <div className="text-xs font-semibold mt-2 sm:mt-3 opacity-70 group-hover:opacity-100">
              Cari →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
