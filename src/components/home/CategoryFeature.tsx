import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

type Tone = "brand" | "ink" | "sun";

type Props = {
  tone: Tone;
  emoji: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  children: React.ReactNode;
};

const toneText: Record<Tone, string> = {
  brand: "text-brand-700",
  ink: "text-ink-700",
  sun: "text-[#b58400]",
};
const toneButton: Record<Tone, "primary" | "secondary" | "sun"> = {
  brand: "primary",
  ink: "secondary",
  sun: "sun",
};

/**
 * Parent-targeted category feature.
 *
 * Restraint over flair: dropped sticker tags, big number watermarks, and
 * panel rotations from the previous design. Now reads like a calm magazine
 * section. Single decorative cue: small colored emoji icon.
 */
export function CategoryFeature({
  tone,
  emoji,
  eyebrow,
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  children,
}: Props) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:py-14">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7 sm:mb-9">
        <div>
          <p className={`text-sm font-semibold ${toneText[tone]} flex items-center gap-2`}>
            <span aria-hidden>{emoji}</span>
            <span className="uppercase tracking-wider">{eyebrow}</span>
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-700 mt-2 leading-tight max-w-2xl">
            {title}
          </h2>
          <p className="text-muted mt-2 max-w-2xl leading-relaxed">{subtitle}</p>
        </div>
        <Link
          href={ctaHref}
          className="text-brand-700 hover:underline font-semibold text-sm whitespace-nowrap"
        >
          Lihat semua →
        </Link>
      </header>

      {/* Content — children flow as siblings, no panel chrome */}
      <div className="space-y-7">{children}</div>

      {/* Bottom CTA — primary action for this category */}
      <div className="mt-8 flex justify-center sm:justify-start">
        <ButtonLink
          href={ctaHref}
          variant={toneButton[tone]}
          size="md"
          className="w-full sm:w-auto justify-center"
        >
          {ctaLabel} →
        </ButtonLink>
      </div>
    </section>
  );
}

/** Slim panel wrapper for grouping related controls (filter, etc.) */
export function Panel({
  children,
  title,
  hint,
}: {
  children: React.ReactNode;
  title?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-ink-100 p-5 sm:p-6">
      {(title || hint) && (
        <div className="mb-4">
          {title && (
            <h3 className="font-semibold text-ink-700 text-base sm:text-lg">
              {title}
            </h3>
          )}
          {hint && <p className="text-xs sm:text-sm text-muted mt-1">{hint}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

/** Section sub-heading used inside category content */
export function Subhead({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-4">
      <h3 className="font-semibold text-ink-700 text-lg">{children}</h3>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}
