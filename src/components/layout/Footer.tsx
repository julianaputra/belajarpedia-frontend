import Link from "next/link";
import { Check } from "lucide-react";

const CATEGORIES = [
  { href: "/sekolah", label: "Semua Sekolah" },
  { href: "/universitas", label: "Semua Universitas" },
  { href: "/kursus", label: "Semua Kursus" },
];

const POPULAR_REGIONS = [
  { href: "/sekolah/dki-jakarta", label: "Sekolah di Jakarta" },
  { href: "/sekolah/jawa-barat/kota-bandung", label: "Sekolah di Bandung" },
  { href: "/sekolah/bali/kota-denpasar", label: "Sekolah di Denpasar" },
  { href: "/universitas/dki-jakarta", label: "Universitas di Jakarta" },
  { href: "/universitas/bali", label: "Universitas di Bali" },
  { href: "/kursus/dki-jakarta", label: "Kursus di Jakarta" },
];

const FOR_OWNERS = [
  { href: "/submit-listing", label: "Daftarkan fasilitas" },
  { href: "/request-correction", label: "Perbaikan informasi" },
  { href: "/request-removal", label: "Permintaan penghapusan" },
];

const ABOUT = [
  { href: "/tentang", label: "Tentang Belajarpedia" },
  { href: "/privasi", label: "Kebijakan Privasi" },
  { href: "/syarat", label: "Syarat & Ketentuan" },
  { href: "/kontak", label: "Hubungi Kami" },
];

/**
 * Parent-targeted footer.
 *
 * Design goals:
 *   - Resource-rich: 4 columns of useful links so parents can navigate from
 *     anywhere on the site.
 *   - Trust-forward: prominent "no paid placement" + "verified data" notes.
 *   - Calm: thin dividers, generous spacing, restrained typography.
 */
export function Footer() {
  return (
    <footer className="mt-16 bg-[var(--color-surface-soft)] border-t border-ink-100">
      <div className="mx-auto max-w-6xl px-5 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Column 1 — Brand + trust */}
        <div className="lg:col-span-1">
          <Link
            href="/"
            className="inline-block font-semibold text-xl text-ink-700 hover:text-brand-700 transition-colors"
          >
            Belajar<span className="text-brand-600">pedia</span>
          </Link>
          <p className="mt-3 text-sm text-body leading-relaxed">
            Direktori sekolah, universitas, dan kursus terlengkap di Indonesia.
            Membantu ribuan keluarga mengambil keputusan pendidikan yang tepat.
          </p>

          <ul className="mt-5 space-y-2 text-xs text-muted">
            <li className="flex items-start gap-2">
              <Check size={14} aria-hidden className="text-brand-600 mt-0.5 flex-shrink-0" />
              <span>Data terverifikasi oleh tim editorial</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={14} aria-hidden className="text-brand-600 mt-0.5 flex-shrink-0" />
              <span>Tanpa iklan, tanpa pembayaran untuk peringkat</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={14} aria-hidden className="text-brand-600 mt-0.5 flex-shrink-0" />
              <span>Selalu gratis untuk orang tua &amp; siswa</span>
            </li>
          </ul>
        </div>

        {/* Column 2 — Jelajahi */}
        <FooterColumn title="Jelajahi" items={CATEGORIES} />

        {/* Column 3 — Populer */}
        <FooterColumn title="Wilayah Populer" items={POPULAR_REGIONS} />

        {/* Column 4 — Pemilik + Tentang (stacked) */}
        <div className="space-y-8">
          <FooterColumn title="Untuk Pemilik Fasilitas" items={FOR_OWNERS} />
          <FooterColumn title="Belajarpedia" items={ABOUT} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-100">
        <div className="mx-auto max-w-6xl px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} Belajarpedia. Dioperasikan oleh{" "}
            <a
              href="https://timedoor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-700 hover:text-brand-700 font-medium"
            >
              Timedoor
            </a>
            .
          </p>
          <p className="sm:text-right">
            Belajarpedia tidak menerima pembayaran untuk penempatan listing.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-700 mb-4">
        {title}
      </h2>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="text-sm text-body hover:text-brand-700 transition-colors"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
