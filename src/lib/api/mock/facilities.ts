import type { components } from "@/types/api";
import { MOCK_REGIONS, MOCK_KURSUS_CATEGORIES } from "@/lib/api/mock/regions";

type FacilityCard = NonNullable<components["schemas"]["FacilityCard"]>;

const SCHOOL_PREFIXES = ["SD", "SMP", "SMA", "SMK"];
const SCHOOL_SUFFIX_NEGERI = ["1", "2", "3", "4", "5", "6"];
const SCHOOL_NAMES_SWASTA = [
  "Cendekia",
  "Mutiara",
  "Bakti Bangsa",
  "Harapan Bunda",
  "Permata Hati",
  "Tunas Bangsa",
  "Pelita Harapan",
  "Insan Cita",
  "Bhinneka",
  "Bina Insani",
];
const SCHOOL_NAMES_INTERNATIONAL = [
  "Singapore Intercultural School",
  "International School Bali",
  "Jakarta International Academy",
  "Bandung Independent School",
  "Bogor International School",
];

const UNI_PREFIXES = ["Universitas", "Institut Teknologi", "Politeknik"];
const UNI_NAMES = [
  "Pelita Harapan",
  "Bina Nusantara",
  "Tarumanagara",
  "Atma Jaya",
  "Maranatha",
  "Padjadjaran",
  "Udayana",
  "Ngurah Rai",
  "Mahasaraswati",
  "Tri Sakti",
  "Indonesia Mandiri",
  "Multimedia Nusantara",
];

const KURSUS_PROVIDER_NAMES = [
  "Kumon",
  "Sinotif",
  "Wall Street English",
  "EF",
  "Primagama",
  "Sahabat Bahasa",
  "Coding Lab",
  "Code Camp",
  "Maestro Musik",
  "Studio Sanggar",
];

let idCounter = 1000;

function nextId(): number {
  return idCounter++;
}

function pickIndex<T>(arr: readonly T[], i: number): T {
  const item = arr[i % arr.length];
  if (item === undefined) throw new Error("empty array");
  return item;
}

function makeSekolah(
  province: (typeof MOCK_REGIONS)[number],
  kabkota: (typeof MOCK_REGIONS)[number]["kabkotas"][number],
  kecamatan: (typeof MOCK_REGIONS)[number]["kabkotas"][number]["kecamatans"][number],
  schoolType: "negeri" | "swasta" | "international",
  variant: number,
): FacilityCard {
  let name: string;
  if (schoolType === "negeri") {
    const prefix = pickIndex(SCHOOL_PREFIXES, variant);
    const num = pickIndex(SCHOOL_SUFFIX_NEGERI, variant);
    name = `${prefix} Negeri ${num} ${kecamatan.name}`;
  } else if (schoolType === "swasta") {
    const prefix = pickIndex(SCHOOL_PREFIXES, variant);
    const brand = pickIndex(SCHOOL_NAMES_SWASTA, variant);
    name = `${prefix} ${brand} ${kabkota.name.replace("Kota ", "").replace("Kab. ", "")}`;
  } else {
    name = `${pickIndex(SCHOOL_NAMES_INTERNATIONAL, variant)} — ${kabkota.name}`;
  }

  const slug = slugify(`${name}-${variant}`);
  const url = `/sekolah/${province.slug}/${kabkota.slug}/${kecamatan.slug}/${schoolType}/${slug}`;

  return {
    id: nextId(),
    category: "sekolah",
    name,
    slug,
    kabkota_name: kabkota.name,
    image_main_url: variant % 4 === 0 ? null : pickStockImage(variant),
    url,
    is_timedoor_academy: false,
  };
}

