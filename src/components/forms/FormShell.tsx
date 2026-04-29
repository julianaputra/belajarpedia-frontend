import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

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
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-700 inline-flex items-center gap-2">
          <span aria-hidden>{emoji}</span> {eyebrow}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-700 leading-tight">
          {title}
        </h1>
        <p className="text-muted leading-relaxed">{subtitle}</p>
      </header>
      <div className="rounded-2xl bg-white border border-ink-100 p-5 sm:p-7 shadow-[0_10px_30px_-10px_rgb(28_47_112_/_0.15)]">
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
    <div className="rounded-2xl bg-brand-50 border border-brand-200 p-6 sm:p-8 space-y-4 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-100 text-brand-700">
        <CheckCircle2 size={28} aria-hidden />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-ink-700">{title}</h2>
      <p className="text-body leading-relaxed">{body}</p>
      <p className="text-sm text-muted">
        Tim Belajarpedia akan review permintaanmu dan menghubungi via email.
      </p>
      <Link
        href={homeHref}
        className="inline-flex items-center gap-1.5 mt-2 text-brand-700 hover:underline font-semibold"
      >
        <ArrowLeft size={14} aria-hidden /> Kembali ke beranda
      </Link>
    </div>
  );
}
