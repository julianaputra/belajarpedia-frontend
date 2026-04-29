import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function AuthCard({ title, subtitle, children, footer, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] bg-white border-2 border-ink-100 p-6 sm:p-8 shadow-[var(--shadow-lift)] space-y-6",
        className,
      )}
    >
      <header className="space-y-2">
        <h1 className="font-display font-extrabold text-3xl text-ink-700">
          {title}
        </h1>
        {subtitle && <p className="text-muted">{subtitle}</p>}
      </header>

      <div>{children}</div>

      {footer && (
        <footer className="border-t-2 border-dashed border-ink-200 pt-4 text-sm text-muted">
          {footer}
        </footer>
      )}
    </div>
  );
}

type FormErrorProps = {
  message: string | null | undefined;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-[var(--radius)] bg-coral-400/15 border-2 border-coral-400 text-coral-500 px-4 py-2.5 text-sm"
    >
      {message}
    </div>
  );
}

type FormFieldErrorProps = {
  message?: string;
};

export function FieldError({ message }: FormFieldErrorProps) {
  if (!message) return null;
  return <p className="text-sm text-coral-500 mt-1">{message}</p>;
}
