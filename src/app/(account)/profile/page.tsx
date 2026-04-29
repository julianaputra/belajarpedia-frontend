"use client";

import * as React from "react";

import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { isoDateToday, isoDateYearsAgo } from "@/lib/utils";
import { FormError } from "@/components/auth/AuthCard";
import { SectionCard } from "@/components/account/SectionCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useKabkotas, useProvinces } from "@/hooks/useRegions";
import { updateProfile } from "@/lib/api/auth.client";

export default function ProfileInfoPage() {
  const { user, mutate } = useCurrentUser();

  // Layout already gates auth + shows loading state. If user is somehow null
  // here, return a minimal placeholder.
  if (!user) return null;

  return <ProfileInfoForm user={user} onUpdated={mutate} />;
}

function ProfileInfoForm({
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
  const [provinceId, setProvinceId] = React.useState<number>(
    user.province_id ?? 0,
  );
  const [kabkotaId, setKabkotaId] = React.useState<number>(user.kabkota_id ?? 0);

  const { data: provinces } = useProvinces();
  const provinceSlug = provinces?.find((p) => p.id === provinceId)?.slug;
  const { data: kabkotas } = useKabkotas(provinceSlug ?? null);

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);

  return (
    <SectionCard
      title="Informasi Akun"
      description="Detail pribadi yang dipakai untuk komunikasi dan pengingat ulang tahun."
    >
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
            <SearchableSelect
              id="gender"
              value={gender}
              onChange={(v) => setGender(v as "male" | "female" | "")}
              options={[
                { value: "male", label: "Laki-laki" },
                { value: "female", label: "Perempuan" },
              ]}
              placeholder="Pilih"
              searchable={false}
            />
          </div>
          <div>
            <Label htmlFor="birthdate">Tanggal lahir</Label>
            <DatePicker
              id="birthdate"
              value={birthdate}
              onChange={setBirthdate}
              min={isoDateYearsAgo(120)}
              max={isoDateToday()}
              defaultViewYear={new Date().getFullYear() - 30}
              placeholder="Pilih tanggal lahir"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">No. HP</Label>
          <PhoneInput id="phone" value={phone} onChange={setPhone} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="province">Provinsi</Label>
            <SearchableSelect
              id="province"
              value={provinceId ? String(provinceId) : ""}
              onChange={(v) => {
                setProvinceId(Number(v));
                setKabkotaId(0);
              }}
              options={(provinces ?? []).map((p) => ({
                value: String(p.id),
                label: p.name ?? "",
              }))}
              placeholder="Pilih provinsi"
              searchPlaceholder="Cari provinsi…"
            />
          </div>
          <div>
            <Label htmlFor="kabkota">Kab/Kota</Label>
            <SearchableSelect
              id="kabkota"
              value={kabkotaId ? String(kabkotaId) : ""}
              onChange={(v) => setKabkotaId(Number(v))}
              disabled={!provinceSlug}
              options={(kabkotas ?? []).map((k) => ({
                value: String(k.id),
                label: k.name ?? "",
              }))}
              placeholder={
                !provinceSlug ? "Pilih provinsi dulu" : "Pilih kab/kota"
              }
              searchPlaceholder="Cari kab/kota…"
            />
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
    </SectionCard>
  );
}
