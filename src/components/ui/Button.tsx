import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 3D Button — playful press-down feedback, layout-stable.
 *
 * Depth is rendered with `box-shadow` (offset-y, no blur, no spread) so the
 * element's box never changes size. Hover/active only animate `transform` and
 * `box-shadow` — neither affects layout flow.
 *
 * Resting:  shadow 4px down (looks raised by 4px)
 * Hover:    translate-y -2px + shadow 6px down (more pronounced lift)
 * Active:   translate-y +4px + shadow 0 (fully pressed into surface)
 *
 * Variants share this geometry; only colors differ.
 */

type Variant = "primary" | "secondary" | "sun" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Per-variant shadow colors. The "rest", "hover", and "active" boxes need
 * matching depth color (a darker shade of the button face).
 */
const variantStyles: Record<Variant, string> = {
  primary: cn(
    "bg-brand-500 text-white",
    "shadow-[0_4px_0_0_var(--color-brand-700)]",
    "hover:bg-brand-400 hover:shadow-[0_6px_0_0_var(--color-brand-700)]",
    "active:bg-brand-600 active:shadow-[0_0_0_0_var(--color-brand-700)]",
  ),
  secondary: cn(
    "bg-ink-700 text-white",
    "shadow-[0_4px_0_0_var(--color-ink-900)]",
    "hover:bg-ink-600 hover:shadow-[0_6px_0_0_var(--color-ink-900)]",
    "active:bg-ink-800 active:shadow-[0_0_0_0_var(--color-ink-900)]",
  ),
  sun: cn(
    "bg-sun-500 text-ink-900",
    "shadow-[0_4px_0_0_#cc9a06]",
    "hover:bg-sun-400 hover:shadow-[0_6px_0_0_#cc9a06]",
    "active:bg-sun-500 active:shadow-[0_0_0_0_#cc9a06]",
  ),
  outline: cn(
    "bg-white text-brand-700 border-2 border-brand-500",
    "shadow-[0_4px_0_0_var(--color-brand-500)]",
    "hover:bg-brand-50 hover:shadow-[0_6px_0_0_var(--color-brand-500)]",
    "active:bg-brand-100 active:shadow-[0_0_0_0_var(--color-brand-500)]",
  ),
  ghost: cn(
    "bg-transparent text-ink-700",
    "shadow-none",
    "hover:bg-ink-50 hover:shadow-none",
    "active:bg-ink-100",
  ),
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-base gap-2",
  lg: "h-14 px-7 text-lg gap-2.5",
};

const baseStyles = cn(
  "inline-flex items-center justify-center font-semibold",
  "rounded-[var(--radius)]",
  "select-none whitespace-nowrap",
  "transition-[transform,box-shadow,background-color] duration-150 ease-[var(--ease-pop)]",
  // Layout-stable depth: only transform + shadow change. Box geometry never moves.
  "hover:-translate-y-0.5",
  "active:translate-y-1",
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 focus-visible:ring-offset-2",
  // Disabled: lock to resting state, no hover/active transforms.
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "disabled:hover:translate-y-0 disabled:active:translate-y-0",
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = "primary", size = "md", ...rest }, ref) {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...rest}
      />
    );
  },
);

type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  href: string;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  href,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...rest}
    />
  );
}
