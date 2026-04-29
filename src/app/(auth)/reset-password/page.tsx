"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { AuthCard, FormError, FieldError } from "@/components/auth/AuthCard";
import { resetPassword } from "@/lib/api/auth.client";
import { isApiError } from "@/lib/api/error";

const passwordRule = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .regex(/[A-Z]/, "Harus mengandung huruf besar")
  .regex(/[a-z]/, "Harus mengandung huruf kecil")
  .regex(/[^A-Za-z0-9]/, "Harus mengandung simbol");

const schema = z
  .object({
    password: passwordRule,
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <AuthCard
      title="Reset password"
      subtitle="Masukkan password baru kamu di bawah."
      footer={
        <Link href="/login" className="text-brand-700 hover:underline font-semibold">
          ← Kembali ke login
        </Link>
      }
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          setError(null);
          const params = new URLSearchParams(window.location.search);
          const token = params.get("token") ?? "";
          const email = params.get("email") ?? "";
          if (!token || !email) {
            setError("Link reset tidak valid. Minta link baru di halaman lupa password.");
            return;
          }
          try {
            await resetPassword({
              token,
              email,
              password: values.password,
              password_confirmation: values.password_confirmation,
            });
            router.push("/login?reset=1");
          } catch (e) {
            if (isApiError(e) && e.isValidation) {
              const first = Object.values(e.errors ?? {}).flat()[0];
              setError(first ?? "Form tidak valid.");
            } else {
              setError("Gagal mengubah password. Link mungkin sudah kedaluwarsa.");
            }
          }
        })}
      >
        <div>
          <Label htmlFor="password">Password baru</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>
        <div>
          <Label htmlFor="password_confirmation">Konfirmasi password baru</Label>
          <Input
            id="password_confirmation"
            type="password"
            autoComplete="new-password"
            {...register("password_confirmation")}
          />
          <FieldError message={errors.password_confirmation?.message} />
        </div>

        <FormError message={error} />

        <Button
          type="submit"
          size="lg"
          className="w-full justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Memproses…" : "Set password baru"}
        </Button>
      </form>
    </AuthCard>
  );
}
