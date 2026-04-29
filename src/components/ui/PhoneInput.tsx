"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "defaultValue"
> & {
  value: string;
  onChange: (value: string) => void;
};

/**
 * Indonesian phone input with locked +62 prefix.
 *
 * Behavior:
 *   - Locked +62 prefix shown as read-only chip on the left of the field.
 *   - User types the rest. Auto-strips leading 0 / 62 / +62 if pasted.
 *   - Display: digits formatted as `812-3456-7890`.
 *   - Stored value: full E.164 form `+6281234567890` (or `""` when empty).
 */
export function PhoneInput({
  value,
  onChange,
  className,
  disabled,
  ...rest
}: Props) {
  // Extract local digits from stored value (without +62)
  const localDigits = React.useMemo(() => {
    if (!value) return "";
    return value.replace(/^\+?62/, "").replace(/\D/g, "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    // Strip a pasted/typed leading "62" prefix
    if (digits.startsWith("62") && digits.length > 2) digits = digits.slice(2);
    // Strip leading "0"
    if (digits.startsWith("0")) digits = digits.slice(1);
    // Cap at 13 digits (Indonesian mobile max)
    digits = digits.slice(0, 13);
    onChange(digits ? `+62${digits}` : "");
  };

  return (
    <div
      className={cn(
        "h-11 w-full rounded-lg border border-ink-200 bg-white",
        "flex items-center",
        "transition-[border-color,box-shadow] duration-150",
        "hover:border-ink-300",
        "focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_var(--color-brand-100)]",
        disabled && "opacity-50 cursor-not-allowed bg-ink-50",
        className,
      )}
    >
      <span
        aria-hidden
        className="pl-3.5 pr-2 text-ink-700 text-base border-r border-ink-100 h-7 flex items-center"
      >
        +62
      </span>
      <input
        {...rest}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        disabled={disabled}
        value={formatLocal(localDigits)}
        onChange={handleChange}
        placeholder="812-3456-7890"
        className="flex-1 h-full bg-transparent border-0 px-3 text-base text-body placeholder:text-muted focus:outline-none disabled:cursor-not-allowed"
      />
    </div>
  );
}

/** Format Indonesian local number as `812-3456-7890` (3-4-4 grouping). */
function formatLocal(digits: string): string {
  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}
