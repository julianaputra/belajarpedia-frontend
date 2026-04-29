import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  children: React.ReactNode;
  /** Optional helper text below the title. */
  description?: string;
  /** Override container classes (e.g. red tint for danger zone). */
  className?: string;
};

/**
 * Shared card chrome for profile section pages. Title becomes a single h2
 * since the layout already provides the page-level h1.
 */
export function SectionCard({ title, description, children, className }: Props) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-white border border-ink-100 p-5 sm:p-6 space-y-4",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold text-ink-700">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
