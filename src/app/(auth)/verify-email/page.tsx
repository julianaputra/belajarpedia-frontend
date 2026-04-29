"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { AuthCard, FormError } from "@/components/auth/AuthCard";
import { resendVerificationEmail } from "@/lib/api/auth.client";
import { isApiError } from "@/lib/api/error";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function VerifyEmailPage() {
  const { user, isLoading } = useCurrentUser();
  const [resending, setResending] = React.useState(false);
  const [resent, setResent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <AuthCard
      title="Cek email kamu"
      subtitle={
        user?.email
          ? `Kami sudah kirim link verifikasi ke ${user.email}.`
          : "Kami sudah kirim link verifikasi ke email yang kamu daftarkan."
      }
      footer={
        <span>
          Sudah verifikasi?{" "}
          <Link href="/login" className="text-brand-700 hover:underline font-semibold">
            Masuk di sini
          </Link>
        </span>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-brand-50 border-2 border-brand-200 p-4 text-sm text-ink-700">
          <p className="font-semibold mb-1">📬 Langkah selanjutnya:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-body">
            <li>Buka inbox email kamu (cek folder spam juga ya)</li>
            <li>Klik link verifikasi di dalamnya</li>
            <li>Kamu otomatis bisa login</li>
          </ol>
        </div>

        {resent && (
          <div
            role="status"
            className="rounded-lg bg-brand-100 border-2 border-brand-300 text-brand-800 px-4 py-2.5 text-sm"
          >
            ✓ Link verifikasi sudah dikirim ulang.
          </div>
        )}

        <FormError message={error} />

        <Button
          variant="outline"
          className="w-full justify-center"
          disabled={resending || !user || isLoading}
          onClick={async () => {
            setError(null);
            setResending(true);
            try {
              await resendVerificationEmail();
              setResent(true);
            } catch (e) {
              if (isApiError(e) && e.isRateLimited) {
                setError("Terlalu cepat. Tunggu beberapa menit sebelum kirim ulang.");
              } else {
                setError("Gagal kirim ulang. Coba lagi nanti.");
              }
            } finally {
              setResending(false);
            }
          }}
        >
          {resending ? "Mengirim…" : "Kirim ulang link verifikasi"}
        </Button>

        {!user && !isLoading && (
          <p className="text-xs text-muted text-center">
            Tombol kirim ulang tersedia setelah kamu login. Klik link di email
            atau{" "}
            <Link href="/login" className="text-brand-700 underline">
              login dulu
            </Link>
            .
          </p>
        )}
      </div>
    </AuthCard>
  );
}
