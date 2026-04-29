import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

type Props = {
  category: "sekolah" | "universitas" | "kursus";
  parentHref: string;
};

const LABELS: Record<Props["category"], string> = {
  sekolah: "sekolah",
  universitas: "universitas",
  kursus: "kursus",
};

/**
 * Rendered when a facility has `status = removed` (AC-03). Calm parent-style
 * empty state — clear status, clear escape route.
 */
export function GoneNotice({ category, parentHref }: Props) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-20 text-center space-y-5">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coral-400/15 text-coral-500">
        <AlertCircle size={32} aria-hidden />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-coral-500">
        410 — Tidak tersedia
      </p>
      <h1 className="text-2xl sm:text-3xl font-semibold text-ink-700">
        Fasilitas ini sudah tidak terdaftar
      </h1>
      <p className="text-muted text-base sm:text-lg leading-relaxed">
        Halaman {LABELS[category]} ini telah dihapus dari direktori. Silakan
        jelajahi opsi lain di area yang sama.
      </p>
      <Link
        href={parentHref}
        className="inline-flex items-center gap-2 text-brand-700 font-semibold hover:underline"
      >
        <ArrowLeft size={16} aria-hidden />
        Kembali ke daftar
      </Link>
    </main>
  );
}
