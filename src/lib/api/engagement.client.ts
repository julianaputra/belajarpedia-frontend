import "client-only";

import { apiClientFetch } from "@/lib/api/client";
import type { components } from "@/types/api";

export type Favorite = components["schemas"]["Favorite"];
export type Inquiry = components["schemas"]["Inquiry"];
export type InquiryRequest = components["schemas"]["InquiryRequest"];
export type Review = components["schemas"]["Review"];
export type ReviewRequest = components["schemas"]["ReviewRequest"];

export async function addFavorite(facilityId: number): Promise<Favorite> {
  return apiClientFetch<Favorite>(`/api/facilities/${facilityId}/favorite`, {
    method: "POST",
  });
}

export async function submitInquiry(
  facilityId: number,
  body: InquiryRequest,
): Promise<Inquiry> {
  return apiClientFetch<Inquiry>(`/api/facilities/${facilityId}/inquiries`, {
    method: "POST",
    body,
  });
}

export async function submitReview(
  facilityId: number,
  body: ReviewRequest,
): Promise<Review> {
  return apiClientFetch<Review>(`/api/facilities/${facilityId}/reviews`, {
    method: "POST",
    body,
  });
}

export async function getMyReview(facilityId: number): Promise<Review | null> {
  return apiClientFetch<Review | null>(
    `/api/facilities/${facilityId}/my-review`,
  );
}
