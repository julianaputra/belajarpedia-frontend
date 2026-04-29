/**
 * Hierarchical URL parsing for the three category catch-all routes.
 *
 * URL shapes (per spec):
 *   Sekolah     /sekolah/{provinsi?}/{kabkota?}/{kecamatan?}/{school_type?}/{slug?}
 *   Universitas /universitas/{provinsi?}/{kabkota?}/{kecamatan?}/{slug?}
 *   Kursus      /kursus/{provinsi?}/{kabkota?}/{kecamatan?}/{main_category?}/{slug?}
 *
 * Pagination is appended at any list level: `.../page/{n}`.
 * Decision §6.4 — path-segment, not query-string.
 *
 * Returns a discriminated union the page handler can switch on.
 */

export type SchoolType = "negeri" | "swasta" | "international";

export type SekolahRoute =
  | { kind: "list"; level: SekolahLevel; filters: SekolahFilters; page: number }
  | { kind: "detail"; filters: Required<SekolahFilters>; slug: string }
  | { kind: "invalid" };

export type UniversitasRoute =
  | { kind: "list"; level: UniversitasLevel; filters: UniversitasFilters; page: number }
  | { kind: "detail"; filters: Required<UniversitasFilters>; slug: string }
  | { kind: "invalid" };

export type KursusRoute =
  | { kind: "list"; level: KursusLevel; filters: KursusFilters; page: number }
  | { kind: "detail"; filters: Required<KursusFilters>; slug: string }
  | { kind: "invalid" };

export type SekolahLevel = "root" | "provinsi" | "kabkota" | "kecamatan" | "leaf";
export type UniversitasLevel = "root" | "provinsi" | "kabkota" | "kecamatan";
export type KursusLevel = "root" | "provinsi" | "kabkota" | "kecamatan" | "category";

export type SekolahFilters = {
  provinsi?: string;
  kabkota?: string;
  kecamatan?: string;
  school_type?: SchoolType;
};
export type UniversitasFilters = {
  provinsi?: string;
  kabkota?: string;
  kecamatan?: string;
};
export type KursusFilters = {
  provinsi?: string;
  kabkota?: string;
  kecamatan?: string;
  main_category?: string;
};

