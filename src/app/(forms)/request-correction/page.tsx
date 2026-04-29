"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Turnstile } from "@/components/Turnstile";
import { FieldError, FormError } from "@/components/auth/AuthCard";
import { FormShell, FormSuccess } from "@/components/forms/FormShell";
import { submitCorrectionRequest } from "@/lib/api/public-forms.client";
import { isApiError } from "@/lib/api/error";

const schema = z.object({
  facility_url: z
    .string()
    .url("URL fasilitas tidak valid (harus diawali https://)"),
  requester_name: z.string().min(2, "Nama minimal 2 karakter"),
  requester_email: z.string().email("Format email tidak valid"),
  message: z
    .string()
    .min(20, "Pesan minimal 20 karakter")
    .max(5000, "Pesan maksimal 5000 karakter"),
});
type FormValues = z.infer<typeof schema>;

export default function RequestCorrectionPage() {
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Prefill facility_url from query (?facility_url=...) — read once on init.
  const initialFacilityUrl = React.useMemo(() => {
    if (typeof window === "undefined") return "";
    return (
      new URLSearchParams(window.location.search).get("facility_url") ?? ""
    );
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { facility_url: initialFacilityUrl },
  });

  if (success) {
    return (
      <FormSuccess
        title="Laporan diterima ✓"
        body="Terima kasih sudah membantu menjaga akurasi data. Tim kami akan review dan memperbarui informasi secepatnya."
      />
    );
  }

  return (
    <FormShell
      emoji="✏️"
      eyebrow="Perbaikan informasi"
      title="Laporkan informasi yang tidak akurat"
      subtitle="Bantu kami menjaga data tetap akurat. Kirim laporan dan tim akan review."
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit(async (values) => {
          if (!turnstileToken) {
            setSubmitError("Verifikasi keamanan belum selesai.");
            return;
          }
          setSubmitError(null);
          try {
            await submitCorrectionRequest({
              ...values,
              turnstile_token: turnstileToken,
            });
            setSuccess(true);
          } catch (e) {
            if (isApiError(e) && e.isValidation) {
              const first = Object.values(e.errors ?? {}).flat()[0];
              setSubmitError(first ?? "Form tidak valid.");
            } else {
              setSubmitError(e instanceof Error ? e.message : "Gagal mengirim.");
            }
          }
        })}
      >
        <div>
          <Label htmlFor="facility_url">URL fasilitas</Label>
          <Input
            id="facility_url"
            type="url"
            placeholder="https://belajarpedia.com/sekolah/..."
            {...register("facility_url")}
          />
          <FieldError message={errors.facility_url?.message} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="requester_name">Nama kamu</Label>
            <Input id="requester_name" {...register("requester_name")} />
            <FieldError message={errors.requester_name?.message} />
          </div>
          <div>
            <Label htmlFor="requester_email">Email kamu</Label>
            <Input
              id="requester_email"
              type="email"
              {...register("requester_email")}
            />
            <FieldError message={errors.requester_email?.message} />
          </div>
        </div>

        <div>
          <Label htmlFor="message">Apa yang perlu dikoreksi?</Label>
          <textarea
            id="message"
            rows={6}
            className="w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-base text-body placeholder:text-muted transition-[border-color,box-shadow] hover:border-ink-300 focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_var(--color-brand-100)]"
            placeholder="Contoh: Biaya yang tertulis Rp 1jt sebenarnya Rp 1.5jt. Atau: alamat sudah pindah ke…"
            {...register("message")}
          />
          <FieldError message={errors.message?.message} />
        </div>

        <Turnstile onVerify={setTurnstileToken} />
        <FormError message={submitError} />

        <Button
          type="submit"
          size="lg"
          className="w-full justify-center"
          disabled={isSubmitting || !turnstileToken}
        >
          {isSubmitting ? "Mengirim…" : "Kirim laporan"}
        </Button>
      </form>
    </FormShell>
  );
}
