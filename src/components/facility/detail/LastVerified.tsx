import Link from "next/link";

type Props = {
  date: string | null | undefined;
  reportHref?: string;
};

/**
 * B-09 mitigation: "Last verified" footer + "Report incorrect information" link.
 * Builds trust by being honest about freshness.
 */
export function LastVerified({ date, reportHref = "/request-correction" }: Props) {
  const formatted = date ? formatId(date) : null;

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
        className="text-brand-700 hover:underline font-medium"
      >
        Laporkan informasi yang tidak akurat →
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
