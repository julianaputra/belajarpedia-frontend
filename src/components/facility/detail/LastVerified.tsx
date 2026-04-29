import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { absoluteUrl } from "@/lib/site/config";

type Props = {
  date: string | null | undefined;
  /** Path to the current detail page; passed as `?facility_url=` to correction form. */
  facilityPath?: string;
};

/**
 * B-09 mitigation: "Last verified" footer + "Report incorrect information" link.
 * The link prefills the correction form's facility_url field via query param.
 */
export function LastVerified({ date, facilityPath }: Props) {
  const formatted = date ? formatId(date) : null;
  const reportHref = facilityPath
    ? `/request-correction?facility_url=${encodeURIComponent(absoluteUrl(facilityPath))}`
    : "/request-correction";

  return (
    <footer className="text-sm text-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t border-ink-100">
      {formatted ? (
        <span>
          Terakhir diverifikasi:{" "}
          <time dateTime={date ?? undefined} className="font-medium text-ink-600">
            {formatted}
          </time>
        </span>
      ) : (
        <span>Tanggal verifikasi tidak tersedia.</span>
      )}
      <Link
        href={reportHref}
        className="inline-flex items-center gap-1.5 text-brand-700 hover:underline font-medium"
      >
        Laporkan informasi yang tidak akurat
        <ArrowRight size={14} aria-hidden />
      </Link>
    </footer>
  );
}

function formatId(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return iso;
  }
}
