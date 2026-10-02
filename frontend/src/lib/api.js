import { supabase } from "./supabase";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export async function requestApi(path, options = {}) {
  const { authenticated = true, headers: suppliedHeaders, ...fetchOptions } = options;
  const headers = new Headers(suppliedHeaders);
  headers.set("Accept", "application/json");

  if (fetchOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session?.access_token) throw new Error("Please sign in again.");
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(result?.error || "The request could not be completed.");
    error.status = response.status;
    throw error;
  }

  return result?.data;
}