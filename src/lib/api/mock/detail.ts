import type { components } from "@/types/api";
import {
  MOCK_KURSUS,
  MOCK_SEKOLAH,
  MOCK_UNIVERSITAS,
} from "@/lib/api/mock/facilities";
import {
  MOCK_KURSUS_CATEGORIES,
  MOCK_REGIONS,
} from "@/lib/api/mock/regions";

type FacilityCard = NonNullable<components["schemas"]["FacilityCard"]>;
type FacilityBase = components["schemas"]["FacilityBase"];
type SekolahDetail = components["schemas"]["SekolahDetail"];
type UniversitasDetail = components["schemas"]["UniversitasDetail"];
type KursusDetail = components["schemas"]["KursusDetail"];

/**
 * Deterministic pseudo-random per slug. Same URL always yields same detail.
 * Used to keep AC-08 (conditional fields) testable across reloads.
 */
function seedFromString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function maybe<T>(rand: () => number, value: T, dropChance = 0.25): T | null {
  return rand() < dropChance ? null : value;
}

const SAMPLE_DESCRIPTIONS = [
  "Lembaga pendidikan dengan komitmen tinggi pada pengembangan karakter dan akademik siswa. Kami percaya setiap anak unik dan berhak mendapat pendekatan terbaik.",
  "Sekolah modern dengan fasilitas lengkap, pengajar berpengalaman, dan kurikulum berbasis kompetensi. Lokasi strategis dengan transportasi mudah.",
  "Berkomitmen membangun generasi unggul melalui pendidikan holistik. Lingkungan belajar yang aman, nyaman, dan menyenangkan.",
  "Kombinasi pendidikan akademik berkualitas dengan kegiatan ekstrakurikuler beragam untuk pengembangan minat dan bakat siswa.",
  "Institusi pendidikan dengan rekam jejak prestasi nasional dan internasional. Didukung tenaga pendidik bersertifikasi dan fasilitas mutakhir.",
];

const SAMPLE_BIAYA = [
  "Rp 1.500.000 / bulan + uang gedung Rp 5.000.000",
  "SPP Rp 850.000 / bulan, biaya masuk Rp 7.500.000",
  "Mulai dari Rp 2.000.000 / bulan, biaya pendaftaran Rp 1.000.000",
  "Gratis untuk siswa berprestasi (jalur beasiswa)",
  "Biaya pendaftaran Rp 350.000, SPP Rp 1.200.000 / bulan",
];

const SAMPLE_KURIKULUM = [
  "Kurikulum Merdeka",
  "Kurikulum Cambridge International",
  "Kurikulum Nasional Plus",
  "IB (International Baccalaureate)",
  "Kurikulum 2013 dengan tambahan program tahfidz",
];

const SAMPLE_AKREDITASI = ["A", "B", "Unggul", "Baik Sekali"];

const SAMPLE_JAM = [
  "Senin–Jumat, 07:00–14:30",
  "Senin–Jumat, 07:30–15:00; Sabtu 07:30–11:00",
  "Full-day, Senin–Jumat 07:00–16:00",
];

const SAMPLE_FASILITAS = [
  "Lab komputer, perpustakaan, lapangan olahraga, kantin sehat, ruang seni, masjid sekolah",
  "Studio musik, lab sains, gym, kolam renang, taman bermain, ruang multimedia",
  "Auditorium, lab bahasa, lapangan futsal, klinik sekolah, ruang konseling",
];

const SAMPLE_PROGRAM_STUDI = [
  "Teknik Informatika, Sistem Informasi, Manajemen, Akuntansi, Hukum",
  "Kedokteran, Teknik Sipil, Arsitektur, Psikologi, Sastra Inggris",
  "Komunikasi, Desain Grafis, Bisnis Digital, Hospitality Management",
];

const SAMPLE_JALUR_MASUK = [
  "SNBP, SNBT, jalur mandiri (UTUL/UJM)",
  "Tes tulis, wawancara, jalur prestasi akademik & non-akademik",
  "Jalur reguler, jalur beasiswa, jalur kerjasama industri",
];

const SAMPLE_PROGRAM_KURSUS = [
  "Beginner Coding (8–12 thn), Web Development (13–17 thn), Mobile App Dev",
  "TOEFL Preparation, Conversation Class, Business English, Kids English",
  "Privat satu lawan satu, kelas reguler, intensif persiapan ujian",
];

