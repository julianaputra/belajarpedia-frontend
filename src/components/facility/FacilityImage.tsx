"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";

const FALLBACK = "/placeholder-facility.svg";

type Props = Omit<ImageProps, "src" | "onError"> & {
  /** Image URL — may be null/undefined/empty/invalid; fallback is used if so. */
  src: string | null | undefined;
  /** Override the fallback path. Default `/placeholder-facility.svg`. */
  fallbackSrc?: string;
};

/**
 * Facility image with `onError` fallback to a local placeholder.
 *
 * Backend-supplied URLs may 404 (image deleted at source, hotlink blocked,
 * domain mismatch with Next image config). Without this guard, the page would
 * show a broken-image icon. With it, we swap to the bundled SVG placeholder.
 *
 * Use this anywhere `facility.image_main_url` is rendered.
 */
export function FacilityImage({
  src,
  fallbackSrc = FALLBACK,
  alt,
  ...rest
}: Props) {
  const initialSrc = src && src.trim() !== "" ? src : fallbackSrc;
  const [erroredSrc, setErroredSrc] = React.useState<string | null>(null);
  const currentSrc = erroredSrc === initialSrc ? fallbackSrc : initialSrc;

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setErroredSrc(initialSrc);
        }
      }}
    />
  );
}
