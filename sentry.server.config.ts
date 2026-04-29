import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? "production",
    tracesSampleRate: process.env.NEXT_PUBLIC_SENTRY_ENV === "staging" ? 1.0 : 0.1,
    // Don't surface 4xx as errors (those are user-side, not bugs).
    beforeSend(event, hint) {
      const err = hint.originalException as { status?: number } | undefined;
      if (err?.status && err.status >= 400 && err.status < 500) return null;
      return event;
    },
  });
}
