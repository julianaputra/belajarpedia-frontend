import "client-only";

import { apiClientFetch, ensureCsrfCookie } from "@/lib/api/client";
import type { components } from "@/types/api";

export type CurrentUser = components["schemas"]["User"];
export type LoginInput = components["schemas"]["LoginRequest"];
export type RegisterInput = components["schemas"]["RegisterRequest"];

export async function login(input: LoginInput): Promise<CurrentUser> {
  return apiClientFetch<CurrentUser>("/api/login", {
    method: "POST",
    body: input,
  });
}

export async function logout(): Promise<void> {
  await apiClientFetch<void>("/api/logout", { method: "POST" });
}

export async function register(input: RegisterInput): Promise<CurrentUser> {
  return apiClientFetch<CurrentUser>("/api/register", {
    method: "POST",
    body: input,
  });
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await apiClientFetch<CurrentUser>("/api/user");
  } catch (error) {
    if (
      error instanceof Error &&
      "status" in error &&
      (error as { status: number }).status === 401
    ) {
      return null;
    }
    throw error;
  }
}

export { ensureCsrfCookie };
