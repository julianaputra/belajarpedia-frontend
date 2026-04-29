import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-[var(--radius)] border-2 border-ink-200 bg-white px-4",
          "text-base text-body placeholder:text-muted",
          "transition-[border-color,box-shadow] duration-150",
          "hover:border-ink-300",
          "focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_4px_var(--color-brand-100)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
        {...rest}
      />
    );
  },
);

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  function Label({ className, ...rest }, ref) {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-semibold text-ink-700 mb-1.5 inline-block",
          className,
        )}
        {...rest}
      />
    );
  },
);
