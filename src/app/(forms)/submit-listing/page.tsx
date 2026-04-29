"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Turnstile } from "@/components/Turnstile";
import { FieldError, FormError } from "@/components/auth/AuthCard";
import { FormShell, FormSuccess } from "@/components/forms/FormShell";
import {
  useKabkotas,
  useKecamatans,
  useProvinces,
} from "@/hooks/useRegions";
import { submitRegistrationRequest } from "@/lib/api/public-forms.client";
import { isApiError } from "@/lib/api/error";

const schema = z.object({
  facility_name: z.string().min(2, "Nama fasilitas minimal 2 karakter"),
  category: z.enum(["sekolah", "universitas", "kursus"]),
  province_id: z.string().regex(/^[1-9]\d*$/, "Pilih provinsi"),
  kabkota_id: z.string().regex(/^[1-9]\d*$/, "Pilih kab/kota"),
  kecamatan_id: z.string().regex(/^[1-9]\d*$/, "Pilih kecamatan"),
  address: z.string().optional(),
  website: z.string().url("URL tidak valid").optional().or(z.literal("")),
  phone: z.string().optional(),
  requester_name: z.string().min(2, "Nama minimal 2 karakter"),
  requester_email: z.string().email("Format email tidak valid"),
  message: z
    .string()
    .min(20, "Pesan minimal 20 karakter")
    .max(5000, "Pesan maksimal 5000 karakter"),
});
type FormValues = z.infer<typeof schema>;

