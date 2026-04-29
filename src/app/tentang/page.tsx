import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, HandCoins, Sparkles, Users } from "lucide-react";

import { staticPageMetadata } from "@/lib/seo/meta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, RevealItem } from "@/components/Reveal";

export const metadata: Metadata = staticPageMetadata({
  title: "Tentang Belajarpedia",
  description:
    "Belajarpedia adalah direktori pendidikan netral di Indonesia. Listing tidak bisa dibeli — semua institusi tampil dengan kriteria yang sama.",
  path: "/tentang",
});

const PRINCIPLES = [
  {
    Icon: ShieldCheck,
    title: "Data diverifikasi tim editorial",
    body: "Setiap fasilitas — Sekolah, Universitas, dan Kursus — diperiksa oleh tim sebelum dipublikasi. Kami memperbarui database setiap tahun ajaran baru.",
  },
  {
    Icon: HandCoins,
    title: "Tanpa pembayaran untuk peringkat",
    body: "Belajarpedia tidak menerima pembayaran untuk penempatan listing. Urutan hasil pencarian ditentukan oleh sistem, bukan iklan.",
  },
  {
    Icon: Sparkles,
    title: "Selalu gratis untuk pengguna",
    body: "Pencarian, perbandingan, dan komunikasi dengan fasilitas — semuanya gratis. Tidak ada paywall, tidak ada biaya tersembunyi.",
  },
  {
    Icon: Users,
    title: "Dibuat untuk orang tua dan siswa",
    body: "Kami fokus membantu keluarga mengambil keputusan pendidikan yang tepat — bukan menjual iklan kepada institusi.",
  },
];

export default function TentangPage() {
  return (
    <main>
      <PageHero
        eyebrow="Tentang Kami"
        title="Direktori pendidikan netral untuk Indonesia"
        lead="Belajarpedia membantu orang tua dan siswa membandingkan sekolah, universitas, dan kursus dari seluruh Indonesia — dengan informasi yang jujur dan terverifikasi."
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-5 py-10 sm:py-16 space-y-10 sm:space-y-14">
        <Reveal className="space-y-3 sm:space-y-4" stagger={0.08}>
          <RevealItem>
            <h2 className="text-xl sm:text-2xl font-semibold text-ink-700">
              Mengapa kami ada
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="text-sm sm:text-base text-body leading-relaxed">
              Memilih sekolah atau kampus adalah salah satu keputusan paling penting
              yang diambil sebuah keluarga. Sayangnya, sebagian besar direktori online
              di Indonesia mengubur informasi kontak, mendorong listing berbayar, atau
              memuat iklan yang membuat data sulit dibandingkan. Belajarpedia hadir
              untuk memberi cara yang lebih sederhana dan jujur untuk membandingkan
              pilihan pendidikan — dengan biaya, kurikulum, akreditasi, dan kontak yang
              terpampang jelas di satu tempat.
            </p>
          </RevealItem>
        </Reveal>

        <Reveal className="space-y-4 sm:space-y-6" stagger={0.06}>
          <RevealItem>
            <h2 className="text-xl sm:text-2xl font-semibold text-ink-700">
              Bagaimana kami bekerja
            </h2>
          </RevealItem>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {PRINCIPLES.map((p) => (
              <RevealItem
                key={p.title}
                className="bg-white border border-ink-100 rounded-xl p-4 sm:p-5"
              >
                <p.Icon
                  size={22}
                  aria-hidden
                  className="text-brand-600"
                  strokeWidth={1.75}
                />
                <h3 className="font-semibold text-ink-700 text-base mt-3">
                  {p.title}
                </h3>
                <p className="text-sm text-body mt-1.5 leading-relaxed">
                  {p.body}
                </p>
              </RevealItem>
            ))}
          </div>
        </Reveal>

        <Reveal className="space-y-3 sm:space-y-4" stagger={0.08}>
          <RevealItem>
            <h2 className="text-xl sm:text-2xl font-semibold text-ink-700">
              Hubungan kami dengan Timedoor
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="text-sm sm:text-base text-body leading-relaxed">
              Belajarpedia dioperasikan oleh{" "}
              <a
                href="https://timedoor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 hover:underline font-semibold"
              >
                Timedoor
              </a>
              , perusahaan teknologi pendidikan yang berbasis di Bali. Timedoor
              menjalankan kursus coding untuk anak (Timedoor Academy) sekaligus
              membangun produk-produk pendidikan publik seperti Belajarpedia.
            </p>
          </RevealItem>
          <RevealItem>
            <p className="text-sm sm:text-base text-body leading-relaxed">
              Untuk menjaga transparansi: listing milik Timedoor Academy yang muncul
              di kategori Kursus selalu kami tandai dengan label{" "}
              <span className="font-semibold text-ink-700">“Featured Partner”</span>{" "}
              atau <span className="font-semibold text-ink-700">“Sponsored”</span>{" "}
              sehingga Anda tahu hubungannya. Tidak ada institusi lain yang dapat
              membeli posisi serupa — slot ini bukan iklan, melainkan bagian dari
              kepemilikan operasional.
            </p>
          </RevealItem>
        </Reveal>

        <Reveal className="space-y-3 sm:space-y-4" stagger={0.08}>
          <RevealItem>
            <h2 className="text-xl sm:text-2xl font-semibold text-ink-700">
              Komitmen kami
            </h2>
          </RevealItem>
          <RevealItem>
            <ul className="space-y-2.5 text-sm sm:text-base text-body leading-relaxed">
              <li className="flex gap-3">
                <span aria-hidden className="text-brand-600 font-semibold">·</span>
                <span>
                  Belajarpedia tidak menerima pembayaran untuk penempatan listing.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-brand-600 font-semibold">·</span>
                <span>
                  Setiap fasilitas dapat meminta perbaikan informasi atau penghapusan
                  listing kapan saja, dan akan diproses dalam 7 hari kerja.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-brand-600 font-semibold">·</span>
                <span>
                  Data pribadi pengguna tidak dijual atau dibagikan kepada pihak
                  ketiga untuk tujuan pemasaran.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-brand-600 font-semibold">·</span>
                <span>
                  Kontak pengguna dengan institusi bersifat langsung — kami hanya
                  mengantar pesan, bukan menjadi perantara berkelanjutan.
                </span>
              </li>
            </ul>
          </RevealItem>
        </Reveal>

        <Reveal className="bg-brand-50 border border-brand-200 rounded-xl sm:rounded-2xl p-5 sm:p-7">
          <RevealItem>
            <h2 className="font-semibold text-ink-700 text-lg sm:text-xl">
              Punya pertanyaan atau masukan?
            </h2>
            <p className="text-sm sm:text-base text-body mt-1.5 leading-relaxed">
              Kami senang mendengar dari Anda — saran, koreksi data, atau kerja sama.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href="/kontak"
                className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-ink-700 text-white text-sm font-semibold hover:bg-ink-800 transition-colors"
              >
                Hubungi kami
              </Link>
              <Link
                href="/submit-listing"
                className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-white border border-ink-200 text-ink-700 text-sm font-medium hover:bg-ink-50 transition-colors"
              >
                Daftarkan fasilitas
              </Link>
            </div>
          </RevealItem>
        </Reveal>
      </section>
    </main>
  );
}
