import Link from "next/link";
import { Flame, Search } from "lucide-react";

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

export function SearchPrompt({ category }: Props) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white border border-ink-100 p-6 sm:p-8 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink-50 text-ink-500">
          <Search size={24} aria-hidden />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-ink-700">
          Cari di {CATEGORY_LABEL[category]}
        </h2>
        <p className="text-muted">
          Ketik kata kunci di atas untuk mulai mencari.
        </p>
      </div>

      <div className="rounded-2xl bg-brand-50 border border-brand-200 p-5 sm:p-6 space-y-3">
        <h3 className="font-semibold text-ink-700 inline-flex items-center gap-2">
          <Flame size={16} className="text-coral-500" aria-hidden />
          Pencarian populer di {CATEGORY_LABEL[category]}
        </h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR[category].map((p) => (
            <Link
              key={p.q}
              href={`/${category}/search?q=${encodeURIComponent(p.q)}`}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-brand-200 text-brand-800 font-medium text-sm hover:bg-brand-100 hover:border-brand-300 transition-colors"
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
