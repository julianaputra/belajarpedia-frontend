import type { Metadata } from "next";

import { homeMetadata } from "@/lib/seo/meta";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

import { ParentHero } from "@/components/home/ParentHero";
import { JenjangFilter } from "@/components/home/JenjangFilter";
import { TrustPillars } from "@/components/home/TrustPillars";
import { PopularRegions } from "@/components/home/PopularRegions";
import { CategoryTabs } from "@/components/home/CategoryTabs";
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
      <CategoryTabs />
      <ParentTips />
      <OwnerCta />
    </>
  );
}
