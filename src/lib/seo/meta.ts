import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site/config";

export type Category = "sekolah" | "universitas" | "kursus";

const CATEGORY_LABEL: Record<Category, string> = {
  sekolah: "Sekolah",
  universitas: "Universitas",
  kursus: "Kursus",
};

const SCHOOL_TYPE_LABEL: Record<string, string> = {
  negeri: "Negeri",
  swasta: "Swasta",
  international: "Internasional",
};

export type ListMetaInput = {
  category: Category;
  provinsi?: { name: string; slug: string };
  kabkota?: { name: string; slug: string };
  kecamatan?: { name: string; slug: string };
  schoolType?: "negeri" | "swasta" | "international";
  kursusCategory?: { name: string; slug: string };
  page?: number;
  path: string;
  isZeroResult?: boolean;
};

export type DetailMetaInput = {
  category: Category;
  name: string;
  kabkota?: { name: string };
  provinsi?: { name: string };
  description?: string | null;
  imageUrl?: string | null;
  path: string;
};

export type SearchMetaInput = {
  category: Category;
  query: string;
  page?: number;
  path: string;
};

function pageSuffix(page?: number): string {
  return page && page > 1 ? ` — Halaman ${page}` : "";
}

export function buildListTitle(input: ListMetaInput): string {
  const cat = CATEGORY_LABEL[input.category];
  const parts: string[] = [];

  if (input.category === "sekolah" && input.schoolType) {
    parts.push(`Sekolah ${SCHOOL_TYPE_LABEL[input.schoolType] ?? ""}`.trim());
  } else if (input.category === "kursus" && input.kursusCategory) {
    parts.push(`Kursus ${input.kursusCategory.name}`);
  } else {
    parts.push(cat);
  }

  const region = [
    input.kecamatan?.name,
    input.kabkota?.name,
    input.provinsi?.name,
  ]
    .filter(Boolean)
    .join(", ");

  if (region) parts.push(`di ${region}`);

  return parts.join(" ") + pageSuffix(input.page);
}

export function buildListDescription(input: ListMetaInput): string {
  const title = buildListTitle({ ...input, page: undefined });
  return `Daftar ${title.toLowerCase()} terlengkap di Indonesia. Bandingkan ${
    CATEGORY_LABEL[input.category].toLowerCase()
  } berdasarkan lokasi, biaya, dan informasi penting lainnya di Belajarpedia.`;
}

export function listMetadata(input: ListMetaInput): Metadata {
  const title = buildListTitle(input);
  const description = buildListDescription(input);
  const canonical = absoluteUrl(input.path);
  const noindex = input.isZeroResult === true;

  return {
    title,
    description,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title,
      description,
      url: canonical,
    },
  };
}

export function detailMetadata(input: DetailMetaInput): Metadata {
  const cat = CATEGORY_LABEL[input.category];
  const region = [input.kabkota?.name, input.provinsi?.name]
    .filter(Boolean)
    .join(", ");
  const title = region ? `${input.name} — ${cat} di ${region}` : input.name;
  const description =
    input.description?.slice(0, 160) ??
    `Informasi lengkap ${cat.toLowerCase()} ${input.name}${
      region ? ` di ${region}` : ""
    }: alamat, kontak, biaya, dan fasilitas. Hubungi langsung melalui Belajarpedia.`;
  const url = absoluteUrl(input.path);

  return {
    title,
    description,
    alternates: {},
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title,
      description,
      url,
      images: input.imageUrl ? [{ url: input.imageUrl }] : undefined,
    },
  };
}

export function searchMetadata(input: SearchMetaInput): Metadata {
  const cat = CATEGORY_LABEL[input.category];
  const title = `Pencarian "${input.query}" di ${cat}${pageSuffix(input.page)}`;
  const description = `Hasil pencarian "${input.query}" pada direktori ${cat.toLowerCase()} Belajarpedia.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(input.path) },
    robots: { index: false, follow: true },
  };
}

export function homeMetadata(): Metadata {
  return {
    title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
    description: siteConfig.description,
    alternates: { canonical: absoluteUrl("/") },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
      url: absoluteUrl("/"),
    },
  };
}
