import "server-only";

import { apiServerFetch } from "@/lib/api/server";
import { isApiError } from "@/lib/api/error";
import type { components } from "@/types/api";

export type CurrentUser = components["schemas"]["User"];

/**
 * Resolve the current user for a Server Component / Route Handler.
 * Returns null when the visitor is unauthenticated.
 */
export async function getCurrentUserOnServer(): Promise<CurrentUser | null> {
  try {
    return await apiServerFetch<CurrentUser>("/api/user", {
      cache: "no-store",
    });
  } catch (error) {
    if (isApiError(error) && (error.isUnauthorized || error.isForbidden)) {
      return null;
    }
    throw error;
  }
}
