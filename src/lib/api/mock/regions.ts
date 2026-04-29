/**
 * Mock region taxonomy. Real values to give the dev preview Indonesian flavor.
 * Replace via API wiring (Phase 5+) when backend is ready.
 */

export type MockKecamatan = { slug: string; name: string };
export type MockKabkota = {
  slug: string;
  name: string;
  type: "kabupaten" | "kota";
  kecamatans: MockKecamatan[];
};
export type MockProvince = {
  slug: string;
  name: string;
  kabkotas: MockKabkota[];
};

export const MOCK_REGIONS: MockProvince[] = [
  {
    slug: "bali",
    name: "Bali",
    kabkotas: [
      {
        slug: "kab-badung",
        name: "Kab. Badung",
        type: "kabupaten",
        kecamatans: [
          { slug: "kuta-utara", name: "Kuta Utara" },
          { slug: "kuta-selatan", name: "Kuta Selatan" },
          { slug: "mengwi", name: "Mengwi" },
        ],
      },
      {
        slug: "kota-denpasar",
        name: "Kota Denpasar",
        type: "kota",
        kecamatans: [
          { slug: "denpasar-selatan", name: "Denpasar Selatan" },
          { slug: "denpasar-utara", name: "Denpasar Utara" },
        ],
      },
      {
        slug: "kab-gianyar",
        name: "Kab. Gianyar",
        type: "kabupaten",
        kecamatans: [
          { slug: "ubud", name: "Ubud" },
          { slug: "sukawati", name: "Sukawati" },
        ],
      },
    ],
  },
  {
    slug: "dki-jakarta",
    name: "DKI Jakarta",
    kabkotas: [
      {
        slug: "kota-jakarta-selatan",
        name: "Kota Jakarta Selatan",
        type: "kota",
        kecamatans: [
          { slug: "kebayoran-baru", name: "Kebayoran Baru" },
          { slug: "cilandak", name: "Cilandak" },
          { slug: "pasar-minggu", name: "Pasar Minggu" },
        ],
      },
      {
        slug: "kota-jakarta-pusat",
        name: "Kota Jakarta Pusat",
        type: "kota",
        kecamatans: [
          { slug: "menteng", name: "Menteng" },
          { slug: "tanah-abang", name: "Tanah Abang" },
        ],
      },
    ],
  },
  {
    slug: "jawa-barat",
    name: "Jawa Barat",
    kabkotas: [
      {
        slug: "kota-bandung",
        name: "Kota Bandung",
        type: "kota",
        kecamatans: [
          { slug: "coblong", name: "Coblong" },
          { slug: "sukajadi", name: "Sukajadi" },
        ],
      },
      {
        slug: "kab-bogor",
        name: "Kab. Bogor",
        type: "kabupaten",
        kecamatans: [
          { slug: "cibinong", name: "Cibinong" },
          { slug: "bogor-tengah", name: "Bogor Tengah" },
        ],
      },
    ],
  },
];

export const MOCK_KURSUS_CATEGORIES = [
  { id: 1, slug: "coding", name: "Coding", is_active: true },
  { id: 2, slug: "bahasa-inggris", name: "Bahasa Inggris", is_active: true },
  { id: 3, slug: "matematika", name: "Matematika", is_active: true },
  { id: 4, slug: "musik", name: "Musik", is_active: true },
  { id: 5, slug: "olahraga", name: "Olahraga", is_active: true },
  { id: 6, slug: "seni-rupa", name: "Seni Rupa", is_active: true },
];
