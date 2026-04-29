"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Turnstile } from "@/components/Turnstile";
import { AuthCard, FormError, FieldError } from "@/components/auth/AuthCard";
import { login } from "@/lib/api/auth.client";
import { isApiError } from "@/lib/api/error";
import { apiUrl } from "@/lib/api/config";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { mutate } = useCurrentUser();
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register: rhf,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <AuthCard
      title="Masuk ke akunmu"
      subtitle="Login untuk simpan favorit dan kirim pertanyaan ke fasilitas."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            Belum punya akun?{" "}
            <Link href="/register" className="text-brand-700 hover:underline font-semibold">
              Daftar
            </Link>
          </span>
          <Link
            href="/forgot-password"
            className="text-brand-700 hover:underline font-semibold"
          >
            Lupa password?
          </Link>
        </div>
      }
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          if (!turnstileToken) {
            setSubmitError("Verifikasi keamanan belum selesai.");
            return;
          }
          setSubmitError(null);
          try {
            await login({ ...values, turnstile_token: turnstileToken });
            await mutate();
            const params = new URLSearchParams(window.location.search);
            router.push(params.get("returnTo") ?? "/");
          } catch (e) {
            if (isApiError(e)) {
              if (e.isUnauthorized) {
                setSubmitError("Email atau password salah.");
              } else if (e.isForbidden) {
                setSubmitError(
                  "Email kamu belum diverifikasi. Cek kotak masuk untuk link verifikasi.",
                );
              } else if (e.isRateLimited) {
                setSubmitError(
                  "Terlalu banyak percobaan. Coba lagi dalam beberapa menit.",
                );
              } else {
                setSubmitError(e.message);
              }
            } else {
              setSubmitError("Gagal login. Coba lagi.");
            }
          }
        })}
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="kamu@email.com"
            {...rhf("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...rhf("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <Turnstile onVerify={setTurnstileToken} />

        <FormError message={submitError} />

        <Button
          type="submit"
          className="w-full justify-center"
          size="lg"
          disabled={isSubmitting || !turnstileToken}
        >
          {isSubmitting ? "Memproses…" : "Masuk"}
        </Button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-ink-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs uppercase tracking-wider text-muted font-semibold">
            atau
          </span>
        </div>
      </div>

      <ButtonLink
        href={apiUrl("/api/auth/google/redirect")}
        variant="outline"
        className="w-full justify-center gap-3"
        size="lg"
      >
        <span aria-hidden>🔐</span> Lanjutkan dengan Google
      </ButtonLink>
    </AuthCard>
  );
}
