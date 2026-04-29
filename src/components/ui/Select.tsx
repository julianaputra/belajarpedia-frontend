import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, Props>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full rounded-lg border border-ink-200 bg-white px-4 pr-10",
          "text-base text-body appearance-none cursor-pointer",
          "transition-[border-color,box-shadow] duration-150",
          "hover:border-ink-300",
          "focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_var(--color-brand-100)]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-ink-50",
          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%231c2f70%22><path d=%22M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%22/></svg>')]",
          "bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem]",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    );
  },
);
