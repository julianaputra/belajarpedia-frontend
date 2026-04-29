"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Turnstile } from "@/components/Turnstile";
import { AuthCard, FormError, FieldError } from "@/components/auth/AuthCard";
import { register as registerUser } from "@/lib/api/auth.client";
import { isApiError } from "@/lib/api/error";
import { useKabkotas, useProvinces } from "@/hooks/useRegions";

const passwordRule = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .regex(/[A-Z]/, "Harus mengandung huruf besar")
  .regex(/[a-z]/, "Harus mengandung huruf kecil")
  .regex(/[^A-Za-z0-9]/, "Harus mengandung simbol (!@#$%…)");

const childSchema = z.object({
  gender: z.enum(["male", "female"]),
  birthdate: z.string().min(1, "Tanggal lahir wajib"),
});

const schema = z
  .object({
    email: z.string().email("Format email tidak valid"),
    password: passwordRule,
    password_confirmation: z.string(),
    name: z.string().min(2, "Nama minimal 2 karakter"),
    gender: z.enum(["male", "female"]),
    birthdate: z.string().min(1, "Tanggal lahir wajib"),
    phone: z.string().min(8, "No. HP minimal 8 digit"),
    province_id: z.string().regex(/^[1-9]\d*$/, "Pilih provinsi"),
    kabkota_id: z.string().regex(/^[1-9]\d*$/, "Pilih kab/kota"),
    children: z.array(childSchema).max(20),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register: rhf,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: undefined,
      children: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "children" });
  const provinceId = useWatch({ control, name: "province_id" });

  // Region selectors. Convert id<->slug via mock data — for real backend the
  // API may use IDs directly. Here we use the slug-based hooks.
  const { data: provinces } = useProvinces();
  const provinceSlug = provinces?.find((p) => p.id === Number(provinceId))?.slug;
  const { data: kabkotas } = useKabkotas(provinceSlug ?? null);

  return (
    <AuthCard
      title="Daftar akun baru"
      subtitle="Gratis. Dipakai untuk simpan favorit dan kirim pertanyaan ke fasilitas."
      footer={
        <span>
          Sudah punya akun?{" "}
          <Link href="/login" className="text-brand-700 hover:underline font-semibold">
            Masuk di sini
          </Link>
        </span>
      }
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
            await registerUser({
              ...values,
              province_id: Number.parseInt(values.province_id, 10),
              kabkota_id: Number.parseInt(values.kabkota_id, 10),
              children_count: values.children.length,
              turnstile_token: turnstileToken,
            });
            router.push("/verify-email");
          } catch (e) {
            if (isApiError(e) && e.isValidation) {
              const first = Object.values(e.errors ?? {}).flat()[0];
              setSubmitError(first ?? "Form tidak valid.");
            } else {
              setSubmitError(
                e instanceof Error ? e.message : "Gagal mendaftar. Coba lagi.",
              );
            }
          }
        })}
      >
        {/* Account */}
        <Section title="Akun">
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...rhf("email")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Password"
              htmlFor="password"
              error={errors.password?.message}
              hint="Min. 8 karakter, kombinasi huruf besar/kecil + simbol."
            >
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...rhf("password")}
              />
            </Field>
            <Field
              label="Konfirmasi password"
              htmlFor="password_confirmation"
              error={errors.password_confirmation?.message}
            >
              <Input
                id="password_confirmation"
                type="password"
                autoComplete="new-password"
                {...rhf("password_confirmation")}
              />
            </Field>
          </div>
        </Section>

        {/* Profile */}
        <Section title="Profil">
          <Field label="Nama lengkap" htmlFor="name" error={errors.name?.message}>
            <Input id="name" autoComplete="name" {...rhf("name")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Jenis kelamin"
              htmlFor="gender"
              error={errors.gender?.message}
            >
              <Select id="gender" {...rhf("gender")}>
                <option value="">Pilih</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </Select>
            </Field>
            <Field
              label="Tanggal lahir"
              htmlFor="birthdate"
              error={errors.birthdate?.message}
            >
              <Input id="birthdate" type="date" {...rhf("birthdate")} />
            </Field>
          </div>
          <Field label="No. HP" htmlFor="phone" error={errors.phone?.message}>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+62812…"
              {...rhf("phone")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Provinsi"
              htmlFor="province_id"
              error={errors.province_id?.message}
            >
              <Select
                id="province_id"
                {...rhf("province_id", {
                  onChange: () => setValue("kabkota_id", ""),
                })}
              >
                <option value="">Pilih provinsi</option>
                {provinces?.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Kab/Kota"
              htmlFor="kabkota_id"
              error={errors.kabkota_id?.message}
            >
              <Select
                id="kabkota_id"
                disabled={!provinceSlug}
                {...rhf("kabkota_id")}
              >
                <option value="">
                  {!provinceSlug ? "Pilih provinsi dulu" : "Pilih kab/kota"}
                </option>
                {kabkotas?.map((k) => (
                  <option key={k.id} value={String(k.id)}>
                    {k.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </Section>

        {/* Children */}
        <Section title="Anak">
          <p className="text-sm text-muted">
            Opsional. Untuk kirim email ucapan ulang tahun (bisa kosong).
          </p>
          {fields.map((f, idx) => (
            <div
              key={f.id}
              className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end p-4 rounded-[var(--radius)] border-2 border-dashed border-ink-200"
            >
              <Field
                label={`Anak #${idx + 1} jenis kelamin`}
                htmlFor={`children.${idx}.gender`}
                error={errors.children?.[idx]?.gender?.message}
              >
                <Select id={`children.${idx}.gender`} {...rhf(`children.${idx}.gender`)}>
                  <option value="">Pilih</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </Select>
              </Field>
              <Field
                label="Tanggal lahir"
                htmlFor={`children.${idx}.birthdate`}
                error={errors.children?.[idx]?.birthdate?.message}
              >
                <Input
                  id={`children.${idx}.birthdate`}
                  type="date"
                  {...rhf(`children.${idx}.birthdate`)}
                />
              </Field>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => remove(idx)}
              >
                Hapus
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => append({ gender: "male", birthdate: "" })}
          >
            + Tambah anak
          </Button>
        </Section>

        <Turnstile onVerify={setTurnstileToken} />

        <FormError message={submitError} />

        <Button
          type="submit"
          className="w-full justify-center"
          size="lg"
          disabled={isSubmitting || !turnstileToken}
        >
          {isSubmitting ? "Memproses…" : "Daftar"}
        </Button>

        <p className="text-xs text-muted text-center">
          Dengan mendaftar, kamu setuju dengan{" "}
          <Link href="/privasi" className="underline">
            Kebijakan Privasi
          </Link>{" "}
          kami.
        </p>
      </form>
    </AuthCard>
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
      <legend className="text-sm font-bold uppercase tracking-wider text-ink-700">
        {title}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted mt-1">{hint}</p>}
      <FieldError message={error} />
    </div>
  );
}
