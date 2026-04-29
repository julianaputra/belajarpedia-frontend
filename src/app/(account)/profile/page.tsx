"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import { Button } from "@/components/ui/Button";
import { Input, Label, PasswordInput } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormError } from "@/components/auth/AuthCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useKabkotas, useProvinces } from "@/hooks/useRegions";
import {
  addChild,
  changePassword as changePasswordApi,
  deleteAccount,
  deleteChild,
  listChildren,
  logout,
  updateProfile,
} from "@/lib/api/auth.client";
import { isApiError } from "@/lib/api/error";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, mutate } = useCurrentUser();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login?returnTo=/profile");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-10 text-muted">Memuat profil…</main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-ink-700">
          Akun saya
        </h1>
        <p className="text-muted">
          {user.email}{" "}
          {user.email_verified_at ? (
            <span className="text-brand-700 font-semibold">✓ Terverifikasi</span>
          ) : (
            <span className="text-coral-500 font-semibold">Belum diverifikasi</span>
          )}
        </p>
      </header>

      <ProfileInfoSection user={user} onUpdated={mutate} />
      <ChildrenSection />
      <ChangePasswordSection />
      <DangerZone onLogout={mutate} />
    </main>
  );
}

// =============================================================================
// Profile info
// =============================================================================

function ProfileInfoSection({
  user,
  onUpdated,
}: {
  user: NonNullable<ReturnType<typeof useCurrentUser>["user"]>;
  onUpdated: () => void;
}) {
  const [name, setName] = React.useState(user.name ?? "");
  const [phone, setPhone] = React.useState(user.phone ?? "");
  const [gender, setGender] = React.useState<"male" | "female" | "">(
    user.gender ?? "",
  );
  const [birthdate, setBirthdate] = React.useState(user.birthdate ?? "");
  const [provinceId, setProvinceId] = React.useState<number>(user.province_id ?? 0);
  const [kabkotaId, setKabkotaId] = React.useState<number>(user.kabkota_id ?? 0);

  const { data: provinces } = useProvinces();
  const provinceSlug = provinces?.find((p) => p.id === provinceId)?.slug;
  const { data: kabkotas } = useKabkotas(provinceSlug ?? null);

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);

  return (
    <Section title="Informasi akun">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setSaving(true);
          try {
            await updateProfile({
              name,
              phone,
              gender: gender || undefined,
              birthdate: birthdate || undefined,
              province_id: provinceId || undefined,
              kabkota_id: kabkotaId || undefined,
            });
            await onUpdated();
            setSavedAt(Date.now());
          } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal menyimpan.");
          } finally {
            setSaving(false);
          }
        }}
      >
        <div>
          <Label htmlFor="name">Nama lengkap</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="gender">Jenis kelamin</Label>
            <Select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as "male" | "female" | "")}
            >
              <option value="">Pilih</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="birthdate">Tanggal lahir</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">No. HP</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="province">Provinsi</Label>
            <Select
              id="province"
              value={provinceId}
              onChange={(e) => {
                setProvinceId(Number(e.target.value));
                setKabkotaId(0);
              }}
            >
              <option value={0}>Pilih provinsi</option>
              {provinces?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="kabkota">Kab/Kota</Label>
            <Select
              id="kabkota"
              value={kabkotaId}
              onChange={(e) => setKabkotaId(Number(e.target.value))}
              disabled={!provinceSlug}
            >
              <option value={0}>Pilih kab/kota</option>
              {kabkotas?.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <FormError message={error} />

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan perubahan"}
          </Button>
          {savedAt && (
            <span className="text-sm text-brand-700 font-semibold">
              ✓ Tersimpan
            </span>
          )}
        </div>
      </form>
    </Section>
  );
}

// =============================================================================
// Children CRUD
// =============================================================================

function ChildrenSection() {
  const { data, mutate, isLoading } = useSWR(
    "user:children",
    listChildren,
  );
  const [showAdd, setShowAdd] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <Section title="Anak-anak">
      <p className="text-sm text-muted">
        Untuk email ucapan ulang tahun. Boleh kosong.
      </p>

      {isLoading && <p className="text-muted text-sm">Memuat…</p>}

      <div className="space-y-2">
        {(data ?? []).map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-3 rounded-[var(--radius)] border-2 border-ink-100 px-4 py-3"
          >
            <div className="text-sm">
              <span className="font-semibold text-ink-700">
                {c.gender === "male" ? "Laki-laki" : "Perempuan"}
              </span>{" "}
              <span className="text-muted">• Lahir {formatDate(c.birthdate)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                if (!c.id) return;
                if (!confirm("Hapus data anak ini?")) return;
                try {
                  await deleteChild(c.id);
                  await mutate();
                } catch {
                  setError("Gagal menghapus.");
                }
              }}
            >
              Hapus
            </Button>
          </div>
        ))}
      </div>

      <FormError message={error} />

      {showAdd ? (
        <AddChildForm
          onCancel={() => setShowAdd(false)}
          onAdded={async () => {
            setShowAdd(false);
            await mutate();
          }}
        />
      ) : (
        <Button variant="outline" onClick={() => setShowAdd(true)}>
          + Tambah anak
        </Button>
      )}
    </Section>
  );
}

function AddChildForm({
  onAdded,
  onCancel,
}: {
  onAdded: () => void;
  onCancel: () => void;
}) {
  const [gender, setGender] = React.useState<"male" | "female">("male");
  const [birthdate, setBirthdate] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!birthdate) {
          setError("Tanggal lahir wajib diisi.");
          return;
        }
        setSaving(true);
        setError(null);
        try {
          await addChild({ gender, birthdate });
          onAdded();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Gagal menambah.");
        } finally {
          setSaving(false);
        }
      }}
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end p-4 rounded-[var(--radius)] border-2 border-dashed border-ink-200"
    >
      <div>
        <Label htmlFor="add-gender">Jenis kelamin</Label>
        <Select
          id="add-gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as "male" | "female")}
        >
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="add-birth">Tanggal lahir</Label>
        <Input
          id="add-birth"
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "…" : "Simpan"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
      </div>
      {error && <p className="text-sm text-coral-500 sm:col-span-3">{error}</p>}
    </form>
  );
}

// =============================================================================
// Change password
// =============================================================================

function ChangePasswordSection() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  return (
    <Section title="Ubah password">
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
    </Section>
  );
}

// =============================================================================
// Danger Zone
// =============================================================================

function DangerZone({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();
  const [confirming, setConfirming] = React.useState(false);
  const [pwd, setPwd] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  return (
    <section className="rounded-[var(--radius-lg)] border-2 border-coral-400 bg-coral-400/5 p-5 sm:p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="font-display font-semibold text-xl text-coral-500">
          Zona berbahaya
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
              await onLogout();
              router.push("/");
            } finally {
              setBusy(false);
            }
          }}
        >
          Logout
        </Button>

        {!confirming ? (
          <Button variant="ghost" onClick={() => setConfirming(true)}>
            Hapus akun…
          </Button>
        ) : (
          <form
            className="w-full space-y-3 rounded-[var(--radius)] bg-white border-2 border-coral-400 p-4"
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
                await onLogout();
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
              <Button type="submit" disabled={busy}>
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

// =============================================================================
// Helpers
// =============================================================================

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-lg)] bg-white border-2 border-ink-100 p-5 sm:p-6 space-y-4">
      <h2 className="font-display font-semibold text-xl text-ink-700">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