function makeUniversitas(
  province: (typeof MOCK_REGIONS)[number],
  kabkota: (typeof MOCK_REGIONS)[number]["kabkotas"][number],
  kecamatan: (typeof MOCK_REGIONS)[number]["kabkotas"][number]["kecamatans"][number],
  variant: number,
): FacilityCard {
  const prefix = pickIndex(UNI_PREFIXES, variant);
  const brand = pickIndex(UNI_NAMES, variant);
  const name = `${prefix} ${brand}`;
  const slug = slugify(`${name}-${variant}`);
  const url = `/universitas/${province.slug}/${kabkota.slug}/${kecamatan.slug}/${slug}`;

  return {
    id: nextId(),
    category: "universitas",
    name,
    slug,
    kabkota_name: kabkota.name,
    image_main_url: variant % 5 === 0 ? null : pickStockImage(variant + 50),
    url,
    is_timedoor_academy: false,
  };
}

function makeKursus(
  province: (typeof MOCK_REGIONS)[number],
  kabkota: (typeof MOCK_REGIONS)[number]["kabkotas"][number],
  kecamatan: (typeof MOCK_REGIONS)[number]["kabkotas"][number]["kecamatans"][number],
  category: (typeof MOCK_KURSUS_CATEGORIES)[number],
  variant: number,
  isTimedoor: boolean,
): FacilityCard {
  const name = isTimedoor
    ? `Timedoor Academy ${kabkota.name.replace("Kota ", "").replace("Kab. ", "")}`
    : `${pickIndex(KURSUS_PROVIDER_NAMES, variant)} ${kabkota.name.replace("Kota ", "").replace("Kab. ", "")}`;
  const slug = slugify(`${name}-${variant}`);
  const url = `/kursus/${province.slug}/${kabkota.slug}/${kecamatan.slug}/${category.slug}/${slug}`;

  return {
    id: nextId(),
    category: "kursus",
    name,
    slug,
    kabkota_name: kabkota.name,
    image_main_url: variant % 6 === 0 ? null : pickStockImage(variant + 100),
    url,
    is_timedoor_academy: isTimedoor,
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800",
];

function pickStockImage(seed: number): string {
  return pickIndex(STOCK_IMAGES, seed);
}

function buildAll() {
  const sekolah: FacilityCard[] = [];
  const universitas: FacilityCard[] = [];
  const kursus: FacilityCard[] = [];

  let variant = 0;
  for (const province of MOCK_REGIONS) {
    for (const kabkota of province.kabkotas) {
      for (const kecamatan of kabkota.kecamatans) {
        // 4 negeri + 3 swasta + 1 international per kecamatan = 8 sekolah/kec.
        for (let i = 0; i < 4; i++) {
          sekolah.push(
            makeSekolah(province, kabkota, kecamatan, "negeri", variant++),
          );
        }
        for (let i = 0; i < 3; i++) {
          sekolah.push(
            makeSekolah(province, kabkota, kecamatan, "swasta", variant++),
          );
        }
        sekolah.push(
          makeSekolah(province, kabkota, kecamatan, "international", variant++),
        );

        // 2 universitas per kecamatan (where it makes sense; cap kabkota-level)
        if (kecamatan === kabkota.kecamatans[0]) {
          for (let i = 0; i < 3; i++) {
            universitas.push(
              makeUniversitas(province, kabkota, kecamatan, variant++),
            );
          }
        }

        // Kursus: 1 per category × kecamatan, plus 1 Timedoor in every kabkota
        // (placed in first kecamatan of kabkota).
        for (const cat of MOCK_KURSUS_CATEGORIES) {
          kursus.push(
            makeKursus(province, kabkota, kecamatan, cat, variant++, false),
          );
        }
        if (kecamatan === kabkota.kecamatans[0]) {
          // Timedoor — pinned-top by API ordering (AC-07). We sort below.
          kursus.push(
            makeKursus(
              province,
              kabkota,
              kecamatan,
              MOCK_KURSUS_CATEGORIES[0]!,
              variant++,
              true,
            ),
          );
        }
      }
    }
  }

  return { sekolah, universitas, kursus };
}

const ALL = buildAll();

export const MOCK_SEKOLAH = ALL.sekolah;
export const MOCK_UNIVERSITAS = ALL.universitas;
export const MOCK_KURSUS = ALL.kursus;
