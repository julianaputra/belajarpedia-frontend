"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

type Category = "sekolah" | "universitas" | "kursus";

type Props = {
  category: Category;
  initialQuery: string;
};

const CATEGORY_LABEL: Record<Category, string> = {
  sekolah: "Sekolah",
  universitas: "Universitas",
  kursus: "Kursus",
};

/**
 * Refinement bar at top of search results — prefilled with current query &
 * category. Allows refining the keyword or swapping to a different category
 * which navigates to that category's search page with the same query carried
 * over.
 */
export function SearchRefineBar({ category, initialQuery }: Props) {
  const router = useRouter();
  const [q, setQ] = React.useState(initialQuery);
  const [cat, setCat] = React.useState<Category>(category);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (query.length === 0) return;
    router.push(`/${cat}/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl bg-white border border-ink-100 p-3 sm:p-4"
      role="search"
      aria-label={`Cari di ${CATEGORY_LABEL[category]}`}
    >
      <div className="grid gap-2 sm:grid-cols-[160px_1fr_auto]">
        <SearchableSelect
          value={cat}
          onChange={(v) => setCat(v as Category)}
          options={[
            { value: "sekolah", label: "Sekolah" },
            { value: "universitas", label: "Universitas" },
            { value: "kursus", label: "Kursus" },
          ]}
          searchable={false}
        />
        <Input
          type="search"
          aria-label="Kata kunci"
          placeholder="Refine pencarianmu…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button
          type="submit"
          size="md"
          disabled={q.trim().length === 0}
          className="w-full sm:w-auto justify-center"
        >
          <Search size={18} aria-hidden /> Cari
        </Button>
      </div>
    </form>
  );
}
