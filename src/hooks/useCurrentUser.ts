"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { fetchCurrentUser, type CurrentUser } from "@/lib/api/auth.client";

const KEY = "/api/user";

export function useCurrentUser(config?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<CurrentUser | null>(
    KEY,
    fetchCurrentUser,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      ...config,
    },
  );

  return {
    user: data ?? null,
    isLoading,
    isAuthenticated: data != null,
    error,
    mutate,
  };
}
