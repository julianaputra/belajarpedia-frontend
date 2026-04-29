import { Reveal, RevealItem } from "@/components/Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead?: string;
};

export function PageHero({ eyebrow, title, lead }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 fx-grid-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-brand-100 opacity-40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-8 right-6 sm:right-16 w-40 h-40 rounded-full bg-sun-400 opacity-20 blur-2xl"
      />

      <Reveal
        className="relative mx-auto max-w-3xl px-4 sm:px-5 py-12 sm:py-20 text-center space-y-3 sm:space-y-4"
        once
        stagger={0.08}
      >
        <RevealItem>
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-700">
            <span aria-hidden className="h-px w-5 bg-brand-300" />
            {eyebrow}
            <span aria-hidden className="h-px w-5 bg-brand-300" />
          </p>
        </RevealItem>
        <RevealItem>
          <h1 className="text-3xl sm:text-5xl font-semibold text-ink-700 leading-tight tracking-tight">
            {title}
          </h1>
        </RevealItem>
        {lead ? (
          <RevealItem>
            <p className="text-sm sm:text-lg text-ink-600 leading-relaxed max-w-2xl mx-auto">
              {lead}
            </p>
          </RevealItem>
        ) : null}
      </Reveal>
    </section>
  );
}
