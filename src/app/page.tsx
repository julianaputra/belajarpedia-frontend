import type { Metadata } from "next";

import { homeMetadata } from "@/lib/seo/meta";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

import { ParentHero } from "@/components/home/ParentHero";
import { JenjangFilter } from "@/components/home/JenjangFilter";
import { TrustPillars } from "@/components/home/TrustPillars";
import { PopularRegions } from "@/components/home/PopularRegions";
import { CategoryFeature, Panel, Subhead } from "@/components/home/CategoryFeature";
import { RegionalNav } from "@/components/home/RegionalNav";
import { RekomendasiSection } from "@/components/home/RekomendasiSection";
import { KursusSection } from "@/components/home/KursusSection";
import { ParentTips } from "@/components/home/ParentTips";
import { OwnerCta } from "@/components/home/OwnerCta";

export const metadata: Metadata = homeMetadata();

export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} id="ld-org" />
      <JsonLd data={websiteJsonLd()} id="ld-website" />

      <ParentHero />

      <JenjangFilter />

      <TrustPillars />

      <PopularRegions />

      {/* ─── SEKOLAH ───────────────────────────────────────────────────── */}
      <CategoryFeature
        tone="brand"
        emoji="🏫"
        eyebrow="Sekolah"
        title="Cari sekolah dasar hingga menengah atas"
        subtitle="Filter berdasarkan provinsi dan kab/kota. Lihat akreditasi, kurikulum, biaya, dan kontak — semua dalam satu halaman."
        ctaHref="/sekolah"
        ctaLabel="Lihat semua sekolah"
      >
        <Panel
          title="Pilih wilayah"
          hint="Kab/Kota opsional — kosongkan untuk lihat se-provinsi."
        >
          <RegionalNav category="sekolah" />
        </Panel>

        <div>
          <Subhead hint="Pilihan editorial">Rekomendasi</Subhead>
          <RekomendasiSection category="sekolah" />
        </div>
      </CategoryFeature>

      {/* ─── UNIVERSITAS ───────────────────────────────────────────────── */}
      <div className="bg-[var(--color-surface-soft)] border-y border-ink-100">
        <CategoryFeature
          tone="ink"
          emoji="🎓"
          eyebrow="Universitas"
          title="Pilihan kampus untuk anak Anda"
          subtitle="S1, D3, dan D4 dari seluruh Indonesia. Cek prodi, jalur masuk SNBP/SNBT/Mandiri, dan biaya UKT secara transparan."
          ctaHref="/universitas"
          ctaLabel="Jelajahi universitas"
        >
          <Panel title="Pilih wilayah">
            <RegionalNav category="universitas" />
          </Panel>

          <div>
            <Subhead hint="Pilihan editorial">Rekomendasi</Subhead>
            <RekomendasiSection category="universitas" />
          </div>
        </CategoryFeature>
      </div>

      {/* ─── KURSUS ────────────────────────────────────────────────────── */}
      <CategoryFeature
        tone="brand"
        emoji="📚"
        eyebrow="Kursus"
        title="Kursus untuk mengembangkan minat & bakat"
        subtitle="Coding, bahasa, musik, olahraga, dan seni. Lengkapi pendidikan formal dengan program ekstra yang relevan."
        ctaHref="/kursus"
        ctaLabel="Cari kursus"
      >
        <Panel title="Pilih topik kursus">
          <KursusSection />
        </Panel>
      </CategoryFeature>

      <ParentTips />

      <OwnerCta />
    </>
  );
}
