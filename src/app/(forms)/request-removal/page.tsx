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
import { submitDeletionRequest } from "@/lib/api/public-forms.client";
import { isApiError } from "@/lib/api/error";

const schema = z.object({
  facility_url: z
    .string()
    .url("URL fasilitas tidak valid (harus diawali https://)"),
  requester_name: z.string().min(2, "Nama minimal 2 karakter"),
  requester_email: z.string().email("Format email tidak valid"),
  reason: z
    .string()
    .min(20, "Alasan minimal 20 karakter")
    .max(5000, "Alasan maksimal 5000 karakter"),
});
type FormValues = z.infer<typeof schema>;

export default function RequestRemovalPage() {
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

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
        title="Permintaan diterima ✓"
        body="Terima kasih. Tim Belajarpedia akan review permintaan dalam 7 hari kerja dan menghubungi via email untuk verifikasi sebelum melakukan tindakan."
      />
    );
  }

  return (
    <FormShell
      emoji="🗑️"
      eyebrow="Permintaan penghapusan"
      title="Hapus listing fasilitas dari direktori"
      subtitle="Untuk pemilik fasilitas yang ingin opt-out. Setiap permintaan akan diverifikasi manual sebelum diproses."
    >
      <div className="rounded-lg bg-sun-400/15 border-2 border-sun-400 p-4 mb-5 text-sm text-ink-700">
        <p className="font-semibold mb-1">⚠ Catatan penting</p>
        <p>
          Penghapusan tidak otomatis. Tim akan menghubungimu via email untuk
          verifikasi kepemilikan sebelum proses dilakukan. Setelah dihapus,
          URL fasilitas akan return HTTP 410 dan tidak muncul lagi di direktori.
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={handleSubmit(async (values) => {
          if (!turnstileToken) {
            setSubmitError("Verifikasi keamanan belum selesai.");
            return;
          }
          setSubmitError(null);
          try {
            await submitDeletionRequest({
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
          <Label htmlFor="facility_url">URL fasilitas yang ingin dihapus</Label>
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
              placeholder="email yang terkait dengan fasilitas"
              {...register("requester_email")}
            />
            <FieldError message={errors.requester_email?.message} />
            <p className="text-xs text-muted mt-1">
              Idealnya pakai email domain fasilitasmu untuk mempercepat verifikasi.
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="reason">Alasan penghapusan</Label>
          <textarea
            id="reason"
            rows={6}
            className="w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-base text-body placeholder:text-muted transition-[border-color,box-shadow] hover:border-ink-300 focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_var(--color-brand-100)]"
            placeholder="Contoh: Saya pemilik fasilitas X. Kami ingin opt-out karena…"
            {...register("reason")}
          />
          <FieldError message={errors.reason?.message} />
        </div>

        <Turnstile onVerify={setTurnstileToken} />
        <FormError message={submitError} />

        <Button
          type="submit"
          size="lg"
          className="w-full justify-center"
          disabled={isSubmitting || !turnstileToken}
        >
          {isSubmitting ? "Mengirim…" : "Kirim permintaan penghapusan"}
        </Button>
      </form>
    </FormShell>
  );
}
