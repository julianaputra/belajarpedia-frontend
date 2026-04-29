"use client";

import * as React from "react";
import { X } from "lucide-react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

type Props = {
  /** Called once Turnstile resolves a token (or immediately in mock mode). */
  onVerify: (token: string) => void;
  /** Optional reset trigger — bump value to force re-render. */
  resetKey?: string | number;
};

/**
 * Cloudflare Turnstile widget (managed mode, T-14 mitigation).
 *
 * Behavior:
 *   - mock/dev (USE_MOCK_API=true OR no site key): auto-resolve fake token,
 *     render a small "🔓 dev mode" indicator. No network.
 *   - production: load Turnstile script, render widget, callback with token.
 */
export function Turnstile({ onVerify, resetKey }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const widgetIdRef = React.useRef<string | null>(null);
  const [dismissed, setDismissed] = React.useState(false);

  const isMock = USE_MOCK || !SITE_KEY;

  React.useEffect(() => {
    if (isMock) {
      onVerify("mock-turnstile-token");
      return;
    }

    let mounted = true;
    loadTurnstileScript().then(() => {
      if (!mounted || !ref.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY!,
        callback: (token: string) => onVerify(token),
        appearance: "interaction-only",
      });
    });

    return () => {
      mounted = false;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMock, resetKey]);

  if (isMock) {
    if (dismissed) return null;
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-lg border border-sun-400/40 bg-sun-400/10 px-4 py-3 text-sm"
      >
        <span aria-hidden className="shrink-0 text-base leading-none mt-0.5">
          🔓
        </span>
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="font-semibold text-ink-700">Mode pengembangan</p>
          <p className="text-ink-600">
            Verifikasi bot dilewati. Aktifkan Turnstile sebelum produksi.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Tutup notifikasi"
          className="shrink-0 -mr-1 -mt-1 inline-flex items-center justify-center w-7 h-7 rounded-md text-ink-500 hover:text-ink-700 hover:bg-sun-400/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-400"
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    );
  }

  return <div ref={ref} />;
}

let scriptPromise: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }
    const existing = document.querySelector(
      'script[src^="https://challenges.cloudflare.com/turnstile"]',
    );
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          appearance?: "always" | "execute" | "interaction-only";
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}
