"use client";

import * as React from "react";
import { useSWRConfig } from "swr";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { addFavorite } from "@/lib/api/engagement.client";
import { isApiError } from "@/lib/api/error";

type Props = {
  facilityId: number;
};

/**
 * Favorite — add-only / cumulative (AC-14):
 *   - Idempotent: clicking twice is a no-op on server side.
 *   - No count is shown (US-19).
 *   - Login required: unauth users get a CTA, not a hidden button.
 */
export function FavoriteButton({ facilityId }: Props) {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const { mutate } = useSWRConfig();
  const [pending, setPending] = React.useState(false);
  const [favorited, setFavorited] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <Button variant="outline" disabled aria-busy>
        Memuat…
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button variant="outline" disabled title="Masuk untuk menyimpan favorit">
        ♡ Login untuk simpan
      </Button>
    );
  }

  if (favorited) {
    return (
      <Button variant="primary" disabled aria-pressed="true">
        ♥ Tersimpan
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError(null);
          try {
            await addFavorite(facilityId);
            setFavorited(true);
            // Invalidate any /favorites pages so they pick up the new entry.
            mutate(
              (key) => typeof key === "string" && key.startsWith("user:favorites:"),
              undefined,
              { revalidate: true },
            );
          } catch (e) {
            if (isApiError(e) && e.isUnauthorized) {
              setError("Sesi Anda berakhir, silakan login kembali.");
            } else {
              setError("Gagal menyimpan favorit. Coba lagi.");
            }
          } finally {
            setPending(false);
          }
        }}
      >
        {pending ? "Menyimpan…" : "♡ Simpan ke Favorit"}
      </Button>
      {error && <p className="text-sm text-coral-500">{error}</p>}
    </div>
  );
}
