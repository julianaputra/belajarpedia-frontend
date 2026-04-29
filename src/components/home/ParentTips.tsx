import { Reveal, RevealItem } from "@/components/Reveal";

/**
 * Practical advice for parents choosing schools/universities/courses.
 * Builds trust by showing Belajarpedia is on the user's side, not selling.
 *
 * Each tip ties to a feature we already provide (transparent biaya field,
 * accreditation display, contact gating, etc.).
 */

const TIPS = [
  {
    n: "01",
    title: "Bandingkan biaya secara transparan",
    body: "Cek SPP bulanan + biaya pendaftaran + uang gedung. Belajarpedia menampilkan semua komponen biaya yang tersedia di setiap halaman detail.",
  },
  {
    n: "02",
    title: "Verifikasi akreditasi",
    body: "Pastikan akreditasi A atau B dari BAN-S/M. Untuk universitas, cek juga akreditasi prodi (BAN-PT) — bukan hanya akreditasi institusi.",
  },
  {
    n: "03",
    title: "Hubungi langsung sebelum kunjungan",
    body: "Kirim pertanyaan via tombol 'Kirim Pertanyaan' di halaman detail. Balasan masuk ke email Anda — tidak melalui Belajarpedia.",
  },
  {
    n: "04",
    title: "Kunjungi langsung saat open house",
    body: "Foto dan deskripsi tidak menggantikan kunjungan langsung. Lihat fasilitas, ruang kelas, dan suasana komunitas sekolah.",
  },
];

export function ParentTips() {
  return (
    <section
      aria-labelledby="tips-heading"
      className="bg-[var(--color-surface-soft)] border-y border-ink-100"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-5 py-10 sm:py-16">
        <Reveal className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <RevealItem>
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-700 mb-1.5 sm:mb-2">
              <span aria-hidden className="h-px w-5 bg-brand-300" />
              Panduan untuk orang tua
              <span aria-hidden className="h-px w-5 bg-brand-300" />
            </p>
          </RevealItem>
          <RevealItem>
            <h2
              id="tips-heading"
              className="text-xl sm:text-3xl lg:text-4xl font-semibold text-ink-700 leading-tight"
            >
              4 langkah memilih sekolah dengan tenang
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="text-sm sm:text-base text-muted mt-2 sm:mt-3 leading-relaxed">
              Tips praktis dari pengalaman ribuan keluarga yang sudah memilih
              lewat Belajarpedia.
            </p>
          </RevealItem>
        </Reveal>

        <Reveal
          className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5"
          stagger={0.1}
        >
          {TIPS.map((t) => (
            <RevealItem
              key={t.n}
              className="bg-white border border-ink-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex gap-3 sm:gap-4"
            >
              <div
                aria-hidden
                className="text-xl sm:text-3xl font-semibold text-brand-200 leading-none flex-shrink-0"
              >
                {t.n}
              </div>
              <div>
                <h3 className="font-semibold text-ink-700 text-sm sm:text-lg leading-snug">
                  {t.title}
                </h3>
                <p className="text-xs sm:text-sm text-body mt-1.5 sm:mt-2 leading-relaxed">
                  {t.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
