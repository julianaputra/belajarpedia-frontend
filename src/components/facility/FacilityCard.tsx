import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/Card";
import type { FacilityCard as FacilityCardData } from "@/lib/api/facilities";

const PLACEHOLDER = "/placeholder-facility.svg";

type Props = {
  facility: FacilityCardData;
  className?: string;
};

/**
 * Facility card — name + kabkota + image only (AC-05).
 *
 * Calm, parent-targeted styling:
 *   - No bounce-in or stagger animation
 *   - Subtle hover lift via shadow only (no translate)
 *   - Featured Partner shows as a small filled chip with Lucide Star
 */
export function FacilityCard({ facility, className }: Props) {
  const href = facility.url ?? "#";
  const name = facility.name ?? "Tanpa nama";
  const kabkota = facility.kabkota_name ?? "";
  const imageSrc = facility.image_main_url ?? PLACEHOLDER;
  const isTimedoor = facility.is_timedoor_academy === true;

  return (
    <Link
      href={href}
      className={cn(
        "block focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 rounded-lg sm:rounded-2xl",
        className,
      )}
    >
      <Card interactive className="h-full overflow-hidden rounded-lg sm:rounded-2xl">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-50 to-ink-50">
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
          {isTimedoor && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-sun-400 text-ink-900 text-[10px] sm:text-xs font-semibold shadow-[0_2px_6px_-1px_rgb(28_47_112_/_0.2)]">
              <Star size={11} fill="currentColor" aria-hidden />
              <span className="hidden xs:inline sm:inline">Featured Partner</span>
              <span className="inline xs:hidden sm:hidden">Featured</span>
            </span>
          )}
        </div>
        <CardBody className="space-y-0.5 sm:space-y-1 p-3 sm:p-5 sm:pt-3">
          <h3 className="text-sm sm:text-base font-semibold text-ink-700 leading-snug line-clamp-2">
            {name}
          </h3>
          {kabkota && (
            <p className="text-xs sm:text-sm text-muted line-clamp-1">{kabkota}</p>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}

type GridProps = {
  facilities: FacilityCardData[];
  className?: string;
};

export function FacilityGrid({ facilities, className }: GridProps) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:gap-5",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {facilities.map((facility, i) => (
        <FacilityCard
          key={facility.id ?? `${facility.slug}-${i}`}
          facility={facility}
        />
      ))}
    </div>
  );
}
