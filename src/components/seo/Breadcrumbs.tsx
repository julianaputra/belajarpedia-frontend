import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs";

type Props = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1">
              {isLast ? (
                <span aria-current="page" className="font-medium text-gray-900">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.url}
                    className="hover:text-gray-900 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="text-gray-400">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
