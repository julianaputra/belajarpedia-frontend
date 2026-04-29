import { cn } from "@/lib/utils";

/**
 * Hand-drawn decorative SVG primitives. All inline so they take brand colors
 * via `currentColor`.
 */

export function WavyUnderline({
  className,
  width = 220,
  stroke = 4,
}: {
  className?: string;
  width?: number;
  stroke?: number;
}) {
  return (
    <svg
      viewBox="0 0 220 16"
      width={width}
      preserveAspectRatio="none"
      className={cn("inline-block", className)}
      aria-hidden="true"
    >
      <path
        d="M2 9 C 30 1, 60 17, 90 9 C 120 1, 150 17, 180 9 C 200 4, 215 12, 218 9"
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CircleScribble({
  className,
  size = 90,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("inline-block", className)}
      aria-hidden="true"
    >
      <path
        d="M50 12 C 78 14 88 38 86 56 C 84 78 60 88 42 86 C 22 84 12 64 14 46 C 16 28 32 14 50 12 C 70 11 84 24 88 42"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HandArrow({
  className,
  width = 80,
  rotate = 0,
}: {
  className?: string;
  width?: number;
  rotate?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 80"
      width={width}
      style={{ transform: `rotate(${rotate}deg)` }}
      className={cn("inline-block", className)}
      aria-hidden="true"
    >
      <path
        d="M5 15 C 20 30, 40 50, 70 60"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M58 50 L 72 62 L 56 68"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarBurst({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn("inline-block", className)}
      aria-hidden="true"
    >
      <path
        d="M16 2 L19 12 L29 12 L21 18 L24 28 L16 22 L8 28 L11 18 L3 12 L13 12 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DotsPattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("absolute inset-0 -z-10", className)}
      aria-hidden="true"
    >
      <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
      </pattern>
      <rect width="100" height="100" fill="url(#dots)" />
    </svg>
  );
}

export function ZigZag({
  className,
  width = 120,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      viewBox="0 0 120 14"
      width={width}
      preserveAspectRatio="none"
      className={cn("inline-block", className)}
      aria-hidden="true"
    >
      <path
        d="M2 10 L 14 4 L 26 10 L 38 4 L 50 10 L 62 4 L 74 10 L 86 4 L 98 10 L 110 4 L 118 10"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
