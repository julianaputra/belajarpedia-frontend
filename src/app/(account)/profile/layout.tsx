"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Baby, KeyRound, AlertOctagon, type LucideIcon } from "lucide-react";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
  exact?: boolean;
  danger?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/profile", label: "Informasi Akun", Icon: User, exact: true },
  { href: "/profile/children", label: "Anak-anak", Icon: Baby },
  { href: "/profile/password", label: "Ubah Password", Icon: KeyRound },
  {
    href: "/profile/danger",
    label: "Zona Berbahaya",
    Icon: AlertOctagon,
    danger: true,
  },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useCurrentUser();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?returnTo=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-5 py-5 sm:py-10 text-sm sm:text-base text-muted">
        Memuat profil…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-5 py-5 sm:py-10 space-y-4 sm:space-y-8">
      <header className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-4xl text-ink-700">Akun Saya</h1>
        <p className="text-sm sm:text-base text-muted">
          {user.email}{" "}
          {user.email_verified_at ? (
            <span className="text-brand-700 font-semibold">✓ Terverifikasi</span>
          ) : (
            <span className="text-coral-500 font-semibold">
              Belum diverifikasi
            </span>
          )}
        </p>
      </header>

      <div className="grid gap-4 sm:gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav aria-label="Navigasi profil">
            <ul className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              {NAV_ITEMS.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);
                return (
                  <li key={item.href} className="shrink-0 lg:shrink lg:w-full">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors lg:whitespace-normal",
                        active
                          ? item.danger
                            ? "bg-coral-400/10 text-coral-500"
                            : "bg-brand-50 text-brand-700"
                          : item.danger
                            ? "text-coral-500 hover:bg-coral-400/5"
                            : "text-ink-600 hover:bg-ink-50 hover:text-ink-700",
                      )}
                    >
                      <item.Icon size={16} aria-hidden className="shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
