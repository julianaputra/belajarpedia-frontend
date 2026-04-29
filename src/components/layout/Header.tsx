import Link from "next/link";
import { UserMenu } from "@/components/layout/UserMenu";

const NAV = [
  { href: "/sekolah", label: "Sekolah" },
  { href: "/universitas", label: "Universitas" },
  { href: "/kursus", label: "Kursus" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-ink-100">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center gap-6">
        <Link
          href="/"
          className="font-display font-extrabold text-xl text-ink-700 hover:text-brand-600 transition-colors"
        >
          Belajar<span className="text-brand-500">pedia</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1 ml-2">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-2 rounded-[var(--radius)] text-sm font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
