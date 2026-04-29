import { ButtonLink } from "@/components/ui/Button";
import {
  CircleScribble,
  StarBurst,
  WavyUnderline,
} from "@/components/decorations/Decorations";

type Tone = "brand" | "ink" | "sun";

type Props = {
  tone: Tone;
  emoji: string;
  eyebrow: string;
  /** Section number e.g. "01". Watermark on desktop. */
  number: string;
  title: React.ReactNode;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  children: React.ReactNode;
};

const toneStickerBg: Record<Tone, string> = {
  brand: "bg-brand-100 border-brand-700 text-brand-800",
  ink: "bg-ink-100 border-ink-700 text-ink-800",
  sun: "bg-sun-400 border-ink-900 text-ink-900",
};
const toneButtonVariant: Record<Tone, "primary" | "secondary" | "sun"> = {
  brand: "primary",
  ink: "secondary",
  sun: "sun",
};
const toneAccent: Record<Tone, string> = {
  brand: "text-brand-300",
  ink: "text-ink-200",
  sun: "text-sun-400",
};

export function CategoryFeature({
  tone,
  emoji,
  eyebrow,
  number,
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  children,
}: Props) {
  return (
    <section className="relative py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 space-y-7 sm:space-y-9">
        {/* HEADER — mobile-first single column. Number watermark only on lg+. */}
        <header className="relative space-y-3 sm:space-y-4 animate-[var(--animate-fade-up)]">
          {/* Watermark number — desktop only, doesn't affect layout */}
          <span
            aria-hidden
            className={`hidden lg:block absolute -top-6 right-0 font-display font-extrabold text-[10rem] leading-none ${toneAccent[tone]} opacity-40 select-none`}
          >
            {number}
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`fx-sticker ${toneStickerBg[tone]} fx-stick-rot-l-soft`}
            >
              {emoji} {eyebrow}
            </span>
            <span className="lg:hidden font-display font-extrabold text-2xl text-ink-200 leading-none">
              {number}
            </span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink-700 leading-[1.1] max-w-3xl">
            {title}
          </h2>

          <p className="text-base sm:text-lg text-ink-600 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </header>

        {/* CONTENT — children flow naturally, no rotation, no overflow */}
        <div className="space-y-5 sm:space-y-6">{children}</div>

        {/* BOTTOM CTA — full width on mobile */}
        <div className="flex justify-center sm:justify-start pt-2">
          <ButtonLink
            href={ctaHref}
            variant={toneButtonVariant[tone]}
            size="lg"
            className="w-full sm:w-auto justify-center"
          >
            {ctaLabel} →
          </ButtonLink>
        </div>
      </div>

      {/* Subtle decorative accent — pure flair, mobile-safe (positioned outside viewport overflow) */}
      {tone === "brand" && (
        <CircleScribble
          aria-hidden
          className="hidden xl:block absolute top-10 -right-8 text-brand-200 opacity-60 pointer-events-none fx-burst"
          size={110}
        />
      )}
      {tone === "sun" && (
        <StarBurst
          aria-hidden
          className="hidden xl:block absolute top-12 right-12 text-coral-400 fx-burst pointer-events-none"
          size={32}
        />
      )}
    </section>
  );
}

/** Subhead helper — handwritten Caveat label for sub-sections inside content. */
type SubheadProps = {
  children: React.ReactNode;
  hand?: string;
  /** Visual rotation on the handwritten note. */
  tilt?: -2 | -1 | 0 | 1 | 2;
};

export function Subhead({ children, hand, tilt = -1 }: SubheadProps) {
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <h3 className="font-display font-bold text-lg sm:text-xl text-ink-700">
        {children}
      </h3>
      {hand && (
        <span
          className="fx-hand text-lg sm:text-xl text-brand-600 inline-block"
          style={{ transform: `rotate(${tilt}deg)` }}
        >
          {hand}
        </span>
      )}
    </div>
  );
}

/** Helper: wraps content in a clean white panel — mobile-friendly */
type PanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function Panel({ children, className }: PanelProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] bg-white border-2 border-ink-100 p-5 sm:p-6 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}

/** Helpers for in-headline emphasis (used by page.tsx). */
export function H({ children }: { children: React.ReactNode }) {
  return <span className="fx-highlight">{children}</span>;
}

export function W({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <WavyUnderline
        className="absolute -bottom-1.5 left-0 text-brand-500 w-full"
        width={250}
        stroke={4}
      />
    </span>
  );
}
