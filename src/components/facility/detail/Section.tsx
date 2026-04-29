import * as React from "react";
import { CollapsibleCard } from "@/components/facility/detail/CollapsibleCard";

/**
 * AC-08: empty sections must not render. Pass content as children; if any
 * truthy attribute is rendered, the section appears. Use <DetailSection.Empty>
 * to mark a row that should fall back gracefully.
 *
 * Usage pattern:
 *   <DetailSection title="Tentang">
 *     <AttributeRow label="Akreditasi" value={f.accreditation} />
 *     ...
 *   </DetailSection>
 *
 * If all AttributeRows in the section receive null/empty values, the section
 * itself collapses to nothing.
 */

type SectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  /** Optional anchor target for in-page navigation. */
  id?: string;
};

export function DetailSection({ title, children, className, id }: SectionProps) {
  // React.Children.toArray already drops null/undefined/false. If nothing
  // renders, collapse the whole section per AC-08.
  const visible = React.Children.toArray(children);
  if (visible.length === 0) return null;

  return (
    <CollapsibleCard id={id} title={title} className={className}>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[max-content_1fr]">
        {children}
      </dl>
    </CollapsibleCard>
  );
}

type AttributeRowProps = {
  label: string;
  value: React.ReactNode | string | null | undefined;
};

/**
 * Returns null when value is empty so the section's child filter drops it.
 * dt/dd are wrapped in fragment to satisfy `dl` semantics under grid layout.
 */
export function AttributeRow({ label, value }: AttributeRowProps) {
  if (value === null || value === undefined || value === "" || value === false) {
    return null;
  }
  return (
    <>
      <dt className="text-sm font-semibold text-ink-700">{label}</dt>
      <dd className="text-body whitespace-pre-line">{value}</dd>
    </>
  );
}
