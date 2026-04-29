"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Label, PasswordInput } from "@/components/ui/Input";
import { FormError } from "@/components/auth/AuthCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { deleteAccount, logout } from "@/lib/api/auth.client";

export default function DangerPage() {
  const router = useRouter();
  const { mutate } = useCurrentUser();
  const [confirming, setConfirming] = React.useState(false);
  const [pwd, setPwd] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  return (
    <section className="rounded-2xl border-2 border-coral-400 bg-coral-400/5 p-5 sm:p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold text-coral-500">
          Zona Berbahaya
        </h2>
        <p className="text-sm text-body">
          Logout dari sesi ini, atau hapus akun secara permanen.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await logout();
              await mutate();
              router.push("/");
            } finally {
              setBusy(false);
            }
          }}
        >
          Logout
        </Button>

        {!confirming ? (
          <Button variant="danger" onClick={() => setConfirming(true)}>
            Hapus akun…
          </Button>
        ) : (
          <form
            className="w-full space-y-3 rounded-lg bg-white border border-coral-400 p-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!pwd) {
                setError("Masukkan password untuk konfirmasi.");
                return;
              }
              setError(null);
              setBusy(true);
              try {
                await deleteAccount({ current_password: pwd });
                await mutate();
                router.push("/?account_deleted=1");
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "Gagal menghapus akun.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <p className="text-sm text-body">
              Akun akan dijadwalkan dihapus permanen dalam{" "}
              <strong>14 hari</strong>. Login dalam periode tersebut akan
              membatalkan penghapusan.
            </p>
            <div>
              <Label htmlFor="del-pass">Password untuk konfirmasi</Label>
              <PasswordInput
                id="del-pass"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </div>
            <FormError message={error} />
            <div className="flex gap-2">
              <Button type="submit" variant="danger" disabled={busy}>
                {busy ? "Memproses…" : "Ya, hapus akun"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setConfirming(false);
                  setPwd("");
                  setError(null);
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
