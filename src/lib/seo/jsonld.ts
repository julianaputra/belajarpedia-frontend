import { absoluteUrl, siteConfig } from "@/lib/site/config";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs";

export type JsonLdGraph = Record<string, unknown> | Array<Record<string, unknown>>;

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: siteConfig.language,
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    inLanguage: siteConfig.language,
  };
}

export function breadcrumbListJsonLd(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export type FacilityJsonLdInput = {
  category: "sekolah" | "universitas" | "kursus";
  name: string;
  url: string;
  description?: string | null;
  imageUrl?: string | null;
  address?: string | null;
  region?: {
    kabkota?: string;
    provinsi?: string;
  };
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

function schemaTypeFor(category: FacilityJsonLdInput["category"]): string {
  switch (category) {
    case "sekolah":
      return "School";
    case "universitas":
      return "CollegeOrUniversity";
    case "kursus":
      return "EducationalOrganization";
  }
}

export function facilityJsonLd(input: FacilityJsonLdInput): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaTypeFor(input.category),
    name: input.name,
    url: input.url,
    inLanguage: siteConfig.language,
  };

  if (input.description) node.description = input.description;
  if (input.imageUrl) node.image = input.imageUrl;
  if (input.email) node.email = input.email;
  if (input.phone) node.telephone = input.phone;
  if (input.website) node.sameAs = [input.website];

  const addressLocality = input.region?.kabkota;
  const addressRegion = input.region?.provinsi;
  if (input.address || addressLocality || addressRegion) {
    node.address = {
      "@type": "PostalAddress",
      ...(input.address ? { streetAddress: input.address } : {}),
      ...(addressLocality ? { addressLocality } : {}),
      ...(addressRegion ? { addressRegion } : {}),
      addressCountry: "ID",
    };
  }

  if (
    typeof input.latitude === "number" &&
    typeof input.longitude === "number"
  ) {
    node.geo = {
      "@type": "GeoCoordinates",
      latitude: input.latitude,
      longitude: input.longitude,
    };
  }

  return node;
}
