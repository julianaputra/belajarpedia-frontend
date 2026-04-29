import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site/config";
import { staticPageMetadata } from "@/lib/seo/meta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, RevealItem } from "@/components/Reveal";

export const metadata: Metadata = staticPageMetadata({
  title: "Kebijakan Privasi",
  description:
    "Bagaimana Belajarpedia mengumpulkan, menyimpan, dan melindungi data pribadi Anda — sesuai dengan UU Pelindungan Data Pribadi (UU PDP) Indonesia.",
  path: "/privasi",
});

const EFFECTIVE_DATE = "29 April 2026";

export default function PrivasiPage() {
  return (
    <main>
      <PageHero
        eyebrow="Kebijakan Privasi"
        title="Cara kami melindungi data Anda"
        lead="Belajarpedia mengumpulkan data pribadi seminimal mungkin dan menyimpannya dengan aman, sesuai UU Pelindungan Data Pribadi (UU PDP) Indonesia."
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-5 py-10 sm:py-16">
        <Reveal className="space-y-8 sm:space-y-10" stagger={0.04}>
          <RevealItem>
            <p className="text-xs sm:text-sm text-muted">
              Berlaku sejak: <span className="text-ink-700 font-medium">{EFFECTIVE_DATE}</span>
            </p>
          </RevealItem>

          <Section title="1. Ruang lingkup">
            <p>
              Kebijakan ini menjelaskan bagaimana Belajarpedia (dioperasikan oleh
              Timedoor) mengumpulkan, menggunakan, menyimpan, dan melindungi data
              pribadi Anda saat menggunakan situs <span className="font-medium text-ink-700">belajarpedia.com</span>{" "}
              dan layanan terkait. Dengan menggunakan layanan kami, Anda menyetujui
              praktik yang dijelaskan di sini.
            </p>
          </Section>

          <Section title="2. Data yang kami kumpulkan">
            <p>
              Kami hanya mengumpulkan data yang relevan untuk menjalankan layanan:
            </p>
            <ul className="space-y-2 mt-3">
              <Bullet>
                <span className="font-semibold text-ink-700">Data akun:</span>{" "}
                alamat email, kata sandi (di-hash), dan opsional nomor telepon.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-ink-700">Data profil:</span>{" "}
                tanggal lahir Anda dan, jika Anda mendaftarkan anak, gender serta
                tanggal lahir anak. Data ini digunakan{" "}
                <span className="font-medium">hanya</span> untuk mengirim email ucapan
                ulang tahun.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-ink-700">Data login pihak ketiga:</span>{" "}
                jika Anda mendaftar via Google, kami menerima nama dan alamat email
                yang dibagikan oleh Google.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-ink-700">Data inquiry:</span>{" "}
                pesan yang Anda kirim ke fasilitas pendidikan disimpan untuk audit
                anti-spam, tetapi tidak ditampilkan di halaman publik.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-ink-700">Data teknis:</span>{" "}
                alamat IP, jenis perangkat, dan log akses dasar untuk keamanan dan
                analitik agregat.
              </Bullet>
            </ul>
          </Section>

          <Section title="3. Bagaimana kami menggunakan data">
            <ul className="space-y-2">
              <Bullet>Mengelola akun Anda dan mengizinkan login.</Bullet>
              <Bullet>
                Menyalurkan inquiry yang Anda kirim ke fasilitas, dengan{" "}
                <span className="font-medium">Reply-To</span> diatur ke email Anda
                sehingga balasan masuk langsung ke inbox Anda.
              </Bullet>
              <Bullet>
                Mengirim email ulang tahun untuk Anda dan anak Anda (dapat dimatikan).
              </Bullet>
              <Bullet>
                Memverifikasi email saat pendaftaran dan saat perubahan email.
              </Bullet>
              <Bullet>
                Menjaga keamanan layanan: deteksi penyalahgunaan, rate limiting, dan
                audit anti-spam.
              </Bullet>
            </ul>
            <p className="mt-3">
              Kami{" "}
              <span className="font-semibold text-ink-700">tidak menjual</span>{" "}
              data pribadi Anda dan{" "}
              <span className="font-semibold text-ink-700">tidak membagikan</span>{" "}
              data Anda kepada pihak ketiga untuk tujuan pemasaran.
            </p>
          </Section>

          <Section title="4. Penyimpanan dan keamanan">
            <ul className="space-y-2">
              <Bullet>
                Kata sandi disimpan dalam bentuk hash satu arah; kami tidak dapat
                membaca kata sandi Anda.
              </Bullet>
              <Bullet>
                Data anak (gender dan tanggal lahir) di-enkripsi saat tersimpan{" "}
                <em>(at rest)</em> di database kami.
              </Bullet>
              <Bullet>
                Akses ke data pribadi dibatasi ke staf operasional yang
                membutuhkannya, dan dicatat dalam audit log.
              </Bullet>
              <Bullet>
                Backup harian disimpan dengan masa retensi 30 hari.
              </Bullet>
            </ul>
          </Section>

          <Section title="5. Hak Anda">
            <p>
              Sesuai UU PDP, Anda memiliki hak-hak berikut:
            </p>
            <ul className="space-y-2 mt-3">
              <Bullet>
                <span className="font-semibold text-ink-700">Akses:</span>{" "}
                meminta salinan data pribadi yang kami simpan tentang Anda.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-ink-700">Koreksi:</span>{" "}
                memperbarui data yang tidak akurat melalui halaman profil Anda.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-ink-700">Penghapusan:</span>{" "}
                menghapus akun Anda secara mandiri lewat halaman profil. Penghapusan
                bersifat permanen dan akan menghapus akun, anak, favorit, ulasan, dan
                log birthday email — setelah masa tunggu 14 hari.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-ink-700">Penolakan:</span>{" "}
                berhenti menerima email birthday lewat tautan unsubscribe di email.
              </Bullet>
            </ul>
            <p className="mt-3">
              Untuk permintaan yang tidak dapat Anda lakukan sendiri, hubungi{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-brand-700 hover:underline font-semibold"
              >
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </Section>

          <Section title="6. Cookie dan analitik">
            <p>
              Kami menggunakan cookie esensial untuk menjaga sesi login Anda dan
              cookie agregat untuk analitik penggunaan situs (tanpa profil pribadi).
              Anda dapat mengatur browser untuk menolak cookie, namun beberapa fitur
              (login, favorit) memerlukan cookie esensial agar berfungsi.
            </p>
          </Section>

          <Section title="7. Pihak ketiga">
            <p>
              Beberapa layanan pihak ketiga membantu kami menjalankan situs:
            </p>
            <ul className="space-y-2 mt-3">
              <Bullet>
                <span className="font-semibold text-ink-700">Google OAuth:</span>{" "}
                untuk opsi login dengan Google.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-ink-700">Penyedia email transaksional:</span>{" "}
                untuk mengirim email verifikasi, inquiry, dan birthday.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-ink-700">Cloudflare:</span>{" "}
                untuk perlindungan dasar (CDN, anti-bot).
              </Bullet>
            </ul>
            <p className="mt-3">
              Semua mitra terikat untuk memproses data hanya sesuai instruksi kami
              dan tidak menggunakannya untuk tujuan lain.
            </p>
          </Section>

          <Section title="8. Penyimpanan data anak">
            <p>
              Belajarpedia tidak ditujukan untuk anak di bawah 13 tahun. Akun didaftarkan
              oleh orang tua atau pengguna berusia 13 tahun ke atas. Data anak
              (gender + tanggal lahir) yang Anda masukkan di profil hanya digunakan
              untuk fitur birthday email dan dapat dihapus kapan saja lewat halaman
              profil.
            </p>
          </Section>

          <Section title="9. Perubahan kebijakan">
            <p>
              Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan signifikan
              akan diumumkan melalui email kepada pengguna terdaftar dan/atau banner
              di situs. Tanggal “Berlaku sejak” di bagian atas halaman ini selalu
              mencerminkan versi terbaru.
            </p>
          </Section>

          <Section title="10. Kontak">
            <p>
              Pertanyaan terkait kebijakan privasi atau permintaan terkait data
              pribadi Anda dapat dikirim ke{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-brand-700 hover:underline font-semibold"
              >
                {siteConfig.contact.email}
              </a>
              {" "}atau lewat halaman{" "}
              <Link
                href="/kontak"
                className="text-brand-700 hover:underline font-semibold"
              >
                Hubungi Kami
              </Link>
              .
            </p>
          </Section>
        </Reveal>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <RevealItem className="space-y-3">
      <h2 className="text-lg sm:text-xl font-semibold text-ink-700">{title}</h2>
      <div className="text-sm sm:text-base text-body leading-relaxed space-y-3">
        {children}
      </div>
    </RevealItem>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden className="text-brand-600 font-semibold mt-0.5">·</span>
      <span>{children}</span>
    </li>
  );
}