const SCHOOL_TYPES: ReadonlySet<string> = new Set([
  "negeri",
  "swasta",
  "international",
]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PAGE_PATTERN = /^[1-9]\d{0,3}$/;

/** Strip a trailing `/page/{n}` if present. Returns base segments + page (1 if absent). */
function extractPage(segments: readonly string[]): { base: string[]; page: number } {
  if (segments.length >= 2) {
    const last = segments[segments.length - 1];
    const prev = segments[segments.length - 2];
    if (prev === "page" && last !== undefined && PAGE_PATTERN.test(last)) {
      return {
        base: segments.slice(0, -2),
        page: Number.parseInt(last, 10),
      };
    }
  }
  return { base: [...segments], page: 1 };
}

function isValidSlug(s: string | undefined): s is string {
  return typeof s === "string" && SLUG_PATTERN.test(s);
}

function isSchoolType(s: string | undefined): s is SchoolType {
  return typeof s === "string" && SCHOOL_TYPES.has(s);
}

export function parseSekolahPath(path: readonly string[] | undefined): SekolahRoute {
  const segments = path ?? [];
  const { base, page } = extractPage(segments);

  // Detail: 5 segments [provinsi, kabkota, kecamatan, school_type, slug]
  if (base.length === 5 && page === 1) {
    const [provinsi, kabkota, kecamatan, schoolType, slug] = base;
    if (
      isValidSlug(provinsi) &&
      isValidSlug(kabkota) &&
      isValidSlug(kecamatan) &&
      isSchoolType(schoolType) &&
      isValidSlug(slug)
    ) {
      return {
        kind: "detail",
        filters: { provinsi, kabkota, kecamatan, school_type: schoolType },
        slug,
      };
    }
    return { kind: "invalid" };
  }

  if (base.length > 5) return { kind: "invalid" };
  for (const seg of base) {
    if (!isValidSlug(seg)) return { kind: "invalid" };
  }

  if (base.length === 0) {
    return { kind: "list", level: "root", filters: {}, page };
  }
  if (base.length === 1) {
    return { kind: "list", level: "provinsi", filters: { provinsi: base[0] }, page };
  }
  if (base.length === 2) {
    return {
      kind: "list",
      level: "kabkota",
      filters: { provinsi: base[0]!, kabkota: base[1] },
      page,
    };
  }
  if (base.length === 3) {
    return {
      kind: "list",
      level: "kecamatan",
      filters: { provinsi: base[0]!, kabkota: base[1]!, kecamatan: base[2] },
      page,
    };
  }
  // length === 4 → leaf list with school_type
  const schoolType = base[3];
  if (!isSchoolType(schoolType)) return { kind: "invalid" };
  return {
    kind: "list",
    level: "leaf",
    filters: {
      provinsi: base[0]!,
      kabkota: base[1]!,
      kecamatan: base[2]!,
      school_type: schoolType,
    },
    page,
  };
}

export function parseUniversitasPath(
  path: readonly string[] | undefined,
): UniversitasRoute {
  const segments = path ?? [];
  const { base, page } = extractPage(segments);

  // Detail: 4 segments [provinsi, kabkota, kecamatan, slug]
  if (base.length === 4 && page === 1) {
    const [provinsi, kabkota, kecamatan, slug] = base;
    if (
      isValidSlug(provinsi) &&
      isValidSlug(kabkota) &&
      isValidSlug(kecamatan) &&
      isValidSlug(slug)
    ) {
      return {
        kind: "detail",
        filters: { provinsi, kabkota, kecamatan },
        slug,
      };
    }
    return { kind: "invalid" };
  }

  if (base.length > 4) return { kind: "invalid" };
  for (const seg of base) {
    if (!isValidSlug(seg)) return { kind: "invalid" };
  }

  if (base.length === 0) {
    return { kind: "list", level: "root", filters: {}, page };
  }
  if (base.length === 1) {
    return { kind: "list", level: "provinsi", filters: { provinsi: base[0] }, page };
  }
  if (base.length === 2) {
    return {
      kind: "list",
      level: "kabkota",
      filters: { provinsi: base[0]!, kabkota: base[1] },
      page,
    };
  }
  // length === 3 → kecamatan list
  return {
    kind: "list",
    level: "kecamatan",
    filters: { provinsi: base[0]!, kabkota: base[1]!, kecamatan: base[2] },
    page,
  };
}

export function parseKursusPath(path: readonly string[] | undefined): KursusRoute {
  const segments = path ?? [];
  const { base, page } = extractPage(segments);

  // Detail: 5 segments [provinsi, kabkota, kecamatan, main_category, slug]
  if (base.length === 5 && page === 1) {
    const [provinsi, kabkota, kecamatan, mainCategory, slug] = base;
    if (
      isValidSlug(provinsi) &&
      isValidSlug(kabkota) &&
      isValidSlug(kecamatan) &&
      isValidSlug(mainCategory) &&
      isValidSlug(slug)
    ) {
      return {
        kind: "detail",
        filters: {
          provinsi,
          kabkota,
          kecamatan,
          main_category: mainCategory,
        },
        slug,
      };
    }
    return { kind: "invalid" };
  }

  if (base.length > 5) return { kind: "invalid" };
  for (const seg of base) {
    if (!isValidSlug(seg)) return { kind: "invalid" };
  }

  if (base.length === 0) {
    return { kind: "list", level: "root", filters: {}, page };
  }
  if (base.length === 1) {
    return { kind: "list", level: "provinsi", filters: { provinsi: base[0] }, page };
  }
  if (base.length === 2) {
    return {
      kind: "list",
      level: "kabkota",
      filters: { provinsi: base[0]!, kabkota: base[1] },
      page,
    };
  }
  if (base.length === 3) {
    return {
      kind: "list",
      level: "kecamatan",
      filters: { provinsi: base[0]!, kabkota: base[1]!, kecamatan: base[2] },
      page,
    };
  }
  // length === 4 → category list
  return {
    kind: "list",
    level: "category",
    filters: {
      provinsi: base[0]!,
      kabkota: base[1]!,
      kecamatan: base[2]!,
      main_category: base[3],
    },
    page,
  };
}
