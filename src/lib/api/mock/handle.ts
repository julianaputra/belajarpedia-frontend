import { ApiError } from "@/lib/api/error";
import { apiBaseUrl } from "@/lib/api/config";
import {
  MOCK_KURSUS,
  MOCK_SEKOLAH,
  MOCK_UNIVERSITAS,
} from "@/lib/api/mock/facilities";
import {
  MOCK_KURSUS_CATEGORIES,
  MOCK_REGIONS,
} from "@/lib/api/mock/regions";
import type { components } from "@/types/api";

type FacilityCard = NonNullable<components["schemas"]["FacilityCard"]>;
type PaginatedFacilityCardList =
  components["schemas"]["PaginatedFacilityCardList"];

export const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

const PAGE_SIZE = 50;

/**
 * Mock router. Match path against known endpoints; throw 404 ApiError for
 * anything not yet implemented (so caller's error handling exercises the
 * same code paths).
 */
export async function mockHandle<T>(
  rawPath: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const url = parseUrl(rawPath);
  const method = (options.method ?? "GET").toUpperCase();
  const path = url.pathname;
  const params = url.searchParams;

  // ---------------------------------------------------------------------------
  // Auth (stub — Phase 7 will flesh out)
  // ---------------------------------------------------------------------------
  if (path === "/sanctum/csrf-cookie" && method === "GET") {
    return undefined as T;
  }
  if (path === "/api/user" && method === "GET") {
    throw new ApiError(401, { message: "Unauthenticated.", code: "UNAUTHENTICATED" });
  }
  if (path === "/api/logout" && method === "POST") {
    return undefined as T;
  }

  // ---------------------------------------------------------------------------
  // Regions / categories
  // ---------------------------------------------------------------------------
  if (path === "/api/regions/provinces" && method === "GET") {
    return MOCK_REGIONS.map((p, i) => ({
      id: i + 1,
      name: p.name,
      slug: p.slug,
    })) as T;
  }
  if (path === "/api/regions/kabkota" && method === "GET") {
    const slug = params.get("provinsi_slug");
    const province = MOCK_REGIONS.find((p) => p.slug === slug);
    if (!province) return [] as T;
    return province.kabkotas.map((k, i) => ({
      id: i + 1,
      province_id: MOCK_REGIONS.indexOf(province) + 1,
      name: k.name,
      slug: k.slug,
      type: k.type,
    })) as T;
  }
  if (path === "/api/regions/kecamatan" && method === "GET") {
    const slug = params.get("kabkota_slug");
    for (const province of MOCK_REGIONS) {
      const kabkota = province.kabkotas.find((k) => k.slug === slug);
      if (kabkota) {
        return kabkota.kecamatans.map((kec, i) => ({
          id: i + 1,
          kabkota_id: province.kabkotas.indexOf(kabkota) + 1,
          name: kec.name,
          slug: kec.slug,
        })) as T;
      }
    }
    return [] as T;
  }
  if (path === "/api/kursus-categories" && method === "GET") {
    return MOCK_KURSUS_CATEGORIES as T;
  }

  // ---------------------------------------------------------------------------
  // Facility lists
  // ---------------------------------------------------------------------------
  if (path === "/api/sekolah" && method === "GET") {
    return paginate(filterSekolah(params), pageOf(params)) as T;
  }
  if (path === "/api/universitas" && method === "GET") {
    return paginate(filterUniversitas(params), pageOf(params)) as T;
  }
  if (path === "/api/kursus" && method === "GET") {
    const filtered = filterKursus(params);
    // AC-07: Timedoor pinned-top.
    const sorted = [
      ...filtered.filter((f) => f.is_timedoor_academy === true),
      ...filtered.filter((f) => f.is_timedoor_academy !== true),
    ];
    return paginate(sorted, pageOf(params)) as T;
  }

  // ---------------------------------------------------------------------------
  // Search (Phase 6 — naive substring match, AND across name + kabkota)
  // ---------------------------------------------------------------------------
  if (path === "/api/sekolah/search" && method === "GET") {
    return paginate(searchIn(MOCK_SEKOLAH, params), pageOf(params)) as T;
  }
  if (path === "/api/universitas/search" && method === "GET") {
    return paginate(searchIn(MOCK_UNIVERSITAS, params), pageOf(params)) as T;
  }
  if (path === "/api/kursus/search" && method === "GET") {
    return paginate(searchIn(MOCK_KURSUS, params), pageOf(params)) as T;
  }

  // ---------------------------------------------------------------------------
  // Home rekomendasi (Phase 5)
  // ---------------------------------------------------------------------------
  if (path === "/api/home/rekomendasi/sekolah" && method === "GET") {
    return shuffle(MOCK_SEKOLAH).slice(0, 8) as T;
  }
  if (path === "/api/home/rekomendasi/universitas" && method === "GET") {
    return shuffle(MOCK_UNIVERSITAS).slice(0, 8) as T;
  }
  if (path === "/api/home/rekomendasi/kursus" && method === "GET") {
    const td = MOCK_KURSUS.filter((k) => k.is_timedoor_academy === true);
    const general = MOCK_KURSUS.filter((k) => k.is_timedoor_academy !== true);
    return [...shuffle(td).slice(0, 2), ...shuffle(general).slice(0, 6)] as T;
  }

  throw new ApiError(404, {
    message: `Mock: no handler for ${method} ${path}`,
    code: "MOCK_NOT_IMPLEMENTED",
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseUrl(path: string): URL {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return new URL(path);
  }
  return new URL(path, apiBaseUrl);
}

function pageOf(params: URLSearchParams): number {
  const raw = params.get("page");
  const n = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function paginate(
  items: FacilityCard[],
  page: number,
): PaginatedFacilityCardList {
  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const data = items.slice(start, start + PAGE_SIZE);

  return {
    data,
    meta: {
      current_page: page,
      per_page: PAGE_SIZE,
      total,
      last_page: lastPage,
      noindex: total === 0,
    },
  };
}

function filterSekolah(params: URLSearchParams): FacilityCard[] {
  const provinsi = params.get("provinsi");
  const kabkota = params.get("kabkota");
  const kecamatan = params.get("kecamatan");
  const schoolType = params.get("school_type");

  return MOCK_SEKOLAH.filter((f) => matchUrlSegments(f.url ?? "", {
    1: provinsi,
    2: kabkota,
    3: kecamatan,
    4: schoolType,
  }));
}

function filterUniversitas(params: URLSearchParams): FacilityCard[] {
  const provinsi = params.get("provinsi");
  const kabkota = params.get("kabkota");
  const kecamatan = params.get("kecamatan");

  return MOCK_UNIVERSITAS.filter((f) => matchUrlSegments(f.url ?? "", {
    1: provinsi,
    2: kabkota,
    3: kecamatan,
  }));
}

function filterKursus(params: URLSearchParams): FacilityCard[] {
  const provinsi = params.get("provinsi");
  const kabkota = params.get("kabkota");
  const kecamatan = params.get("kecamatan");
  const category = params.get("category");

  return MOCK_KURSUS.filter((f) => matchUrlSegments(f.url ?? "", {
    1: provinsi,
    2: kabkota,
    3: kecamatan,
    4: category,
  }));
}

function matchUrlSegments(
  url: string,
  filters: Record<number, string | null>,
): boolean {
  const segs = url.replace(/^\//, "").split("/"); // ['sekolah', 'bali', 'kab-badung', ...]
  for (const [idx, val] of Object.entries(filters)) {
    if (val !== null && val !== "") {
      if (segs[Number.parseInt(idx, 10)] !== val) return false;
    }
  }
  return true;
}

function searchIn(
  pool: FacilityCard[],
  params: URLSearchParams,
): FacilityCard[] {
  const q = (params.get("q") ?? "").trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  return pool.filter((f) => {
    const blob = `${f.name ?? ""} ${f.kabkota_name ?? ""}`.toLowerCase();
    return tokens.every((t) => blob.includes(t));
  });
}

function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
