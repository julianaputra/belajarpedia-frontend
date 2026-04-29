import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Calm card primitive used across the site.
 *
 * Visual language:
 *   - 1px border, no chunky shadow at rest
 *   - Soft modern shadow on interactive hover (no translate jump)
 *   - Quiet radius (rounded-2xl ≈ 16px)
 */

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({ className, interactive = false, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white border border-ink-100",
        "transition-[box-shadow,border-color] duration-200",
        interactive &&
          "hover:border-brand-200 hover:shadow-[0_8px_20px_-10px_rgb(28_47_112_/_0.2)]",
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
      className={cn("text-lg font-semibold text-ink-700 leading-tight", className)}
      {...rest}
    />
  );
}
