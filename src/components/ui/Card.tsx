import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card with friendly hover-lift.
 * - Default: subtle resting shadow.
 * - Interactive (hover): lifts +4px, deeper shadow, slight scale.
 *
 * Use `<Card asChild>`-style? Not implemented — wrap with <Link> if needed.
 */

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({ className, interactive = false, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] bg-white border-2 border-ink-100",
        "shadow-[0_2px_0_0_rgb(28_47_112_/_0.08)]",
        "transition-[transform,box-shadow,border-color] duration-200 ease-[var(--ease-pop)]",
        interactive &&
          "cursor-pointer hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] hover:border-brand-300",
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pb-3", className)} {...rest} />;
}

export function CardBody({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-3", className)} {...rest} />;
}

export function CardTitle({
  className,
  as: As = "h3",
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h2" | "h3" | "h4";
}) {
  return (
    <As
      className={cn("text-lg font-bold text-ink-700 leading-tight", className)}
      {...rest}
    />
  );
}
