"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Heart, LogOut, User } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/lib/api/auth.client";

export function UserMenu() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, mutate } = useCurrentUser();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (isLoading) {
    return (
      <div className="h-9 w-24 rounded-[var(--radius)] bg-ink-100 animate-pulse" aria-hidden />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <ButtonLink href="/login" variant="ghost" size="sm">
          Login
        </ButtonLink>
        <ButtonLink href="/register" variant="primary" size="sm">
          Daftar
        </ButtonLink>
      </div>
    );
  }

  const initials = (user.name ?? user.email ?? "?")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 sm:px-3 h-9 rounded-[var(--radius)] hover:bg-brand-50 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="w-8 h-8 rounded-full bg-brand-500 text-white grid place-items-center text-sm font-bold">
          {initials || "U"}
        </span>
        <span className="hidden sm:inline text-sm font-semibold text-ink-700">
          {user.name?.split(" ")[0] ?? "Akun"}
        </span>
        <ChevronDown size={14} aria-hidden className="text-ink-500" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-[var(--radius-lg)] bg-white border-2 border-ink-100 shadow-[var(--shadow-lift)] p-1.5 z-50 animate-[var(--animate-bounce-in)]"
        >
          <div className="px-3 py-2 border-b border-ink-100">
            <p className="text-sm font-semibold text-ink-700 truncate">
              {user.name ?? "Akun saya"}
            </p>
            <p className="text-xs text-muted truncate">{user.email}</p>
          </div>
          <MenuItem href="/profile" onClick={() => setOpen(false)}>
            <User size={16} aria-hidden /> Profil
          </MenuItem>
          <MenuItem href="/favorites" onClick={() => setOpen(false)}>
            <Heart size={16} aria-hidden /> Favorit saya
          </MenuItem>
          <button
            role="menuitem"
            type="button"
            className="w-full text-left px-3 py-2 rounded-[var(--radius)] text-sm font-semibold text-coral-500 hover:bg-coral-400/10 inline-flex items-center gap-2"
            onClick={async () => {
              setOpen(false);
              await logout();
              await mutate();
              router.push("/");
            }}
          >
            <LogOut size={16} aria-hidden /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      role="menuitem"
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-sm font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-700"
    >
      {children}
    </Link>
  );
}
