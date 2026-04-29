import type {
  SekolahFilters,
  UniversitasFilters,
  KursusFilters,
} from "@/lib/routing/url-parser";

export type Category = "sekolah" | "universitas" | "kursus";

/** Append `/page/{n}` only when n > 1 (page 1 has no suffix per AC-02). */
function withPage(base: string, page: number): string {
  return page > 1 ? `${base}/page/${page}` : base;
}

export function sekolahListPath(filters: SekolahFilters, page = 1): string {
  const segs = ["/sekolah"];
  if (filters.provinsi) segs.push(filters.provinsi);
  if (filters.kabkota) segs.push(filters.kabkota);
  if (filters.kecamatan) segs.push(filters.kecamatan);
  if (filters.school_type) segs.push(filters.school_type);
  return withPage(segs.join("/"), page);
}

export function sekolahDetailPath(
  filters: Required<SekolahFilters>,
  slug: string,
): string {
  return `/sekolah/${filters.provinsi}/${filters.kabkota}/${filters.kecamatan}/${filters.school_type}/${slug}`;
}

export function universitasListPath(filters: UniversitasFilters, page = 1): string {
  const segs = ["/universitas"];
  if (filters.provinsi) segs.push(filters.provinsi);
  if (filters.kabkota) segs.push(filters.kabkota);
  if (filters.kecamatan) segs.push(filters.kecamatan);
  return withPage(segs.join("/"), page);
}

export function universitasDetailPath(
  filters: Required<UniversitasFilters>,
  slug: string,
): string {
  return `/universitas/${filters.provinsi}/${filters.kabkota}/${filters.kecamatan}/${slug}`;
}

export function kursusListPath(filters: KursusFilters, page = 1): string {
  const segs = ["/kursus"];
  if (filters.provinsi) segs.push(filters.provinsi);
  if (filters.kabkota) segs.push(filters.kabkota);
  if (filters.kecamatan) segs.push(filters.kecamatan);
  if (filters.main_category) segs.push(filters.main_category);
  return withPage(segs.join("/"), page);
}

export function kursusDetailPath(
  filters: Required<KursusFilters>,
  slug: string,
): string {
  return `/kursus/${filters.provinsi}/${filters.kabkota}/${filters.kecamatan}/${filters.main_category}/${slug}`;
}

export function categoryRootPath(category: Category): string {
  return `/${category}`;
}
