import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site/config";
import { staticPageMetadata } from "@/lib/seo/meta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, RevealItem } from "@/components/Reveal";

export const metadata: Metadata = staticPageMetadata({
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan ketentuan penggunaan layanan Belajarpedia — direktori sekolah, universitas, dan kursus di Indonesia.",
  path: "/syarat",
});

const EFFECTIVE_DATE = "29 April 2026";

export default function SyaratPage() {
  return (
    <main>
      <PageHero
        eyebrow="Syarat & Ketentuan"
        title="Aturan penggunaan layanan"
        lead="Dengan menggunakan Belajarpedia, Anda menyetujui syarat-syarat berikut. Mohon dibaca sebelum membuat akun atau mengirimkan informasi."
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-5 py-10 sm:py-16">
        <Reveal className="space-y-8 sm:space-y-10" stagger={0.04}>
          <RevealItem>
            <p className="text-xs sm:text-sm text-muted">
              Berlaku sejak: <span className="text-ink-700 font-medium">{EFFECTIVE_DATE}</span>
            </p>
          </RevealItem>

          <Section title="1. Definisi">
            <ul className="space-y-2">
              <Bullet>
                <span className="font-semibold text-ink-700">“Belajarpedia”</span>{" "}
                merujuk pada situs <span className="font-medium">belajarpedia.com</span>{" "}
                dan layanan terkait yang dioperasikan oleh Timedoor.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-ink-700">“Pengguna”</span>{" "}
                merujuk pada siapa pun yang mengakses atau menggunakan Belajarpedia,
                baik tanpa akun maupun dengan akun terdaftar.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-ink-700">“Fasilitas”</span>{" "}
                merujuk pada sekolah, universitas, atau lembaga kursus yang
                terdaftar dalam direktori.
              </Bullet>
            </ul>
          </Section>

          <Section title="2. Penerimaan ketentuan">
            <p>
              Dengan mengakses Belajarpedia, Anda menyatakan telah membaca, memahami,
              dan menyetujui Syarat & Ketentuan ini serta{" "}
              <Link href="/privasi" className="text-brand-700 hover:underline font-semibold">
                Kebijakan Privasi
              </Link>
              . Jika tidak setuju, mohon hentikan penggunaan layanan ini.
            </p>
          </Section>

          <Section title="3. Akun pengguna">
            <ul className="space-y-2">
              <Bullet>
                Anda harus berusia minimal 13 tahun untuk membuat akun. Anak di bawah
                13 tahun dapat didaftarkan sebagai profil anak oleh orang tua.
              </Bullet>
              <Bullet>
                Anda bertanggung jawab atas kerahasiaan kata sandi dan seluruh
                aktivitas yang terjadi pada akun Anda.
              </Bullet>
              <Bullet>
                Informasi yang Anda berikan saat pendaftaran harus akurat dan
                terkini. Akun dengan data palsu dapat dinonaktifkan.
              </Bullet>
              <Bullet>
                Anda dapat menghapus akun Anda sendiri kapan saja melalui halaman
                profil.
              </Bullet>
            </ul>
          </Section>

          <Section title="4. Akurasi data fasilitas">
            <p>
              Belajarpedia berusaha menampilkan informasi yang akurat melalui
              verifikasi tim editorial dan pembaruan tahunan. Namun:
            </p>
            <ul className="space-y-2 mt-3">
              <Bullet>
                Data dapat berubah di luar siklus pembaruan kami (mis. perubahan
                biaya atau kontak). Selalu konfirmasikan informasi penting langsung
                ke fasilitas yang bersangkutan.
              </Bullet>
              <Bullet>
                Belajarpedia tidak bertanggung jawab atas kerugian yang timbul akibat
                keputusan yang diambil semata-mata berdasarkan informasi di situs ini.
              </Bullet>
              <Bullet>
                Setiap halaman detail menampilkan tanggal verifikasi terakhir
                (“Last verified”) dan tautan untuk melaporkan informasi yang tidak
                akurat.
              </Bullet>
            </ul>
          </Section>

          <Section title="5. Penggunaan inquiry dan komunikasi">
            <ul className="space-y-2">
              <Bullet>
                Pesan inquiry yang Anda kirim akan diteruskan ke alamat email
                fasilitas, dengan Reply-To diatur ke email Anda.
              </Bullet>
              <Bullet>
                Dilarang menggunakan fitur inquiry untuk spam, promosi, atau
                komunikasi yang tidak relevan dengan layanan pendidikan fasilitas.
              </Bullet>
              <Bullet>
                Belajarpedia dapat membatasi jumlah inquiry per pengguna per fasilitas
                dalam jangka waktu tertentu untuk mencegah penyalahgunaan.
              </Bullet>
              <Bullet>
                Fasilitas dapat meminta untuk tidak menerima inquiry dari Belajarpedia
                kapan saja; tombol inquiry akan dinonaktifkan untuk fasilitas tersebut.
              </Bullet>
            </ul>
          </Section>

          <Section title="6. Konten pengguna">
            <p>
              Konten yang Anda kirimkan (rating bintang, pesan inquiry, formulir)
              tetap menjadi milik Anda. Dengan mengirimkannya, Anda memberi
              Belajarpedia lisensi non-eksklusif, tanpa royalti, untuk menyimpan dan
              memproses konten tersebut sejauh diperlukan untuk menjalankan layanan.
            </p>
            <p className="mt-3">
              Belajarpedia berhak menghapus konten yang melanggar hukum, mengandung
              ujaran kebencian, atau diidentifikasi sebagai spam/bot tanpa
              pemberitahuan terlebih dahulu.
            </p>
          </Section>

          <Section title="7. Larangan">
            <p>Pengguna dilarang:</p>
            <ul className="space-y-2 mt-3">
              <Bullet>
                Melakukan scraping otomatis, crawling masif, atau usaha pengambilan
                data dalam skala besar tanpa izin tertulis.
              </Bullet>
              <Bullet>
                Mencoba mengakses akun pengguna lain atau bagian sistem yang tidak
                ditujukan untuk Anda.
              </Bullet>
              <Bullet>
                Mengunggah data palsu, mengaku sebagai pemilik fasilitas yang bukan
                milik Anda, atau memanipulasi rating.
              </Bullet>
              <Bullet>
                Menggunakan layanan untuk tujuan komersial yang merugikan
                Belajarpedia atau pengguna lain.
              </Bullet>
            </ul>
            <p className="mt-3">
              Pelanggaran dapat berakibat penonaktifan akun secara permanen tanpa
              pemberitahuan.
            </p>
          </Section>

          <Section title="8. Untuk pemilik fasilitas">
            <p>
              Pemilik fasilitas dapat:
            </p>
            <ul className="space-y-2 mt-3">
              <Bullet>
                Mendaftarkan fasilitas baru lewat formulir{" "}
                <Link
                  href="/submit-listing"
                  className="text-brand-700 hover:underline font-semibold"
                >
                  Daftarkan Fasilitas
                </Link>
                . Tim editorial akan memverifikasi dan menentukan apakah listing layak
                dipublikasi.
              </Bullet>
              <Bullet>
                Meminta perbaikan informasi melalui formulir{" "}
                <Link
                  href="/request-correction"
                  className="text-brand-700 hover:underline font-semibold"
                >
                  Perbaikan Informasi
                </Link>
                .
              </Bullet>
              <Bullet>
                Meminta penghapusan listing melalui formulir{" "}
                <Link
                  href="/request-removal"
                  className="text-brand-700 hover:underline font-semibold"
                >
                  Permintaan Penghapusan
                </Link>
                . Permintaan akan diproses dalam 7 hari kerja.
              </Bullet>
            </ul>
          </Section>

          <Section title="9. Hak kekayaan intelektual">
            <p>
              Logo, nama “Belajarpedia”, desain, dan struktur situs adalah milik
              Timedoor. Foto, deskripsi, dan informasi yang ditampilkan tentang
              fasilitas pendidikan tetap menjadi milik institusi atau sumber aslinya;
              Belajarpedia menampilkannya untuk tujuan informasional sesuai
              ketentuan penggunaan wajar.
            </p>
          </Section>

          <Section title="10. Penyangkalan dan batasan tanggung jawab">
            <p>
              Layanan disediakan{" "}
              <span className="font-medium">“sebagaimana adanya” (as-is)</span> tanpa
              jaminan apa pun, baik tersurat maupun tersirat. Belajarpedia tidak
              memberikan jaminan atas akurasi, kelengkapan, atau ketersediaan
              tanpa-henti dari layanan, dan tidak bertanggung jawab atas kerugian
              langsung maupun tidak langsung yang timbul dari penggunaan layanan ini.
            </p>
          </Section>

          <Section title="11. Hukum yang berlaku">
            <p>
              Syarat & Ketentuan ini diatur berdasarkan hukum Republik Indonesia.
              Setiap perselisihan akan diselesaikan melalui musyawarah; jika tidak
              tercapai, akan diselesaikan melalui Pengadilan Negeri Denpasar.
            </p>
          </Section>

          <Section title="12. Perubahan ketentuan">
            <p>
              Kami dapat memperbarui Syarat & Ketentuan ini sewaktu-waktu. Tanggal
              “Berlaku sejak” di bagian atas halaman ini selalu mencerminkan versi
              terbaru. Perubahan signifikan akan diberitahukan melalui email kepada
              pengguna terdaftar.
            </p>
          </Section>

          <Section title="13. Kontak">
            <p>
              Pertanyaan terkait Syarat & Ketentuan ini dapat dikirim ke{" "}
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