export default function SubmitListingPage() {
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const provinceId = useWatch({ control, name: "province_id" });
  const kabkotaId = useWatch({ control, name: "kabkota_id" });

  const { data: provinces } = useProvinces();
  const provinceSlug = provinces?.find((p) => p.id === Number(provinceId))?.slug;
  const { data: kabkotas } = useKabkotas(provinceSlug ?? null);
  const kabkotaSlug = kabkotas?.find((k) => k.id === Number(kabkotaId))?.slug;
  const { data: kecamatans } = useKecamatans(kabkotaSlug ?? null);

  if (success) {
    return (
      <FormSuccess
        title="Permintaan diterima ✓"
        body="Terima kasih sudah mendaftarkan fasilitasmu. Tim Belajarpedia akan review dan menghubungi via email dalam 5 hari kerja."
      />
    );
  }

  return (
    <FormShell
      emoji="🏫"
      eyebrow="Daftarkan fasilitas"
      title="Daftarkan sekolah, universitas, atau kursus"
      subtitle="Gratis. Setelah submit, tim kami akan review dan menghubungimu untuk verifikasi."
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit(async (values) => {
          if (!turnstileToken) {
            setSubmitError("Verifikasi keamanan belum selesai.");
            return;
          }
          setSubmitError(null);
          try {
            await submitRegistrationRequest({
              facility_name: values.facility_name,
              category: values.category,
              province_id: Number.parseInt(values.province_id, 10),
              kabkota_id: Number.parseInt(values.kabkota_id, 10),
              kecamatan_id: Number.parseInt(values.kecamatan_id, 10),
              address: values.address || undefined,
              website: values.website || null,
              phone: values.phone || null,
              requester_name: values.requester_name,
              requester_email: values.requester_email,
              message: values.message,
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
        <Section title="Tentang fasilitas">
          <div>
            <Label htmlFor="facility_name">Nama fasilitas</Label>
            <Input
              id="facility_name"
              placeholder="SMA Negeri 1 Denpasar / Timedoor Academy / dll."
              {...register("facility_name")}
            />
            <FieldError message={errors.facility_name?.message} />
          </div>

          <div>
            <Label htmlFor="category">Kategori</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <SearchableSelect
                  id="category"
                  value={field.value ?? ""}
                  onChange={(v) => field.onChange(v)}
                  onBlur={field.onBlur}
                  options={[
                    { value: "sekolah", label: "Sekolah (SD/SMP/SMA/SMK)" },
                    { value: "universitas", label: "Universitas / Perguruan Tinggi" },
                    { value: "kursus", label: "Kursus / Lembaga Pelatihan" },
                  ]}
                  placeholder="Pilih kategori"
                  searchable={false}
                />
              )}
            />
            <FieldError message={errors.category?.message} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="province_id">Provinsi</Label>
              <Controller
                control={control}
                name="province_id"
                render={({ field }) => (
                  <SearchableSelect
                    id="province_id"
                    value={field.value ?? ""}
                    onChange={(v) => {
                      field.onChange(v);
                      setValue("kabkota_id", "");
                      setValue("kecamatan_id", "");
                    }}
                    onBlur={field.onBlur}
                    options={(provinces ?? []).map((p) => ({
                      value: String(p.id),
                      label: p.name ?? "",
                    }))}
                    placeholder="Pilih"
                    searchPlaceholder="Cari provinsi…"
                  />
                )}
              />
              <FieldError message={errors.province_id?.message} />
            </div>

            <div>
              <Label htmlFor="kabkota_id">Kab/Kota</Label>
              <Controller
                control={control}
                name="kabkota_id"
                render={({ field }) => (
                  <SearchableSelect
                    id="kabkota_id"
                    value={field.value ?? ""}
                    onChange={(v) => {
                      field.onChange(v);
                      setValue("kecamatan_id", "");
                    }}
                    onBlur={field.onBlur}
                    disabled={!provinceSlug}
                    options={(kabkotas ?? []).map((k) => ({
                      value: String(k.id),
                      label: k.name ?? "",
                    }))}
                    placeholder="Pilih"
                    searchPlaceholder="Cari kab/kota…"
                  />
                )}
              />
              <FieldError message={errors.kabkota_id?.message} />
            </div>

            <div>
              <Label htmlFor="kecamatan_id">Kecamatan</Label>
              <Controller
                control={control}
                name="kecamatan_id"
                render={({ field }) => (
                  <SearchableSelect
                    id="kecamatan_id"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={!kabkotaSlug}
                    options={(kecamatans ?? []).map((k) => ({
                      value: String(k.id),
                      label: k.name ?? "",
                    }))}
                    placeholder="Pilih"
                    searchPlaceholder="Cari kecamatan…"
                  />
                )}
              />
              <FieldError message={errors.kecamatan_id?.message} />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Alamat lengkap (opsional)</Label>
            <Input
              id="address"
              placeholder="Jl. Raya Kuta No. 123"
              {...register("address")}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="website">Website (opsional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://"
                {...register("website")}
              />
              <FieldError message={errors.website?.message} />
            </div>
            <div>
              <Label htmlFor="phone">No. Telepon (opsional)</Label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <PhoneInput
                    id="phone"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </div>
          </div>
        </Section>

        <Section title="Tentang kamu">
          <p className="text-sm text-muted">
            Kami pakai info ini untuk verifikasi. Tidak ditampilkan publik.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="requester_name">Nama lengkap</Label>
              <Input id="requester_name" {...register("requester_name")} />
              <FieldError message={errors.requester_name?.message} />
            </div>
            <div>
              <Label htmlFor="requester_email">Email</Label>
              <Input
                id="requester_email"
                type="email"
                {...register("requester_email")}
              />
              <FieldError message={errors.requester_email?.message} />
            </div>
          </div>

          <div>
            <Label htmlFor="message">
              Hubunganmu dengan fasilitas + info tambahan
            </Label>
            <textarea
              id="message"
              rows={5}
              className="w-full rounded-lg border border-ink-200 bg-white px-4 py-3 text-base text-body placeholder:text-muted transition-[border-color,box-shadow] hover:border-ink-300 focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_var(--color-brand-100)]"
              placeholder="Saya pemilik / staf / orangtua siswa di… Mau request tambah listing karena…"
              {...register("message")}
            />
            <FieldError message={errors.message?.message} />
          </div>
        </Section>

        <Turnstile onVerify={setTurnstileToken} />
        <FormError message={submitError} />

        <Button
          type="submit"
          size="lg"
          className="w-full justify-center"
          disabled={isSubmitting || !turnstileToken}
        >
          {isSubmitting ? "Mengirim…" : "Kirim permintaan"}
        </Button>
      </form>
    </FormShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-semibold uppercase tracking-wider text-ink-700">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
