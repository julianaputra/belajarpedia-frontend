import type { Metadata } from "next";

import { homeMetadata } from "@/lib/seo/meta";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import {
  CategoryFeature,
  H,
  Panel,
  Subhead,
  W,
} from "@/components/home/CategoryFeature";
import { RegionalNav } from "@/components/home/RegionalNav";
import { RekomendasiSection } from "@/components/home/RekomendasiSection";
import { KursusSection } from "@/components/home/KursusSection";
import { CtaStrip } from "@/components/home/CtaStrip";

export const metadata: Metadata = homeMetadata();

export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} id="ld-org" />
      <JsonLd data={websiteJsonLd()} id="ld-website" />

      <Hero />
      <HowItWorks />

      {/* ─── SEKOLAH ───────────────────────────────────────────────────── */}
      <CategoryFeature
        tone="brand"
        emoji="🏫"
        eyebrow="Sekolah"
        number="01"
        title={
          <>
            Cari <W>sekolah</W> yang pas <br className="hidden sm:block" />
            buat kamu.
          </>
        }
        subtitle="SD/SMP/SMA — negeri, swasta, atau internasional. Filter cepat lewat wilayah."
        ctaHref="/sekolah"
        ctaLabel="Lihat semua sekolah"
      >
        <Panel>
          <Subhead hand="mulai dari sini">Pilih wilayah</Subhead>
          <div className="mt-4">
            <RegionalNav category="sekolah" />
          </div>
        </Panel>

        <div>
          <div className="mb-4">
            <Subhead hand="lagi rame nih ✨">Rekomendasi</Subhead>
          </div>
          <RekomendasiSection category="sekolah" />
        </div>
      </CategoryFeature>

      {/* ─── UNIVERSITAS ───────────────────────────────────────────────── */}
      <CategoryFeature
        tone="ink"
        emoji="🎓"
        eyebrow="Universitas"
        number="02"
        title={
          <>
            <H>Kampus</H> yang sesuai cita-citamu.
          </>
        }
        subtitle="S1, D3, D4 — cek prodi, jalur masuk SNBP/SNBT/Mandiri, dan biaya UKT semua dalam satu tempat."
        ctaHref="/universitas"
        ctaLabel="Jelajahi universitas"
      >
        <Panel>
          <Subhead hand="cari berdasarkan lokasi" tilt={1}>
            Pilih wilayah
          </Subhead>
          <div className="mt-4">
            <RegionalNav category="universitas" />
          </div>
        </Panel>

        <div>
          <div className="mb-4">
            <Subhead hand="kampus pilihan ⭐" tilt={-1}>
              Rekomendasi
            </Subhead>
          </div>
          <RekomendasiSection category="universitas" />
        </div>
      </CategoryFeature>

      {/* ─── KURSUS ────────────────────────────────────────────────────── */}
      <CategoryFeature
        tone="sun"
        emoji="🚀"
        eyebrow="Kursus"
        number="03"
        title={
          <>
            <W>Kursus</W> buat asah skill <br className="hidden sm:block" />
            yang kamu suka.
          </>
        }
        subtitle="Coding, bahasa, musik, olahraga, seni — pilih topik favoritmu. Featured Partner: Timedoor Academy."
        ctaHref="/kursus"
        ctaLabel="Cari kursus seru"
      >
        <Panel>
          <Subhead hand="pilih topik" tilt={1}>
            Kategori populer
          </Subhead>
          <div className="mt-4">
            <KursusSection />
          </div>
        </Panel>
      </CategoryFeature>

      <CtaStrip />
    </>
  );
}
