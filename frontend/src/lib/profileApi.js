import { supabase } from "./supabase";

const base = import.meta.env.VITE_PROFILE_API_BASE_URL?.replace(/\/$/, "");

export class ProfileApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function profileRequest(
  path,
  { method = "GET", body, authenticated = false, signal } = {},
) {
  if (!base) {
    throw new ProfileApiError("The profile service is not configured yet.", 503);
  }

  const headers = { Accept: "application/json" };
  if (body) headers["Content-Type"] = "application/json";

  if (authenticated) {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      throw new ProfileApiError("Please sign in again.", 401);
    }
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  let response;
  try {
    response = await fetch(`${base}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ProfileApiError(
      "Could not reach the profile service. Try again later.",
      503,
    );
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ProfileApiError(
      payload?.error || "This request could not be completed.",
      response.status,
    );
  }
  return payload?.data;
}
