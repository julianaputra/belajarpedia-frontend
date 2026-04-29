import "client-only";

import { apiClientFetch } from "@/lib/api/client";
import type { components } from "@/types/api";

export type RegistrationRequest = components["schemas"]["RegistrationRequest"];
export type CorrectionRequest = components["schemas"]["CorrectionRequest"];
export type DeletionRequest = components["schemas"]["DeletionRequest"];

export async function submitRegistrationRequest(
  body: RegistrationRequest,
): Promise<void> {
  await apiClientFetch<void>("/api/public/registration-request", {
    method: "POST",
    body,
  });
}

export async function submitCorrectionRequest(
  body: CorrectionRequest,
): Promise<void> {
  await apiClientFetch<void>("/api/public/correction-request", {
    method: "POST",
    body,
  });
}

export async function submitDeletionRequest(
  body: DeletionRequest,
): Promise<void> {
  await apiClientFetch<void>("/api/public/deletion-request", {
    method: "POST",
    body,
  });
}
