import Link from "next/link";

type Category = "sekolah" | "universitas" | "kursus";

type Props = {
  category: Category;
  query: string;
};

const CATEGORY_LABEL: Record<Category, string> = {
  sekolah: "Sekolah",
  universitas: "Universitas",
  kursus: "Kursus",
};

const CATEGORY_LABEL_LOWER: Record<Category, string> = {
  sekolah: "sekolah",
  universitas: "universitas",
  kursus: "kursus",
};

const TIPS = [
  "Coba kata kunci yang lebih umum, misalnya nama kota atau jenis program.",
  "Periksa ejaan kata kunci.",
  "Gunakan satu atau dua kata saja, hindari kalimat panjang.",
];

/**
 * Empty state for "no results found". Suggests:
 * - Refining keywords (tips list)
 * - Searching the same query in OTHER categories (cross-category)
 * - Browsing the full category list (escape hatch)
 */
export function SearchEmptyState({ category, query }: Props) {
  const otherCategories = (
    ["sekolah", "universitas", "kursus"] as Category[]
  ).filter((c) => c !== category);

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-lg)] bg-white border-2 border-dashed border-ink-200 p-6 sm:p-8 text-center space-y-4">
        <div className="text-4xl" aria-hidden>
          🔍
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-ink-700">
            Tidak ada hasil untuk &ldquo;{query}&rdquo;
          </h2>
          <p className="text-muted">
            Belum ada {CATEGORY_LABEL_LOWER[category]} yang cocok dengan kata
            kunci tersebut.
          </p>
        </div>

        <ul className="text-sm text-body text-left max-w-md mx-auto space-y-1.5 list-disc list-inside">
          {TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      {/* Cross-category */}
      <div className="rounded-[var(--radius-lg)] bg-brand-50 border-2 border-brand-200 p-5 sm:p-6 space-y-3">
        <h3 className="font-bold text-ink-700">
          Coba cari &ldquo;{query}&rdquo; di kategori lain
        </h3>
        <div className="flex flex-wrap gap-2">
          {otherCategories.map((c) => (
            <Link
              key={c}
              href={`/${c}/search?q=${encodeURIComponent(query)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-brand-300 text-brand-800 font-semibold text-sm hover:bg-brand-100 hover:-translate-y-0.5 transition-all"
            >
              {iconFor(c)} {CATEGORY_LABEL[c]} →
            </Link>
          ))}
        </div>
      </div>

      {/* Escape hatch */}
      <div className="text-center">
        <Link
          href={`/${category}`}
          className="text-brand-700 hover:underline font-semibold"
        >
          Atau lihat semua {CATEGORY_LABEL_LOWER[category]} →
        </Link>
      </div>
    </div>
  );
}

function iconFor(c: Category): string {
  return c === "sekolah" ? "🏫" : c === "universitas" ? "🎓" : "🚀";
}
