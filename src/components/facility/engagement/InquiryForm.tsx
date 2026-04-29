"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Turnstile } from "@/components/Turnstile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { submitInquiry } from "@/lib/api/engagement.client";
import { isApiError } from "@/lib/api/error";

/**
 * AC-10: Form is rendered only when facility has email (caller-gated).
 * AC-15: Server enforces 1-per-hour rate limit; we surface 429 friendly.
 * AC-16: Reply-To set server-side; we just collect subject + message.
 */

const schema = z.object({
  subject: z
    .string()
    .min(3, "Subjek minimal 3 karakter")
    .max(200, "Subjek maksimal 200 karakter"),
  message: z
    .string()
    .min(20, "Pesan minimal 20 karakter")
    .max(5000, "Pesan maksimal 5000 karakter"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  facilityId: number;
  facilityName: string;
};

export function InquiryForm({ facilityId, facilityName }: Props) {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-6 text-muted">
        Memuat formulir…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6 space-y-3">
        <h2 className="text-lg sm:text-xl font-semibold text-ink-700">Kirim Pertanyaan</h2>
        <p className="text-muted">
          Silakan login untuk mengirim pertanyaan langsung ke {facilityName}.
        </p>
        <Button variant="primary" onClick={() => (window.location.href = "/login")}>
          Login untuk bertanya
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:p-6 space-y-2">
        <h2 className="text-lg sm:text-xl font-semibold text-brand-800">Pesan terkirim ✓</h2>
        <p className="text-body">
          Pertanyaan Anda telah diteruskan ke {facilityName}. Mereka akan
          membalas langsung ke email Anda.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        if (!turnstileToken) {
          setSubmitError("Verifikasi keamanan belum selesai.");
          return;
        }
        setSubmitError(null);
        try {
          await submitInquiry(facilityId, {
            ...values,
            turnstile_token: turnstileToken,
          });
          setSuccess(true);
        } catch (e) {
          if (isApiError(e)) {
            if (e.isRateLimited) {
              setSubmitError(
                "Anda sudah mengirim pesan ke fasilitas ini baru-baru ini. Silakan tunggu satu jam.",
              );
            } else if (e.isValidation) {
              setSubmitError("Form tidak valid. Periksa kembali isian Anda.");
            } else {
              setSubmitError(e.message);
            }
          } else {
            setSubmitError("Gagal mengirim pesan. Coba lagi.");
          }
        }
      })}
      className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6 space-y-4"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-ink-700">Kirim Pertanyaan</h2>
      <p className="text-sm text-muted">
        Pesan ini akan dikirim ke {facilityName}. Balasan akan masuk ke email
        akun Belajarpedia Anda.
      </p>

      <div>
        <Label htmlFor="subject">Subjek</Label>
        <Input
          id="subject"
          placeholder="Pertanyaan tentang biaya pendaftaran"
          {...register("subject")}
        />
        {errors.subject && (
          <p className="text-sm text-coral-500 mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Pesan</Label>
        <textarea
          id="message"
          rows={6}
          className="w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-base text-body placeholder:text-muted transition-[border-color,box-shadow] hover:border-ink-300 focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_var(--color-brand-100)]"
          placeholder="Halo, saya ingin bertanya tentang…"
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-coral-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      <Turnstile onVerify={(t) => setTurnstileToken(t)} />

      {submitError && (
        <p className="text-sm text-coral-500" role="alert">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting || !turnstileToken}>
        {isSubmitting ? "Mengirim…" : "Kirim Pesan"}
      </Button>
    </form>
  );
}
