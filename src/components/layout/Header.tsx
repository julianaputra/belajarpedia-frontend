import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { DesktopNav } from "@/components/layout/NavLinks";
import { UserMenu } from "@/components/layout/UserMenu";

/**
 * Sticky site header.
 * - Desktop: logo (left) | nav links | user menu (right)
 * - Mobile: only logo + user menu — the nav strip lives at the bottom of the
 *   viewport (see `<MobileTabNav />` in the root layout) for thumb-reach.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-ink-100 shadow-[0_1px_0_0_rgb(28_47_112_/_0.04)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 h-16 grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] items-center gap-4">
        <Link
          href="/"
          aria-label="Belajarpedia — beranda"
          className="group inline-flex items-center gap-2 whitespace-nowrap justify-self-start"
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-[0_2px_8px_-2px_rgb(16_175_19_/_0.5)] transition-transform group-hover:-rotate-6"
          >
            <GraduationCap size={18} strokeWidth={2.25} />
          </span>
          <span className="font-semibold text-lg sm:text-xl text-ink-700 group-hover:text-brand-700 transition-colors">
            Belajar<span className="text-brand-600">pedia</span>
          </span>
        </Link>

        <DesktopNav />

        <div className="flex items-center justify-self-end">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
