import * as React from "react";
import Link from "next/link";

type ShellProps = {
  emoji: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
};

export function FormShell({ emoji, eyebrow, title, subtitle, children }: ShellProps) {
  return (
    <>
      <header className="space-y-3 text-center sm:text-left">
        <span className="fx-sticker fx-stick-rot-l-soft bg-brand-100 border-brand-700 text-brand-800">
          {emoji} {eyebrow}
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink-700 leading-tight">
          {title}
        </h1>
        <p className="text-muted">{subtitle}</p>
      </header>
      <div className="rounded-[var(--radius-lg)] bg-white border-2 border-ink-100 p-5 sm:p-7 shadow-[var(--shadow-lift)]">
        {children}
      </div>
    </>
  );
}

type SuccessProps = {
  title: string;
  body: string;
  homeHref?: string;
};

export function FormSuccess({ title, body, homeHref = "/" }: SuccessProps) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-brand-50 border-2 border-brand-300 p-6 sm:p-8 space-y-4 text-center animate-[var(--animate-bounce-in)]">
      <div className="text-5xl" aria-hidden>
        ✅
      </div>
      <h2 className="font-display font-extrabold text-2xl text-ink-700">{title}</h2>
      <p className="text-body">{body}</p>
      <p className="text-sm text-muted">
        Tim Belajarpedia akan review permintaanmu dan menghubungi via email.
      </p>
      <Link
        href={homeHref}
        className="inline-block mt-2 text-brand-700 hover:underline font-semibold"
      >
        ← Kembali ke beranda
      </Link>
    </div>
  );
}
