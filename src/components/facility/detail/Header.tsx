import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { components } from "@/types/api";

const PLACEHOLDER = "/placeholder-facility.svg";

type Props = {
  facility: components["schemas"]["FacilityBase"];
  /** Tagline below the heading, e.g. "Sekolah Negeri • Kab. Badung, Bali". */
  subtitle?: string;
};

export function DetailHeader({ facility, subtitle }: Props) {
  const name = facility.name ?? "";
  const image = facility.image_main_url ?? PLACEHOLDER;
  const isTimedoor = facility.is_timedoor_academy === true;

  return (
    <header className="space-y-5 animate-[var(--animate-fade-up)]">
      <div className="relative aspect-[16/9] sm:aspect-[16/6] rounded-[var(--radius-lg)] overflow-hidden bg-gradient-to-br from-brand-100 to-ink-100">
        <Image
          src={image}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
        {isTimedoor && (
          <Badge
            tone="sun"
            className="absolute top-4 left-4 shadow-[0_2px_0_0_#cc9a06]"
          >
            ⭐ Featured Partner
          </Badge>
        )}
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl text-ink-700">{name}</h1>
        {subtitle && <p className="text-muted text-base">{subtitle}</p>}
      </div>
    </header>
  );
}
