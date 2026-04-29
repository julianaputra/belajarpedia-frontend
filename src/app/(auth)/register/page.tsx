"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, UserCircle, MapPin, Baby } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input, Label, PasswordInput } from "@/components/ui/Input";
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

  const { data: provinces } = useProvinces();
  const provinceSlug = provinces?.find((p) => p.id === Number(provinceId))?.slug;
  const { data: kabkotas } = useKabkotas(provinceSlug ?? null);

  return (
    <AuthCard
      title="Buat akun gratis"
      subtitle="Akun ini dipakai untuk simpan favorit, kirim pertanyaan, dan email ucapan ulang tahun."
      footer={
        <span>
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-brand-700 hover:underline font-semibold"
          >
            Masuk di sini
          </Link>
        </span>
      }
    >
      <form
        className="space-y-6"
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
        <Section
          Icon={UserCircle}
          title="Akun login"
          subtitle="Email dan password yang akan kamu pakai untuk masuk."
        >
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...rhf("email")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Password"
              htmlFor="password"
              error={errors.password?.message}
              hint="Min. 8 karakter + huruf besar/kecil + simbol."
            >
              <PasswordInput
                id="password"
                autoComplete="new-password"
                {...rhf("password")}
              />
            </Field>
            <Field
              label="Konfirmasi password"
              htmlFor="password_confirmation"
              error={errors.password_confirmation?.message}
            >
              <PasswordInput
                id="password_confirmation"
                autoComplete="new-password"
                {...rhf("password_confirmation")}
              />
            </Field>
          </div>
        </Section>

        {/* Profile */}
        <Section
          Icon={MapPin}
          title="Data diri"
          subtitle="Sebagian dipakai untuk personalisasi rekomendasi."
        >
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
        <Section
          Icon={Baby}
          title="Data anak"
          subtitle="Opsional — boleh dikosongkan. Diisi kalau ingin terima email ucapan ulang tahun anak."
          optional
        >
          {fields.length > 0 && (
            <div className="space-y-3">
              {fields.map((f, idx) => (
                <div
                  key={f.id}
                  className="rounded-xl border border-dashed border-ink-200 bg-ink-50/40 p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <p className="text-sm font-semibold text-ink-700">
                      Anak #{idx + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-coral-500 hover:text-coral-500/80"
                    >
                      <Trash2 size={14} aria-hidden /> Hapus
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Jenis kelamin"
                      htmlFor={`children.${idx}.gender`}
                      error={errors.children?.[idx]?.gender?.message}
                    >
                      <Select
                        id={`children.${idx}.gender`}
                        {...rhf(`children.${idx}.gender`)}
                      >
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
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => append({ gender: "male", birthdate: "" })}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-dashed border-ink-300 text-sm font-medium text-ink-700 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50 transition-colors"
          >
            <Plus size={16} aria-hidden />
            Tambah data anak
          </button>
        </Section>

        <div className="border-t border-ink-100 pt-5 space-y-4">
          <Turnstile onVerify={setTurnstileToken} />

          <FormError message={submitError} />

          <Button
            type="submit"
            className="w-full justify-center"
            size="lg"
            disabled={isSubmitting || !turnstileToken}
          >
            {isSubmitting ? "Memproses…" : "Buat akun"}
          </Button>

          <p className="text-xs text-muted text-center leading-relaxed">
            Dengan mendaftar, kamu setuju dengan{" "}
            <Link href="/privasi" className="text-brand-700 hover:underline">
              Kebijakan Privasi
            </Link>{" "}
            kami. Data anak hanya dipakai untuk email ucapan ulang tahun.
          </p>
        </div>
      </form>
    </AuthCard>
  );
}

function Section({
  Icon,
  title,
  subtitle,
  optional,
  children,
}: {
  Icon: typeof UserCircle;
  title: string;
  subtitle?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="w-full">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex-shrink-0">
            <Icon size={16} aria-hidden />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-ink-700">{title}</h2>
              {optional && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-ink-50 px-1.5 py-0.5 rounded">
                  Opsional
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
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
