"use client";

import * as React from "react";
import useSWR from "swr";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { isoDateToday, isoDateYearsAgo } from "@/lib/utils";
import { FormError } from "@/components/auth/AuthCard";
import { SectionCard } from "@/components/account/SectionCard";
import { addChild, deleteChild, listChildren } from "@/lib/api/auth.client";

export default function ChildrenPage() {
  const { data, mutate, isLoading } = useSWR("user:children", listChildren);
  const [showAdd, setShowAdd] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <SectionCard
      title="Anak-anak"
      description="Untuk email ucapan ulang tahun. Boleh kosong."
    >
      {isLoading && <p className="text-muted text-sm">Memuat…</p>}

      <div className="space-y-2">
        {(data ?? []).map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 px-4 py-3"
          >
            <div className="text-sm">
              <span className="font-semibold text-ink-700">
                {c.gender === "male" ? "Laki-laki" : "Perempuan"}
              </span>{" "}
              <span className="text-muted">
                • Lahir {formatDate(c.birthdate)}
              </span>
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
    </SectionCard>
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
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end p-4 rounded-lg border border-dashed border-ink-200"
    >
      <div>
        <Label htmlFor="add-gender">Jenis kelamin</Label>
        <SearchableSelect
          id="add-gender"
          value={gender}
          onChange={(v) => setGender(v as "male" | "female")}
          options={[
            { value: "male", label: "Laki-laki" },
            { value: "female", label: "Perempuan" },
          ]}
          searchable={false}
        />
      </div>
      <div>
        <Label htmlFor="add-birth">Tanggal lahir</Label>
        <DatePicker
          id="add-birth"
          value={birthdate}
          onChange={setBirthdate}
          min={isoDateYearsAgo(25)}
          max={isoDateToday()}
          defaultViewYear={new Date().getFullYear() - 10}
          placeholder="Pilih tanggal lahir"
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
