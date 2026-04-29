import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? "production",
    // Lower sample rate in prod, full in staging.
    tracesSampleRate: process.env.NEXT_PUBLIC_SENTRY_ENV === "staging" ? 1.0 : 0.1,
    // Replay sessions only on errors (saves quota).
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,
    integrations: [
      Sentry.replayIntegration({
        // PII safety: mask all by default.
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Ignore noisy browser errors.
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "Non-Error promise rejection captured",
    ],
  });
}
