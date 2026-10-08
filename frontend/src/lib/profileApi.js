import { supabase } from "./supabase";

const base = import.meta.env.VITE_PROFILE_API_BASE_URL?.replace(/\/$/, "");

export class ProfileApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
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
  // Render's free instance may be asleep on the first read. Never retry a write:
  // a failed response does not prove that a POST/PATCH was not applied.
  for (let attempt = 0; attempt < (method === "GET" ? 3 : 1); attempt += 1) {
    try {
      response = await fetch(`${base}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });
      if (method !== "GET" || ![502, 503, 504].includes(response.status) || attempt === 2) break;
    } catch (error) {
      if (error.name === "AbortError") throw error;
      if (method !== "GET" || attempt === 2) {
        throw new ProfileApiError("Could not reach the profile service. Check your connection and try again.", 503);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ProfileApiError(
      payload?.error || "This request could not be completed.",
      response.status,
      payload?.data,
    );
  }
  return payload?.data;
}
