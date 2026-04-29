"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type Category = "" | "sekolah" | "universitas" | "kursus";

/**
 * Hero search bar (spec §4.5.5): user must pick a category before submit.
 * Submits to /{category}/search?q=… (Phase 6 page).
 */
export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [category, setCategory] = React.useState<Category>("");
  const [q, setQ] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || q.trim().length === 0) return;
    const url = `/${category}/search?q=${encodeURIComponent(q.trim())}`;
    router.push(url);
  };

  const canSubmit = category !== "" && q.trim().length > 0;

  return (
    <form
      onSubmit={submit}
      className={
        "rounded-[var(--radius-xl)] bg-white p-3 shadow-[var(--shadow-lift)] border-2 border-ink-100 " +
        (className ?? "")
      }
      role="search"
    >
      <div className="grid gap-2 sm:grid-cols-[180px_1fr_auto]">
        <Select
          aria-label="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          required
        >
          <option value="">Pilih kategori</option>
          <option value="sekolah">Sekolah</option>
          <option value="universitas">Universitas</option>
          <option value="kursus">Kursus</option>
        </Select>
        <Input
          type="search"
          aria-label="Kata kunci pencarian"
          placeholder="Cari nama sekolah atau kota…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="submit" size="md" disabled={!canSubmit}>
          <Search size={18} aria-hidden /> Cari
        </Button>
      </div>
    </form>
  );
}
