import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "ink" | "sun" | "coral" | "neutral";

const toneStyles: Record<Tone, string> = {
  brand: "bg-brand-100 text-brand-800 border-brand-200",
  ink: "bg-ink-100 text-ink-800 border-ink-200",
  sun: "bg-sun-400 text-ink-900 border-sun-500",
  coral: "bg-coral-400 text-white border-coral-500",
  neutral: "bg-gray-100 text-gray-700 border-gray-200",
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
};

export function Badge({ className, tone = "brand", ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5",
        "text-xs font-semibold border",
        toneStyles[tone],
        className,
      )}
      {...rest}
    />
  );
}
