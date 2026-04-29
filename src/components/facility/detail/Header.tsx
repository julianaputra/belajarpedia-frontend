import Image from "next/image";
import { Star } from "lucide-react";
import type { components } from "@/types/api";

const PLACEHOLDER = "/placeholder-facility.svg";

type Props = {
  facility: components["schemas"]["FacilityBase"];
  /** Tagline below the heading, e.g. "Sekolah Negeri • Kab. Badung, Bali". */
  subtitle?: string;
};

/**
 * Detail page header — calm, parent-targeted.
 *
 * Drops the sticker tape treatment in favor of a clean filled chip for the
 * Featured Partner cue.
 */
export function DetailHeader({ facility, subtitle }: Props) {
  const name = facility.name ?? "";
  const image = facility.image_main_url ?? PLACEHOLDER;
  const isTimedoor = facility.is_timedoor_academy === true;

  return (
    <header className="space-y-5">
      <div className="relative aspect-[16/9] sm:aspect-[16/6] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-50 to-ink-50 border border-ink-100">
        <Image
          src={image}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
        {isTimedoor && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sun-400 text-ink-900 text-xs font-semibold shadow-[0_4px_10px_-2px_rgb(28_47_112_/_0.25)]">
            <Star size={13} fill="currentColor" aria-hidden />
            Featured Partner
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-700 leading-tight">
          {name}
        </h1>
        {subtitle && <p className="text-muted text-base">{subtitle}</p>}
      </div>
    </header>
  );
}
