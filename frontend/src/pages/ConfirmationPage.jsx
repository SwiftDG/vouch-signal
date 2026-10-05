import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { profileRequest } from "../lib/profileApi";

export default function ConfirmationPage() {
  const { token } = useParams();
  const [state, setState] = useState({ kind: "loading" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    profileRequest(`/confirmations/${encodeURIComponent(token)}`, {
      signal: controller.signal,
    })
      .then((request) => setState({ kind: "ready", request }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({ kind: "error", message: error.message });
        }
      });

    return () => controller.abort();
  }, [token]);

  async function respond(decision) {
    setBusy(true);

    try {
      const result = await profileRequest(
        `/confirmations/${encodeURIComponent(token)}/respond`,
        {
          method: "POST",
          body: { decision },
        }
      );

      setState({ kind: "done", decision: result?.state || decision });
    } catch (error) {
      setState({ kind: "error", message: error.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f3f1] px-5 py-10 text-[#24171a]">
      <main className="mx-auto max-w-xl">
        <Link
          to="/"
          className="font-['Bricolage_Grotesque'] text-2xl font-bold"
        >
          Vou<span className="text-[#a84551]">ch</span>
        </Link>

        <section className="mt-10 rounded-2xl border border-[#e5d8d8] bg-white p-7 sm:p-10">
          {state.kind === "loading" && (
            <div role="status" className="animate-pulse space-y-4">
              <div className="h-8 w-2/3 rounded bg-[#e8d8d7]" />
              <div className="h-24 rounded bg-[#eee1df]" />
              <span className="sr-only">Loading request</span>
            </div>
          )}

          {state.kind === "error" && (
            <div role="alert">
              <h1 className="text-2xl font-semibold">Request unavailable</h1>
              <p className="mt-3 text-[#6a565a]">{state.message}</p>
              <p className="mt-3 text-sm text-[#6a565a]">
                The link may have expired, already been used, or the service may
                be unavailable.
              </p>
            </div>
          )}

          {state.kind === "ready" && (
            <>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#a84551]">
                Customer response
              </p>

              <h1 className="mt-3 text-3xl font-semibold">
                Did this work happen as described?
              </h1>

              <div className="mt-5 rounded-xl bg-[#f8f3f1] p-5">
                <p className="font-medium leading-7">
                  {state.request.statement}
                </p>
              </div>

              <p className="mt-5 text-sm leading-6 text-[#6a565a]">
                Respond only if you know this work. Your response does not prove
                your identity. You can decline or leave without responding.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  disabled={busy}
                  onClick={() => respond("confirmed")}
                  className="rounded-full bg-[#a84551] px-5 py-3 text-white disabled:opacity-60"
                >
                  Confirm description
                </button>

                <button
                  disabled={busy}
                  onClick={() => respond("declined")}
                  className="rounded-full border border-[#a84551] px-5 py-3 text-[#8b3541] disabled:opacity-60"
                >
                  Decline
                </button>
              </div>
            </>
          )}

          {state.kind === "done" && (
            <div role="status">
              <h1 className="text-2xl font-semibold">Response recorded</h1>
              <p className="mt-3 text-[#6a565a]">
                Your response was recorded as {state.decision}. Thank you.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
