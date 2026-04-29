import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  description:
    "Halaman yang Anda cari tidak tersedia atau telah dipindahkan.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
        404
      </p>
      <h1 className="text-3xl font-semibold sm:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="max-w-prose text-gray-600">
        Halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau
        alamatnya salah ketik. Kembali ke beranda untuk mencari fasilitas
        pendidikan lainnya.
      </p>
      <Link
        href="/"
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        Kembali ke beranda
      </Link>
    </main>
  );
}
