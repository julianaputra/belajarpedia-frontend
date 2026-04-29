import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Returns an ISO date string (YYYY-MM-DD) for `yearsAgo` years before today.
 * Used as defaultValue on `<input type="date">` so the native picker opens
 * centered at that year (browsers anchor calendar view to the input value).
 *
 * For parent birthdates we default to 30 years — closer to typical user age,
 * fewer scrolls in the picker. For children we default to ~10 years.
 */
export function isoDateYearsAgo(yearsAgo: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - yearsAgo);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** ISO date for today — used as `max` on birthdate inputs. */
export function isoDateToday(): string {
  return isoDateYearsAgo(0);
}
