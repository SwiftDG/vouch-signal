import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { profileRequest } from "../lib/profileApi";

const example = {
  name: "Amara Cakes",
  type: "vendor",
  location: "Lagos, Nigeria",
  description:
    "An illustrative cake business profile. All names and records on this page are fictional.",
  records: [
    {
      id: "example-1",
      title: "Birthday cake order",
      status: "confirmed",
      completedAt: "2026-09-12",
    },
    {
      id: "example-2",
      title: "Custom order",
      status: "self_reported",
      completedAt: "2026-09-08",
    },
  ],
};

function statusText(status) {
  return (
    {
      confirmed: "Customer responded: confirmed",
      declined: "Customer responded: declined",
      pending: "Customer response pending",
      self_reported: "Owner reported",
    }[status] || "Status unavailable"
  );
}

export default function PublicProfilePage({ exampleMode = false }) {
  const { slug } = useParams();
  const [state, setState] = useState(
    exampleMode
      ? { kind: "ready", profile: example }
      : { kind: "loading" },
  );

  useEffect(() => {
    if (exampleMode) return;

    const controller = new AbortController();
    profileRequest(`/profiles/${encodeURIComponent(slug)}`, {
      signal: controller.signal,
    })
      .then((profile) => setState({ kind: "ready", profile }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({
            kind: error.status === 404 ? "missing" : "error",
            message: error.message,
          });
        }
      });

    return () => controller.abort();
  }, [slug, exampleMode]);

  return (
    <div className="min-h-screen bg-[#080b10] px-5 py-8 text-white md:px-10">
      <header className="mx-auto mb-10 flex max-w-4xl items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Vou<span className="text-[#ff735c]">ch</span>
        </Link>
        <Link className="text-sm text-white/70 hover:text-white" to="/">
          Home
        </Link>
      </header>

      <main className="mx-auto max-w-4xl">
        {state.kind === "loading" && (
          <div role="status" className="animate-pulse space-y-5">
            <div className="h-48 rounded-3xl bg-white/10" />
            <div className="h-40 rounded-3xl bg-white/5" />
            <span className="sr-only">Loading profile</span>
          </div>
        )}

        {(state.kind === "missing" || state.kind === "error") && (
          <section
            role="alert"
            className="rounded-3xl border border-white/10 bg-[#101620] p-8"
          >
            <h1 className="text-3xl font-semibold">
              {state.kind === "missing"
                ? "Profile not found"
                : "Profile unavailable"}
            </h1>
            <p className="mt-4 text-white/60">
              {state.kind === "missing"
                ? "This profile does not exist or is not public."
                : state.message}
            </p>
          </section>
        )}

        {state.kind === "ready" && (
          <>
            {exampleMode && (
              <div className="mb-5 rounded-xl border border-[#ff735c]/40 bg-[#ff735c]/10 p-4 text-sm text-[#ffb0a4]">
                <strong>Fictional example.</strong> This is a design
                illustration. No customer, identity, order, or confirmation
                shown here is real.
              </div>
            )}

            <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#101620]">
              <div className="h-28 bg-[#481e29]" />
              <div className="p-7 sm:p-10">
                <p className="text-xs uppercase tracking-widest text-[#ff806b]">
                  Business profile
                </p>
                <h1 className="mt-3 font-['Bricolage_Grotesque'] text-4xl font-semibold">
                  {state.profile.name}
                </h1>
                <p className="mt-2 text-sm text-white/50">
                  {state.profile.type}
                  {state.profile.location
                    ? ` · ${state.profile.location}`
                    : ""}
                </p>
                <p className="mt-6 max-w-2xl leading-7 text-white/70">
                  {state.profile.description}
                </p>
              </div>
            </section>

            <section className="mt-5 rounded-[30px] border border-white/10 bg-[#101620] p-7 sm:p-10">
              <h2 className="text-2xl font-semibold">
                Public work history
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Owner reported records and customer responses are labelled
                separately. A response is not identity verification or a
                guarantee of future work.
              </p>

              {state.profile.records?.length ? (
                <ul className="mt-6 divide-y divide-white/10">
                  {state.profile.records.map((record) => (
                    <li
                      key={record.id}
                      className="flex flex-col justify-between gap-2 py-5 sm:flex-row"
                    >
                      <div>
                        <p className="font-medium">{record.title}</p>
                        <p className="mt-1 text-xs text-white/40">
                          {record.completedAt || "Date unavailable"}
                        </p>
                      </div>
                      <p className="text-sm text-[#ffb0a4]">
                        {statusText(record.status)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 rounded-xl border border-white/10 p-5 text-white/60">
                  No public records yet.
                </p>
              )}
            </section>

            <p className="mt-6 text-sm leading-6 text-white/45">
              Only records the owner chose to publish should appear here.
              Do not share customer names, contact details, or private order
              information without consent.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
