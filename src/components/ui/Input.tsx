import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const inputBaseClass = cn(
  "h-11 w-full rounded-lg border border-ink-200 bg-white px-4",
  "text-base text-body placeholder:text-muted",
  "transition-[border-color,box-shadow] duration-150",
  "hover:border-ink-300",
  "focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_var(--color-brand-100)]",
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-ink-50",
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(inputBaseClass, className)} {...rest} />;
  },
);

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  function Label({ className, ...rest }, ref) {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium text-ink-700 mb-1.5 inline-block",
          className,
        )}
        {...rest}
      />
    );
  },
);

/**
 * Password input with show/hide toggle.
 *
 * Behavior:
 *   - Internal state controls visibility; type swaps between "password" and "text".
 *   - Eye icon swaps to EyeOff when visible.
 *   - Forwards ref so react-hook-form's `register` works as a drop-in replacement.
 *   - Toggle has tabIndex={-1} so Tab keeps moving through fields naturally.
 *
 * Usage:
 *   <PasswordInput {...register("password")} autoComplete="current-password" />
 */
type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, ...rest }, ref) {
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(inputBaseClass, "pr-11", className)}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          aria-pressed={visible}
          tabIndex={-1}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-ink-400 hover:text-ink-700 focus:outline-none focus-visible:text-ink-700 transition-colors"
        >
          {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      </div>
    );
  },
);
