"use client";

import * as React from "react";
import {
  Check,
  Link2,
  Mail,
  MessageCircle,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Props = {
  /** Page title — used as native share title and in the WhatsApp/email body. */
  title: string;
  /** Absolute URL to share. Falls back to window.location.href at click time. */
  url?: string;
};

/**
 * Share control with progressive enhancement:
 *  - Native `navigator.share` when available (mostly mobile/PWA).
 *  - Falls back to an inline menu with Copy link / WhatsApp / Email.
 *
 * Doesn't require auth — anyone can share a facility URL.
 */
export function ShareButton({ title, url }: Props) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const resolveUrl = () =>
    url ?? (typeof window !== "undefined" ? window.location.href : "");

  const handleClick = async () => {
    const shareUrl = resolveUrl();
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch (e) {
        // User cancelled — silently do nothing.
        if ((e as Error).name === "AbortError") return;
        // Other failure — fall through to the menu.
      }
    }
    setOpen((v) => !v);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(resolveUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — leave the menu open so user can select & copy manually.
    }
  };

  const shareUrl = resolveUrl();
  const waHref = `https://wa.me/?text=${encodeURIComponent(`${title}\n${shareUrl}`)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n${shareUrl}`)}`;

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleClick}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Share2 size={18} aria-hidden /> Bagikan
      </Button>

      {open && (
        <div
          role="menu"
          aria-label="Pilihan berbagi"
          className="absolute left-0 right-0 top-full mt-2 z-30 rounded-xl bg-white border border-ink-100 shadow-[0_8px_24px_-8px_rgb(28_47_112/0.18)] overflow-hidden"
        >
          <MenuItem
            onClick={copy}
            icon={
              copied ? (
                <Check size={16} className="text-brand-600" aria-hidden />
              ) : (
                <Link2 size={16} aria-hidden />
              )
            }
          >
            {copied ? "Tersalin" : "Salin tautan"}
          </MenuItem>
          <MenuItemLink
            href={waHref}
            external
            onActivate={() => setOpen(false)}
            icon={<MessageCircle size={16} aria-hidden />}
          >
            WhatsApp
          </MenuItemLink>
          <MenuItemLink
            href={mailHref}
            onActivate={() => setOpen(false)}
            icon={<Mail size={16} aria-hidden />}
          >
            Email
          </MenuItemLink>
        </div>
      )}
    </div>
  );
}

const itemBaseClass = cn(
  "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 text-left",
  "hover:bg-ink-50 focus-visible:outline-none focus-visible:bg-ink-50",
  "transition-colors",
);

function MenuItem({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={itemBaseClass}
    >
      <span className="text-ink-500 shrink-0">{icon}</span>
      <span className="flex-1">{children}</span>
    </button>
  );
}

function MenuItemLink({
  href,
  external,
  onActivate,
  icon,
  children,
}: {
  href: string;
  external?: boolean;
  onActivate: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const targetProps = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  return (
    <a
      href={href}
      role="menuitem"
      onClick={onActivate}
      className={itemBaseClass}
      {...targetProps}
    >
      <span className="text-ink-500 shrink-0">{icon}</span>
      <span className="flex-1">{children}</span>
    </a>
  );
}
