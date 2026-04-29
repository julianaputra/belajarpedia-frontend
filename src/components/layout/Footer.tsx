import Link from "next/link";

const FOR_OWNERS = [
  { href: "/submit-listing", label: "Daftarkan fasilitas Anda" },
  { href: "/request-correction", label: "Perbaikan informasi" },
  { href: "/request-removal", label: "Permintaan penghapusan" },
];

const ABOUT = [
  { href: "/tentang", label: "Tentang Belajarpedia" },
  { href: "/privasi", label: "Kebijakan Privasi" },
  { href: "/kontak", label: "Kontak" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-ink-100 bg-[var(--color-surface-soft)]">
      <div className="mx-auto max-w-6xl px-5 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <Link
            href="/"
            className="font-display font-extrabold text-xl text-ink-700"
          >
            Belajar<span className="text-brand-500">pedia</span>
          </Link>
          <p className="mt-2 text-sm text-muted">
            Direktori sekolah, universitas, dan kursus di seluruh Indonesia.
            Dioperasikan oleh Timedoor.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-ink-700 mb-3">
            Untuk Pemilik Fasilitas
          </h2>
          <ul className="space-y-1.5">
            {FOR_OWNERS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-body hover:text-brand-700"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-ink-700 mb-3">Belajarpedia</h2>
          <ul className="space-y-1.5">
            {ABOUT.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-body hover:text-brand-700"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-100 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Belajarpedia. Belajarpedia tidak menerima pembayaran untuk penempatan listing.
      </div>
    </footer>
  );
}
