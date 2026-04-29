"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Turnstile } from "@/components/Turnstile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getMyReview, submitReview } from "@/lib/api/engagement.client";
import { isApiError } from "@/lib/api/error";

type Props = {
  facilityId: number;
};

/**
 * AC-17 / AC-22 / AC-23:
 *   - One rating per user, no re-rating ever.
 *   - Confirmation modal before submit ("you can only rate this once").
 *   - After submit (or if previously rated), show frozen state with the
 *     user's own rating only — never an aggregate or count.
 *
 * Server returns 409 on duplicate; we surface it gracefully.
 */
export function ReviewWidget({ facilityId }: Props) {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const [existing, setExisting] = React.useState<number | null>(null);
  const [hover, setHover] = React.useState(0);
  const [pendingRating, setPendingRating] = React.useState<number | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);

  // Fetch existing review on mount (only when authenticated).
  React.useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    getMyReview(facilityId)
      .then((r) => {
        if (active && r?.rating) setExisting(r.rating);
      })
      .catch(() => {
        // Silent — first-time visitor case.
      });
    return () => {
      active = false;
    };
  }, [facilityId, isAuthenticated]);

  if (isLoading) {
    return <div className="text-muted">Memuat rating…</div>;
  }

  if (!isAuthenticated) {
    return (
      <p className="text-muted text-sm">
        <a href="/login" className="text-brand-700 hover:underline font-medium">
          Login
        </a>{" "}
        untuk memberi rating.
      </p>
    );
  }

  if (existing) {
    return (
      <div className="space-y-1">
        <div className="text-sm text-muted">Rating Anda untuk fasilitas ini:</div>
        <Stars value={existing} disabled />
        <p className="text-xs text-muted">Rating bersifat final — tidak bisa diubah.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted">Beri rating untuk fasilitas ini:</div>
      <Stars
        value={hover || 0}
        onChange={(n) => setPendingRating(n)}
        onHover={setHover}
      />
      <p className="text-xs text-muted">
        Rating hanya bisa diberikan satu kali dan tidak bisa diubah.
      </p>

      {pendingRating !== null && (
        <ConfirmModal
          rating={pendingRating}
          onCancel={() => {
            setPendingRating(null);
            setError(null);
          }}
          onConfirm={async () => {
            if (!turnstileToken) {
              setError("Verifikasi keamanan belum selesai.");
              return;
            }
            setSubmitting(true);
            setError(null);
            try {
              const result = await submitReview(facilityId, {
                rating: pendingRating,
                turnstile_token: turnstileToken,
              });
              setExisting(result.rating ?? pendingRating);
              setPendingRating(null);
            } catch (e) {
              if (isApiError(e) && e.status === 409) {
                setError("Anda sudah memberi rating fasilitas ini sebelumnya.");
              } else if (isApiError(e) && e.isUnauthorized) {
                setError("Sesi Anda berakhir, silakan login kembali.");
              } else {
                setError("Gagal mengirim rating. Coba lagi.");
              }
            } finally {
              setSubmitting(false);
            }
          }}
          submitting={submitting}
          error={error}
          turnstileToken={turnstileToken}
          onTurnstileVerify={setTurnstileToken}
        />
      )}
    </div>
  );
}

type StarsProps = {
  value: number;
  onChange?: (n: number) => void;
  onHover?: (n: number) => void;
  disabled?: boolean;
};

function Stars({ value, onChange, onHover, disabled }: StarsProps) {
  return (
    <div
      className="flex gap-1"
      onMouseLeave={() => onHover?.(0)}
      role={disabled ? undefined : "radiogroup"}
      aria-label="Rating bintang"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onMouseEnter={() => onHover?.(n)}
          onClick={() => onChange?.(n)}
          aria-label={`${n} bintang`}
          aria-checked={disabled ? undefined : n === value}
          role={disabled ? undefined : "radio"}
          className={`text-3xl transition-transform duration-150 ${
            n <= value ? "text-sun-500" : "text-ink-200"
          } ${disabled ? "cursor-default" : "hover:scale-110 cursor-pointer"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

type ConfirmModalProps = {
  rating: number;
  onCancel: () => void;
  onConfirm: () => void;
  submitting: boolean;
  error: string | null;
  turnstileToken: string | null;
  onTurnstileVerify: (token: string) => void;
};

function ConfirmModal({
  rating,
  onCancel,
  onConfirm,
  submitting,
  error,
  turnstileToken,
  onTurnstileVerify,
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm p-5 animate-[var(--animate-fade-up)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-rating-title"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <h3
          id="confirm-rating-title"
          className="text-xl font-semibold text-ink-700"
        >
          Konfirmasi rating
        </h3>
        <div className="flex gap-1" aria-hidden>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`text-3xl ${n <= rating ? "text-sun-500" : "text-ink-200"}`}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-body">
          Anda akan memberi <strong>{rating} bintang</strong>. Rating ini bersifat
          final dan <strong>tidak bisa diubah</strong> setelah dikirim.
        </p>

        <Turnstile onVerify={onTurnstileVerify} />

        {error && (
          <p className="text-sm text-coral-500" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>
            Batal
          </Button>
          <Button onClick={onConfirm} disabled={submitting || !turnstileToken}>
            {submitting ? "Mengirim…" : "Ya, kirim rating"}
          </Button>
        </div>
      </div>
    </div>
  );
}
