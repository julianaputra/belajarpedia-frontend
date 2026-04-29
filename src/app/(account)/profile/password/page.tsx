"use client";

import * as React from "react";

import { Button } from "@/components/ui/Button";
import { Label, PasswordInput } from "@/components/ui/Input";
import { FormError } from "@/components/auth/AuthCard";
import { SectionCard } from "@/components/account/SectionCard";
import { changePassword as changePasswordApi } from "@/lib/api/auth.client";
import { isApiError } from "@/lib/api/error";

export default function PasswordPage() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  return (
    <SectionCard
      title="Ubah Password"
      description="Gunakan password yang panjang dan tidak Anda pakai di situs lain."
    >
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setDone(false);
          if (next !== confirm) {
            setError("Konfirmasi password tidak cocok.");
            return;
          }
          setSaving(true);
          try {
            await changePasswordApi({
              current_password: current,
              password: next,
              password_confirmation: confirm,
            });
            setDone(true);
            setCurrent("");
            setNext("");
            setConfirm("");
          } catch (e) {
            if (isApiError(e) && e.isValidation) {
              const first = Object.values(e.errors ?? {}).flat()[0];
              setError(first ?? "Form tidak valid.");
            } else {
              setError("Gagal mengubah password.");
            }
          } finally {
            setSaving(false);
          }
        }}
      >
        <div>
          <Label htmlFor="cur-pass">Password saat ini</Label>
          <PasswordInput
            id="cur-pass"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="new-pass">Password baru</Label>
            <PasswordInput
              id="new-pass"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="conf-pass">Konfirmasi password baru</Label>
            <PasswordInput
              id="conf-pass"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>
        <FormError message={error} />
        {done && (
          <p className="text-sm text-brand-700 font-semibold">
            ✓ Password berhasil diubah.
          </p>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan…" : "Ubah password"}
        </Button>
      </form>
    </SectionCard>
  );
}
