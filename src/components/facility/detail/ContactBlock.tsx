import type { components } from "@/types/api";
import { CollapsibleCard } from "@/components/facility/detail/CollapsibleCard";

type Props = {
  facility: components["schemas"]["FacilityBase"];
  /** Optional anchor target for in-page navigation. */
  id?: string;
};

/**
 * Renders address / phone / website / email if present (each conditional, AC-08).
 * Returns null when all four are empty so caller's section logic collapses it.
 */
export function ContactBlock({ facility, id }: Props) {
  const items: Array<{ label: string; value: React.ReactNode }> = [];

  if (facility.address) {
    items.push({ label: "Alamat", value: facility.address });
  }
  if (facility.phone) {
    items.push({
      label: "Telepon",
      value: (
        <a href={`tel:${facility.phone}`} className="text-brand-700 hover:underline">
          {facility.phone}
        </a>
      ),
    });
  }
  if (facility.email) {
    items.push({
      label: "Email",
      value: (
        <a
          href={`mailto:${facility.email}`}
          className="text-brand-700 hover:underline break-all"
        >
          {facility.email}
        </a>
      ),
    });
  }
  if (facility.website) {
    items.push({
      label: "Website",
      value: (
        <a
          href={facility.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 hover:underline break-all"
        >
          {facility.website}
        </a>
      ),
    });
  }

  if (items.length === 0) return null;

  return (
    <CollapsibleCard id={id} title="Kontak">
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[max-content_1fr]">
        {items.map((it) => (
          <div key={it.label} className="contents">
            <dt className="text-sm font-semibold text-ink-700">{it.label}</dt>
            <dd className="text-body">{it.value}</dd>
          </div>
        ))}
      </dl>
    </CollapsibleCard>
  );
}
