import { absoluteUrl, siteConfig } from "@/lib/site/config";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function homeCrumb(): BreadcrumbItem {
  return { name: siteConfig.name, url: absoluteUrl("/") };
}

export function buildBreadcrumbs(items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [homeCrumb(), ...items];
}
