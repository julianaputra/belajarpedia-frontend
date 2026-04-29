export const siteConfig = {
  name: "Belajarpedia",
  tagline:
    "Direktori Sekolah, Universitas, dan Kursus di Indonesia",
  description:
    "Belajarpedia membantu Anda menemukan sekolah, universitas, dan kursus di seluruh Indonesia. Bandingkan biaya, kurikulum, dan lokasi dengan mudah.",
  locale: "id_ID",
  language: "id",
  operator: "Timedoor",
  contact: {
    email: "halo@belajarpedia.com",
  },
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = siteUrl.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
