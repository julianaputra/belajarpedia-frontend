"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Label, PasswordInput } from "@/components/ui/Input";
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
      title="Selamat datang kembali"
      subtitle="Masuk untuk lanjutkan pencarian dan akses fitur akun."
      footer={
        <p className="text-center">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-brand-700 hover:underline font-semibold"
          >
            Daftar gratis
          </Link>
        </p>
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
              setSubmitError("Gagal masuk. Coba lagi.");
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
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <Label htmlFor="password" className="mb-0">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-brand-700 hover:underline font-medium"
            >
              Lupa password?
            </Link>
          </div>
          <PasswordInput
            id="password"
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

      {/* OAuth divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ink-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs uppercase tracking-wider text-muted font-medium">
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
        <GoogleIcon />
        Lanjutkan dengan Google
      </ButtonLink>
    </AuthCard>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
