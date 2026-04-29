import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  School,
  SearchX,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

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

const CATEGORY_ICON: Record<Category, LucideIcon> = {
  sekolah: School,
  universitas: GraduationCap,
  kursus: Sparkles,
};

const TIPS = [
  "Coba kata kunci yang lebih umum, misalnya nama kota atau jenis program.",
  "Periksa ejaan kata kunci.",
  "Gunakan satu atau dua kata saja, hindari kalimat panjang.",
];

export function SearchEmptyState({ category, query }: Props) {
  const otherCategories = (
    ["sekolah", "universitas", "kursus"] as Category[]
  ).filter((c) => c !== category);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white border border-dashed border-ink-200 p-6 sm:p-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink-50 text-ink-500">
          <SearchX size={24} aria-hidden />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-ink-700">
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

      <div className="rounded-2xl bg-brand-50 border border-brand-200 p-5 sm:p-6 space-y-3">
        <h3 className="font-semibold text-ink-700">
          Coba cari &ldquo;{query}&rdquo; di kategori lain
        </h3>
        <div className="flex flex-wrap gap-2">
          {otherCategories.map((c) => {
            const Icon = CATEGORY_ICON[c];
            return (
              <Link
                key={c}
                href={`/${c}/search?q=${encodeURIComponent(query)}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-brand-200 text-brand-800 font-medium text-sm hover:bg-brand-100 hover:border-brand-300 transition-colors"
              >
                <Icon size={14} aria-hidden /> {CATEGORY_LABEL[c]}
                <ArrowRight size={14} aria-hidden />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <Link
          href={`/${category}`}
          className="inline-flex items-center gap-1.5 text-brand-700 hover:underline font-semibold"
        >
          Atau lihat semua {CATEGORY_LABEL_LOWER[category]}
          <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
