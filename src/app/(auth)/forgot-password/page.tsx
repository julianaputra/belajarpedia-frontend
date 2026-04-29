"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Turnstile } from "@/components/Turnstile";
import { AuthCard, FormError, FieldError } from "@/components/auth/AuthCard";
import { requestPasswordReset } from "@/lib/api/auth.client";

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (submitted) {
    return (
      <AuthCard
        title="Cek email kamu"
        subtitle="Kalau email itu terdaftar, kami sudah kirim link reset password. Klik link di email untuk lanjut."
        footer={
          <Link href="/login" className="text-brand-700 hover:underline font-semibold">
            Kembali ke login
          </Link>
        }
      >
        <div className="rounded-[var(--radius)] bg-brand-50 border-2 border-brand-200 p-4 text-sm text-body">
          Tidak menerima email dalam 5 menit? Cek folder spam atau coba lagi
          dengan email yang berbeda.
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Lupa password?"
      subtitle="Masukkan email kamu, kami kirim link untuk reset password."
      footer={
        <Link href="/login" className="text-brand-700 hover:underline font-semibold">
          ← Kembali ke login
        </Link>
      }
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          if (!turnstileToken) {
            setError("Verifikasi keamanan belum selesai.");
            return;
          }
          setError(null);
          try {
            await requestPasswordReset({
              ...values,
              turnstile_token: turnstileToken,
            });
            setSubmitted(true);
          } catch {
            setError("Gagal mengirim. Coba lagi.");
          }
        })}
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <Turnstile onVerify={setTurnstileToken} />
        <FormError message={error} />

        <Button
          type="submit"
          size="lg"
          className="w-full justify-center"
          disabled={isSubmitting || !turnstileToken}
        >
          {isSubmitting ? "Mengirim…" : "Kirim link reset"}
        </Button>
      </form>
    </AuthCard>
  );
}
