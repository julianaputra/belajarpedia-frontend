import "client-only";

import { apiClientFetch, ensureCsrfCookie } from "@/lib/api/client";
import type { components } from "@/types/api";

export type CurrentUser = components["schemas"]["User"];
export type LoginInput = components["schemas"]["LoginRequest"];
export type RegisterInput = components["schemas"]["RegisterRequest"];
export type ProfileUpdateInput = components["schemas"]["ProfileUpdateRequest"];
export type ChildInput = components["schemas"]["ChildInput"];
export type UserChild = components["schemas"]["UserChild"];

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

export async function resendVerificationEmail(): Promise<void> {
  await apiClientFetch<void>("/api/email/verification-notification", {
    method: "POST",
  });
}

export async function requestPasswordReset(input: {
  email: string;
  turnstile_token: string;
}): Promise<void> {
  await apiClientFetch<void>("/api/password/forgot", {
    method: "POST",
    body: input,
  });
}

export async function resetPassword(input: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<void> {
  await apiClientFetch<void>("/api/password/reset", {
    method: "POST",
    body: input,
  });
}

export async function updateProfile(
  input: ProfileUpdateInput,
): Promise<CurrentUser> {
  return apiClientFetch<CurrentUser>("/api/user/profile", {
    method: "PATCH",
    body: input,
  });
}

export async function requestEmailChange(input: {
  new_email: string;
  current_password: string;
}): Promise<void> {
  await apiClientFetch<void>("/api/user/email/change-request", {
    method: "POST",
    body: input,
  });
}

export async function changePassword(input: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<void> {
  await apiClientFetch<void>("/api/user/password", {
    method: "PATCH",
    body: input,
  });
}

export async function deleteAccount(input: {
  current_password: string;
}): Promise<void> {
  await apiClientFetch<void>("/api/user/account", {
    method: "DELETE",
    body: input,
  });
}

export async function listChildren(): Promise<UserChild[]> {
  return apiClientFetch<UserChild[]>("/api/user/children");
}

export async function addChild(input: ChildInput): Promise<UserChild> {
  return apiClientFetch<UserChild>("/api/user/children", {
    method: "POST",
    body: input,
  });
}

export async function updateChild(
  id: number,
  input: ChildInput,
): Promise<UserChild> {
  return apiClientFetch<UserChild>(`/api/user/children/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteChild(id: number): Promise<void> {
  await apiClientFetch<void>(`/api/user/children/${id}`, {
    method: "DELETE",
  });
}

export { ensureCsrfCookie };
