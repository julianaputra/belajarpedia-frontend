import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  PencilLine,
  Building2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { siteConfig } from "@/lib/site/config";
import { staticPageMetadata } from "@/lib/seo/meta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, RevealItem } from "@/components/Reveal";

export const metadata: Metadata = staticPageMetadata({
  title: "Hubungi Kami",
  description:
    "Hubungi tim Belajarpedia untuk pertanyaan, masukan, koreksi data, atau pendaftaran fasilitas. Kami biasanya membalas dalam 2 hari kerja.",
  path: "/kontak",
});

const OWNER_ACTIONS = [
  {
    Icon: Building2,
    title: "Daftarkan fasilitas baru",
    body: "Belum terdaftar di Belajarpedia? Kirim informasi fasilitas Anda — tim kami akan memverifikasi sebelum dipublikasi.",
    href: "/submit-listing",
    cta: "Buka formulir pendaftaran",
  },
  {
    Icon: PencilLine,
    title: "Perbaiki informasi yang ada",
    body: "Ada data yang tidak akurat — biaya, alamat, kontak, kurikulum? Beri tahu kami dan tim akan memprosesnya.",
    href: "/request-correction",
    cta: "Buka formulir perbaikan",
  },
  {
    Icon: AlertCircle,
    title: "Minta penghapusan listing",
    body: "Tidak ingin fasilitas Anda terdaftar di Belajarpedia? Kami memproses permintaan penghapusan dalam 7 hari kerja.",
    href: "/request-removal",
    cta: "Buka formulir penghapusan",
  },
];

export default function KontakPage() {
  return (
    <main>
      <PageHero
        eyebrow="Hubungi Kami"
        title="Kami senang mendengar dari Anda"
        lead="Pertanyaan, masukan, atau permintaan kerja sama — kami biasanya membalas dalam 2 hari kerja."
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-5 py-10 sm:py-16 space-y-10 sm:space-y-14">
        <Reveal className="space-y-4 sm:space-y-5" stagger={0.06}>
          <RevealItem>
            <h2 className="text-xl sm:text-2xl font-semibold text-ink-700">
              Kirim email
            </h2>
          </RevealItem>
          <RevealItem>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="group block bg-white border border-ink-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-brand-300 hover:shadow-[0_8px_20px_-10px_rgb(28_47_112_/_0.2)] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Mail size={20} aria-hidden strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted">
                    Email umum
                  </p>
                  <p className="font-semibold text-ink-700 text-base sm:text-lg mt-1 group-hover:text-brand-700 transition-colors break-all">
                    {siteConfig.contact.email}
                  </p>
                  <p className="text-sm text-body mt-1.5 leading-relaxed">
                    Untuk pertanyaan umum, masukan, kerja sama editorial, atau
                    permintaan media.
                  </p>
                </div>
              </div>
            </a>
          </RevealItem>
        </Reveal>

        <Reveal className="space-y-4 sm:space-y-6" stagger={0.06}>
          <RevealItem>
            <h2 className="text-xl sm:text-2xl font-semibold text-ink-700">
              Untuk pemilik fasilitas
            </h2>
            <p className="text-sm sm:text-base text-body mt-1.5 leading-relaxed">
              Kalau Anda pemilik atau pengelola sekolah, kampus, atau lembaga kursus,
              gunakan formulir di bawah agar permintaan Anda langsung masuk ke antrean
              tim editorial.
            </p>
          </RevealItem>
          <div className="grid gap-3 sm:gap-4">
            {OWNER_ACTIONS.map((a) => (
              <RevealItem
                key={a.title}
                className="bg-white border border-ink-100 rounded-xl p-4 sm:p-5"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-ink-50 text-ink-700 flex items-center justify-center">
                    <a.Icon size={20} aria-hidden strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink-700 text-base">
                      {a.title}
                    </h3>
                    <p className="text-sm text-body mt-1 leading-relaxed">
                      {a.body}
                    </p>
                    <Link
                      href={a.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline mt-2.5"
                    >
                      {a.cta}
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  </div>
                </div>
              </RevealItem>
            ))}
          </div>
        </Reveal>

        <Reveal className="space-y-3 sm:space-y-4">
          <RevealItem>
            <h2 className="text-xl sm:text-2xl font-semibold text-ink-700">
              Yang perlu Anda ketahui
            </h2>
          </RevealItem>
          <RevealItem>
            <ul className="space-y-2.5 text-sm sm:text-base text-body leading-relaxed">
              <li className="flex gap-3">
                <span aria-hidden className="text-brand-600 font-semibold">·</span>
                <span>
                  Kami biasanya membalas dalam <span className="font-semibold text-ink-700">2 hari kerja</span>{" "}
                  (Senin–Jumat, kecuali hari libur nasional).
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-brand-600 font-semibold">·</span>
                <span>
                  Permintaan koreksi atau penghapusan listing diproses dalam{" "}
                  <span className="font-semibold text-ink-700">7 hari kerja</span>.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-brand-600 font-semibold">·</span>
                <span>
                  Untuk pertanyaan langsung kepada sebuah fasilitas (sekolah, kampus,
                  kursus), gunakan tombol “Kirim Pertanyaan” di halaman detail
                  fasilitas — pesan akan dikirim langsung ke pihak fasilitas, bukan ke
                  Belajarpedia.
                </span>
              </li>
            </ul>
          </RevealItem>
        </Reveal>

        <Reveal className="bg-[var(--color-surface-soft)] border border-ink-100 rounded-xl sm:rounded-2xl p-5 sm:p-7">
          <RevealItem>
            <h2 className="font-semibold text-ink-700 text-base sm:text-lg">
              Operator
            </h2>
            <p className="text-sm text-body mt-2 leading-relaxed">
              Belajarpedia dioperasikan oleh{" "}
              <a
                href="https://timedoor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 hover:underline font-semibold"
              >
                Timedoor
              </a>
              , perusahaan teknologi pendidikan berbasis di Bali, Indonesia.
            </p>
          </RevealItem>
        </Reveal>
      </section>
    </main>
  );
}
