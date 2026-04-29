import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** Optional anchor target for in-page navigation. */
  id?: string;
  title: string;
  children: React.ReactNode;
  /** Whether the section starts open. Default true. */
  defaultOpen?: boolean;
  className?: string;
  /** Override padding for the content area. Default `px-5 sm:px-6 pb-5 sm:pb-6`. */
  contentClassName?: string;
};

/**
 * Card-style collapsible section using native <details>/<summary>.
 * Works without JavaScript and is screen-reader accessible by default.
 */
export function CollapsibleCard({
  id,
  title,
  children,
  defaultOpen = true,
  className,
  contentClassName,
}: Props) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className={cn(
        "group rounded-2xl bg-white border border-ink-100 scroll-mt-20 overflow-hidden",
        className,
      )}
    >
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-3 p-5 sm:p-6 hover:bg-ink-50/40 transition-colors">
        <h2 className="text-lg sm:text-xl font-semibold text-ink-700">{title}</h2>
        <ChevronDown
          size={18}
          aria-hidden
          className="text-ink-400 transition-transform duration-200 group-open:rotate-180 shrink-0"
        />
      </summary>
      <div className={cn("px-5 sm:px-6 pb-5 sm:pb-6", contentClassName)}>
        {children}
      </div>
    </details>
  );
}
