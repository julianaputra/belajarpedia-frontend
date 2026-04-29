import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { FacilityCard as FacilityCardData } from "@/lib/api/facilities";

const PLACEHOLDER = "/placeholder-facility.svg";

type Props = {
  facility: FacilityCardData;
  /** Animation stagger index — adds bounce-in delay for grid entrance. */
  index?: number;
  className?: string;
};

/**
 * Card-shape per AC-05: name + kabkota + image only.
 * No score, no count chips, no school_type/category chip.
 *
 * `is_timedoor_academy` = true → Sponsored badge (B-03 mitigation).
 */
export function FacilityCard({ facility, index = 0, className }: Props) {
  const href = facility.url ?? "#";
  const name = facility.name ?? "Tanpa nama";
  const kabkota = facility.kabkota_name ?? "";
  const imageSrc = facility.image_main_url ?? PLACEHOLDER;
  const isTimedoor = facility.is_timedoor_academy === true;

  return (
    <Link
      href={href}
      className={cn(
        "block focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 rounded-[var(--radius-lg)]",
        className,
      )}
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <Card
        interactive
        className="h-full overflow-hidden animate-[var(--animate-bounce-in)]"
      >
        <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-100 to-ink-100">
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
          {isTimedoor && (
            <Badge
              tone="sun"
              className="absolute top-3 left-3 shadow-[0_2px_0_0_#cc9a06]"
            >
              ⭐ Featured Partner
            </Badge>
          )}
        </div>
        <CardBody className="space-y-1">
          <h3 className="text-base font-bold text-ink-700 leading-snug line-clamp-2">
            {name}
          </h3>
          {kabkota && (
            <p className="text-sm text-muted line-clamp-1">{kabkota}</p>
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
        "grid gap-5",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {facilities.map((facility, i) => (
        <FacilityCard
          key={facility.id ?? `${facility.slug}-${i}`}
          facility={facility}
          index={i}
        />
      ))}
    </div>
  );
}
