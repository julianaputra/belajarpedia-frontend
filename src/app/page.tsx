import type { Metadata } from "next";
import Link from "next/link";

import { homeMetadata } from "@/lib/seo/meta";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { SearchBar } from "@/components/home/SearchBar";
import { RegionalNav } from "@/components/home/RegionalNav";
import { RekomendasiSection } from "@/components/home/RekomendasiSection";
import { KursusSection } from "@/components/home/KursusSection";

export const metadata: Metadata = homeMetadata();

// Home itself can be cached; the Rekomendasi blocks are client-fetched & cache-bypassed.
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} id="ld-org" />
      <JsonLd data={websiteJsonLd()} id="ld-website" />

      <Hero />

      <main className="mx-auto max-w-6xl px-5 pb-16 space-y-16">
        <CategorySection
          tone="brand"
          eyebrow="Sekolah"
          title="Temukan sekolah pilihanmu"
          subtitle="SD, SMP, SMA & SMK negeri, swasta, atau internasional di seluruh Indonesia."
          ctaHref="/sekolah"
        >
          <RegionalNav category="sekolah" />
          <RekomendasiSection category="sekolah" />
        </CategorySection>

        <CategorySection
          tone="ink"
          eyebrow="Universitas"
          title="Universitas yang sesuai cita-citamu"
          subtitle="Cek prodi, jalur masuk, dan biaya — bandingkan tanpa drama."
          ctaHref="/universitas"
        >
          <RegionalNav category="universitas" />
          <RekomendasiSection category="universitas" />
        </CategorySection>

        <CategorySection
          tone="sun"
          eyebrow="Kursus"
          title="Kursus untuk asah skill"
          subtitle="Coding, bahasa, musik, olahraga — pilih yang kamu suka."
          ctaHref="/kursus"
        >
          <KursusSection />
        </CategorySection>
      </main>
    </>
  );
}

function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-brand-50 to-white border-b-2 border-ink-100 overflow-hidden">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-10 w-72 h-72 rounded-full bg-brand-200 opacity-40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-32 -left-10 w-60 h-60 rounded-full bg-sun-400 opacity-30 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-5 py-14 sm:py-20 text-center space-y-7 animate-[var(--animate-fade-up)]">
        <div className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-ink-100 px-4 py-1.5 text-xs font-semibold text-ink-700 shadow-sm">
          <span className="text-brand-500">●</span> Direktori Pendidikan Indonesia
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-ink-700 leading-tight">
          Temukan{" "}
          <span className="text-brand-500">sekolah, universitas,</span>
          <br className="hidden sm:block" /> dan{" "}
          <span className="text-brand-500">kursus</span> favoritmu
        </h1>

        <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto">
          Bandingkan biaya, kurikulum, dan lokasi dengan mudah — tanpa iklan
          ribet, tanpa biaya tersembunyi.
        </p>

        <SearchBar className="max-w-3xl mx-auto" />

        <p className="text-sm text-muted">
          Atau langsung jelajahi:{" "}
          <Link href="/sekolah" className="text-brand-700 hover:underline font-semibold">
            Sekolah
          </Link>{" "}
          ·{" "}
          <Link href="/universitas" className="text-brand-700 hover:underline font-semibold">
            Universitas
          </Link>{" "}
          ·{" "}
          <Link href="/kursus" className="text-brand-700 hover:underline font-semibold">
            Kursus
          </Link>
        </p>
      </div>
    </section>
  );
}

type SectionProps = {
  tone: "brand" | "ink" | "sun";
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaHref: string;
  children: React.ReactNode;
};

function CategorySection({
  tone,
  eyebrow,
  title,
  subtitle,
  ctaHref,
  children,
}: SectionProps) {
  const eyebrowColor = {
    brand: "text-brand-600",
    ink: "text-ink-700",
    sun: "text-sun-500",
  }[tone];

  return (
    <section className="space-y-6 pt-8 animate-[var(--animate-fade-up)]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p
            className={`text-sm font-bold uppercase tracking-wider ${eyebrowColor}`}
          >
            {eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl text-ink-700 mt-1">{title}</h2>
          <p className="text-muted mt-2 max-w-2xl">{subtitle}</p>
        </div>
        <Link
          href={ctaHref}
          className="text-brand-700 hover:underline font-semibold text-sm whitespace-nowrap"
        >
          Lihat semua →
        </Link>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-white border-2 border-ink-100 p-5 sm:p-6 space-y-6">
        {children}
      </div>
    </section>
  );
}
