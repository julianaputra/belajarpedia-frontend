"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, School, Sparkles, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const NAV: Array<{ href: string; label: string; Icon: LucideIcon }> = [
  { href: "/sekolah", label: "Sekolah", Icon: School },
  { href: "/universitas", label: "Universitas", Icon: GraduationCap },
  { href: "/kursus", label: "Kursus", Icon: Sparkles },
];

function useActiveMatcher() {
  const pathname = usePathname() ?? "/";
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const isActive = useActiveMatcher();
  return (
    <nav
      aria-label="Navigasi utama"
      className="hidden md:flex items-center justify-center gap-1"
    >
      {NAV.map((n) => {
        const active = isActive(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium",
              "transition-colors duration-150",
              active
                ? "text-brand-700 bg-brand-50"
                : "text-ink-600 hover:text-ink-800 hover:bg-ink-50",
            )}
          >
            <n.Icon size={16} aria-hidden className={active ? "text-brand-600" : "text-ink-400"} />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileTabNav() {
  const isActive = useActiveMatcher();
  return (
    <nav
      aria-label="Kategori"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-ink-100 bg-white/95 backdrop-blur-md shadow-[0_-2px_8px_-2px_rgb(28_47_112_/_0.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto max-w-6xl px-2 flex">
        {NAV.map((n) => {
          const active = isActive(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-2",
                "relative text-[11px] font-semibold transition-colors",
                active ? "text-brand-700" : "text-ink-500 hover:text-brand-700",
              )}
            >
              <n.Icon
                size={18}
                aria-hidden
                className={active ? "text-brand-600" : "text-ink-400"}
              />
              {n.label}
              {active && (
                <span
                  aria-hidden
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-brand-600"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
