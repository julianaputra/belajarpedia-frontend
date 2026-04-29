import Link from "next/link";
import { UserMenu } from "@/components/layout/UserMenu";

const NAV = [
  { href: "/sekolah", label: "Sekolah" },
  { href: "/universitas", label: "Universitas" },
  { href: "/kursus", label: "Kursus" },
];

/**
 * Header layout: logo left, nav links + profile right.
 * On mobile the nav drops to a secondary strip below the bar so categories
 * stay reachable without crowding the top row.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ink-100 shadow-[0_1px_0_0_rgb(28_47_112_/_0.04)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 h-16 flex items-center justify-between gap-4">
        {/* Left — logo */}
        <Link
          href="/"
          className="font-bold text-lg sm:text-xl text-ink-700 hover:text-brand-700 transition-colors whitespace-nowrap"
          aria-label="Belajarpedia — beranda"
        >
          Belajar<span className="text-brand-600">pedia</span>
        </Link>

        {/* Right — nav + profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-0.5"
          >
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-ink-600 hover:text-ink-800 hover:bg-ink-50 transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <UserMenu />
        </div>
      </div>

      {/* Mobile-only secondary nav strip */}
      <nav
        aria-label="Kategori"
        className="md:hidden border-t border-ink-100 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex-1 py-2.5 text-center text-xs font-semibold text-ink-600 hover:text-brand-700 hover:bg-brand-50 transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