const SAMPLE_USIA = [
  "5–17 tahun",
  "10 tahun ke atas",
  "Semua usia (anak, remaja, dewasa)",
  "13–25 tahun",
];

const SAMPLE_JADWAL = [
  "Senin–Jumat 16:00–18:00, Sabtu 09:00–12:00",
  "Setiap Sabtu & Minggu, sesi pagi & siang",
  "Fleksibel sesuai kesepakatan dengan instruktur",
];

const SAMPLE_FACULTIES = [
  "Fakultas Teknik, Fakultas Ekonomi & Bisnis, Fakultas Hukum, Fakultas Kedokteran",
  "FIKOM, FISIP, FEB, Fakultas Hukum, Sekolah Pascasarjana",
  "Fakultas Teknologi Informasi, Fakultas Desain, Fakultas Bisnis",
];

const KURSUS_LEVEL_1_BIAYA = [
  "Rp 350.000 / bulan (8x pertemuan)",
  "Rp 500.000 / bulan, gratis trial 1 sesi",
  "Paket 12 sesi Rp 1.800.000",
];

function pickFromSeed<T>(arr: readonly T[], rand: () => number): T {
  const idx = Math.floor(rand() * arr.length);
  const v = arr[Math.min(idx, arr.length - 1)];
  if (v === undefined) throw new Error("empty array");
  return v;
}

