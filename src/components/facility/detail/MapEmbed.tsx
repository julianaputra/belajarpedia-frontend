type Props = {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  name: string;
};

/**
 * AC-09: map renders only when both lat/long are present. Otherwise null —
 * the entire map block is omitted from HTML.
 *
 * Uses Google Maps embed iframe (no JS API key required for the basic embed
 * link). For richer interactions Phase 11 can swap to JS API.
 *
 * Renders bare — caller is expected to provide the surrounding card chrome
 * (via CollapsibleCard or similar).
 */
export function MapEmbed({ latitude, longitude, name }: Props) {
  if (
    latitude === null ||
    latitude === undefined ||
    longitude === null ||
    longitude === undefined
  ) {
    return null;
  }

  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <div className="aspect-[16/9] sm:aspect-[16/7]">
      <iframe
        title={`Peta ${name}`}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  );
}
