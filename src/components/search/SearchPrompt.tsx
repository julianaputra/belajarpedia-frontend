import Link from "next/link";

type Category = "sekolah" | "universitas" | "kursus";

type Props = {
  category: Category;
};

const CATEGORY_LABEL: Record<Category, string> = {
  sekolah: "Sekolah",
  universitas: "Universitas",
  kursus: "Kursus",
};

const POPULAR: Record<Category, { label: string; q: string }[]> = {
  sekolah: [
    { label: "Negeri Jakarta", q: "negeri jakarta" },
    { label: "Swasta Bali", q: "swasta bali" },
    { label: "Internasional", q: "internasional" },
    { label: "SMA Bandung", q: "sma bandung" },
  ],
  universitas: [
    { label: "Informatika", q: "informatika" },
    { label: "Kedokteran", q: "kedokteran" },
    { label: "Manajemen", q: "manajemen" },
    { label: "Universitas Bali", q: "universitas bali" },
  ],
  kursus: [
    { label: "Coding", q: "coding" },
    { label: "Bahasa Inggris", q: "bahasa inggris" },
    { label: "Matematika", q: "matematika" },
    { label: "Musik", q: "musik" },
  ],
};

/**
 * Shown when user lands on /{category}/search without a query parameter.
 * Invites them to search and seeds with popular keywords for the category.
 */
export function SearchPrompt({ category }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-lg)] bg-white border-2 border-ink-100 p-6 sm:p-8 text-center space-y-3">
        <div className="text-4xl" aria-hidden>
          🔍
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-ink-700">
          Cari di {CATEGORY_LABEL[category]}
        </h2>
        <p className="text-muted">
          Ketik kata kunci di atas untuk mulai mencari.
        </p>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-brand-50 border-2 border-brand-200 p-5 sm:p-6 space-y-3">
        <h3 className="font-bold text-ink-700">
          🔥 Pencarian populer di {CATEGORY_LABEL[category]}
        </h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR[category].map((p) => (
            <Link
              key={p.q}
              href={`/${category}/search?q=${encodeURIComponent(p.q)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-brand-300 text-brand-800 font-semibold text-sm hover:bg-brand-100 hover:-translate-y-0.5 transition-all"
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
