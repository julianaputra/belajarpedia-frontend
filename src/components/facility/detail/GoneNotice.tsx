import Link from "next/link";

type Props = {
  category: "sekolah" | "universitas" | "kursus";
  parentHref: string;
};

/**
 * Rendered when a facility has `status = removed` (AC-03).
 *
 * Note: ideally this responds with HTTP 410. Next.js App Router doesn't expose
 * a built-in `gone()` helper, so we render this UI within the page handler and
 * pair it with `<meta robots="noindex">` via metadata. A middleware or
 * Route Handler could elevate the response status when richer 410 semantics
 * are needed (Phase 11+).
 */
export function GoneNotice({ category, parentHref }: Props) {
  const labels = {
    sekolah: "sekolah",
    universitas: "universitas",
    kursus: "kursus",
  } as const;

  return (
    <main className="mx-auto max-w-2xl px-5 py-20 text-center space-y-5">
      <p className="text-sm font-medium uppercase tracking-wider text-coral-500">
        410 — Gone
      </p>
      <h1 className="text-3xl sm:text-4xl text-ink-700">
        Fasilitas ini sudah tidak terdaftar
      </h1>
      <p className="text-muted text-lg">
        {`Halaman ${labels[category]} ini telah dihapus dari direktori Belajarpedia. Silakan jelajahi opsi lain di area yang sama.`}
      </p>
      <Link
        href={parentHref}
        className="inline-block text-brand-700 font-semibold hover:underline"
      >
        ← Kembali ke daftar
      </Link>
    </main>
  );
}
