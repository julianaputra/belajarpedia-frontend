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
        "rounded-2xl bg-white border border-ink-100 p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgb(28_47_112_/_0.15)] space-y-6",
        className,
      )}
    >
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-700">{title}</h1>
        {subtitle && <p className="text-muted leading-relaxed">{subtitle}</p>}
      </header>

      <div>{children}</div>

      {footer && (
        <footer className="border-t border-ink-100 pt-4 text-sm text-muted">
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
      className="rounded-lg bg-coral-400/10 border border-coral-400/40 text-coral-500 px-4 py-2.5 text-sm"
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