function regionFromUrl(url: string): {
  province?: components["schemas"]["Province"];
  kabkota?: components["schemas"]["Kabkota"];
  kecamatan?: components["schemas"]["Kecamatan"];
} {
  const segs = url.replace(/^\//, "").split("/");
  // segs: [category, provinsi, kabkota, kecamatan, ...]
  const provSlug = segs[1];
  const kabSlug = segs[2];
  const kecSlug = segs[3];

  const province = MOCK_REGIONS.find((p) => p.slug === provSlug);
  if (!province) return {};
  const kabkota = province.kabkotas.find((k) => k.slug === kabSlug);
  if (!kabkota) {
    return {
      province: { id: 0, name: province.name, slug: province.slug },
    };
  }
  const kecamatan = kabkota.kecamatans.find((k) => k.slug === kecSlug);
  return {
    province: { id: 0, name: province.name, slug: province.slug },
    kabkota: {
      id: 0,
      province_id: 0,
      name: kabkota.name,
      slug: kabkota.slug,
      type: kabkota.type,
    },
    kecamatan: kecamatan
      ? {
          id: 0,
          kabkota_id: 0,
          name: kecamatan.name,
          slug: kecamatan.slug,
        }
      : undefined,
  };
}

function buildBase(card: FacilityCard, rand: () => number): FacilityBase {
  const region = regionFromUrl(card.url ?? "");
  const isRemoved = rand() < 0.04; // ~4% removed → tests AC-03 / 410

  return {
    id: card.id,
    category: card.category,
    name: card.name,
    slug: card.slug,
    description: maybe(rand, pickFromSeed(SAMPLE_DESCRIPTIONS, rand), 0.15),
    address: maybe(
      rand,
      `${pickFromSeed(["Jl. Raya", "Jl. Merdeka", "Jl. Sudirman", "Jl. Sunset Road"], rand)} No. ${
        Math.floor(rand() * 200) + 1
      }, ${region.kecamatan?.name ?? ""}`,
      0.1,
    ),
    // Lat/long: 70% present (tests AC-09 conditional map)
    latitude: rand() < 0.7 ? -8.6 + rand() * 4 : null,
    longitude: rand() < 0.7 ? 110 + rand() * 8 : null,
    province: region.province,
    kabkota: region.kabkota,
    kecamatan: region.kecamatan,
    // ~80% have email (tests AC-10 inquiry form gating)
    email: maybe(rand, `info@${(card.slug ?? "demo").slice(0, 12)}.example.id`, 0.2),
    phone: maybe(rand, `+62 8${Math.floor(rand() * 1e10).toString().padStart(10, "0")}`, 0.2),
    website: maybe(rand, `https://${(card.slug ?? "demo").slice(0, 16)}.example.id`, 0.4),
    image_main_url: card.image_main_url,
    is_timedoor_academy: card.is_timedoor_academy,
    status: isRemoved ? "removed" : "active",
    last_verified_at: new Date(
      Date.now() - Math.floor(rand() * 90) * 86400_000,
    ).toISOString(),
  };
}

export function buildSekolahDetail(card: FacilityCard): SekolahDetail | null {
  if (!card.slug) return null;
  const rand = rng(seedFromString(card.slug));
  const base = buildBase(card, rand);
  const url = card.url ?? "";
  const segs = url.split("/");
  const schoolType = segs[5] as SekolahDetail["school_type"];

  return {
    ...base,
    school_type: schoolType,
    accreditation: maybe(rand, pickFromSeed(SAMPLE_AKREDITASI, rand), 0.3),
    curriculum: maybe(rand, pickFromSeed(SAMPLE_KURIKULUM, rand), 0.2),
    biaya: maybe(rand, pickFromSeed(SAMPLE_BIAYA, rand), 0.25),
    jam_sekolah: maybe(rand, pickFromSeed(SAMPLE_JAM, rand), 0.35),
    fasilitas: maybe(rand, pickFromSeed(SAMPLE_FASILITAS, rand), 0.2),
  };
}

export function buildUniversitasDetail(
  card: FacilityCard,
): UniversitasDetail | null {
  if (!card.slug) return null;
  const rand = rng(seedFromString(card.slug));
  const base = buildBase(card, rand);

  return {
    ...base,
    jenis: pickFromSeed(["Universitas", "S1", "S2", "S3", "D1-D4"] as const, rand),
    program_studi: maybe(rand, pickFromSeed(SAMPLE_PROGRAM_STUDI, rand), 0.2),
    jalur_masuk: maybe(rand, pickFromSeed(SAMPLE_JALUR_MASUK, rand), 0.25),
    biaya: maybe(rand, pickFromSeed(SAMPLE_BIAYA, rand), 0.2),
    fasilitas: maybe(rand, pickFromSeed(SAMPLE_FASILITAS, rand), 0.3),
    faculties_text: maybe(rand, pickFromSeed(SAMPLE_FACULTIES, rand), 0.25),
    prodi_text: maybe(rand, pickFromSeed(SAMPLE_PROGRAM_STUDI, rand), 0.3),
  };
}

export function buildKursusDetail(card: FacilityCard): KursusDetail | null {
  if (!card.slug) return null;
  const rand = rng(seedFromString(card.slug));
  const base = buildBase(card, rand);
  const url = card.url ?? "";
  const segs = url.split("/");
  const mainSlug = segs[4];
  const mainCategory = MOCK_KURSUS_CATEGORIES.find((c) => c.slug === mainSlug);
  const subPool = MOCK_KURSUS_CATEGORIES.filter((c) => c.slug !== mainSlug);
  const subCount = Math.floor(rand() * 3); // 0..2 sub-categories

  return {
    ...base,
    main_category: mainCategory,
    sub_categories: subPool.slice(0, subCount),
    program: maybe(rand, pickFromSeed(SAMPLE_PROGRAM_KURSUS, rand), 0.2),
    usia: maybe(rand, pickFromSeed(SAMPLE_USIA, rand), 0.2),
    jadwal: maybe(rand, pickFromSeed(SAMPLE_JADWAL, rand), 0.25),
    biaya: maybe(rand, pickFromSeed(KURSUS_LEVEL_1_BIAYA, rand), 0.2),
    fasilitas: maybe(rand, pickFromSeed(SAMPLE_FASILITAS, rand), 0.4),
  };
}

export function findSekolahByPath(
  provinsi: string,
  kabkota: string,
  kecamatan: string,
  schoolType: string,
  slug: string,
): FacilityCard | null {
  const url = `/sekolah/${provinsi}/${kabkota}/${kecamatan}/${schoolType}/${slug}`;
  return MOCK_SEKOLAH.find((f) => f.url === url) ?? null;
}

export function findUniversitasByPath(
  provinsi: string,
  kabkota: string,
  kecamatan: string,
  slug: string,
): FacilityCard | null {
  const url = `/universitas/${provinsi}/${kabkota}/${kecamatan}/${slug}`;
  return MOCK_UNIVERSITAS.find((f) => f.url === url) ?? null;
}

export function findKursusByPath(
  provinsi: string,
  kabkota: string,
  kecamatan: string,
  mainCategory: string,
  slug: string,
): FacilityCard | null {
  const url = `/kursus/${provinsi}/${kabkota}/${kecamatan}/${mainCategory}/${slug}`;
  return MOCK_KURSUS.find((f) => f.url === url) ?? null;
}
