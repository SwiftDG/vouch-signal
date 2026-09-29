import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { profileRequest } from "../lib/profileApi";

const inputClass =
  "w-full rounded-xl border border-[#d9c7cb] bg-white px-4 py-3 text-[#24171a] focus-visible:outline-2 focus-visible:outline-[#a84551]";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [state, setState] = useState({ kind: "loading" });
  const [form, setForm] = useState({
    name: "",
    type: "vendor",
    location: "",
    description: "",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (cancelled) return;
        if (error) throw error;

        if (!session) {
          setState({ kind: "signed-out" });
          return;
        }

        try {
          const profile = await profileRequest("/profiles/me", {
            authenticated: true,
          });
          if (!cancelled) setState({ kind: "profile", profile });
        } catch (requestError) {
          if (!cancelled) {
            setState(
              requestError.status === 404
                ? { kind: "empty" }
                : { kind: "error", message: requestError.message },
            );
          }
        }
      } catch {
        if (!cancelled) {
          setState({
            kind: "error",
            message: "We could not check your account. Please try again.",
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function createProfile(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const profile = await profileRequest("/profiles", {
        method: "POST",
        body: form,
        authenticated: true,
      });
      setState({ kind: "profile", profile });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#f8f3f1] text-[#24171a]">
      <header className="border-b border-[#e5d8d8] bg-white px-5 py-5">
        <nav
          className="mx-auto flex max-w-5xl items-center justify-between gap-4"
          aria-label="Account navigation"
        >
          <Link
            to="/"
            className="font-['Bricolage_Grotesque'] text-2xl font-bold"
          >
            Vou<span className="text-[#a84551]">ch</span>
          </Link>
          <button
            onClick={signOut}
            className="text-sm font-medium text-[#7b3c47] hover:underline"
          >
            Sign out
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:py-16">
        {state.kind === "loading" && (
          <div
            role="status"
            aria-label="Loading account"
            className="animate-pulse space-y-5"
          >
            <div className="h-10 w-60 rounded bg-[#e8d8d7]" />
            <div className="h-40 rounded-2xl bg-[#eee1df]" />
            <span className="sr-only">Loading account</span>
          </div>
        )}

        {state.kind === "signed-out" && (
          <section className="max-w-xl">
            <h1 className="text-3xl font-semibold">
              Sign in to manage your profile
            </h1>
            <p className="mt-3 text-[#6a565a]">
              Your business records are tied to your account.
            </p>
            <Link
              className="mt-6 inline-block rounded-full bg-[#a84551] px-6 py-3 text-white"
              to="/login"
            >
              Sign in
            </Link>
          </section>
        )}

        {state.kind === "error" && (
          <section
            role="alert"
            className="max-w-xl rounded-2xl border border-[#dec9ca] bg-white p-7"
          >
            <h1 className="text-2xl font-semibold">Profile unavailable</h1>
            <p className="mt-3 text-[#6a565a]">{state.message}</p>
            <p className="mt-3 text-sm text-[#6a565a]">
              No sample data is shown in your account.
            </p>
            <button
              className="mt-6 rounded-full border border-[#a84551] px-5 py-2 text-[#8b3541]"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </section>
        )}

        {state.kind === "empty" && (
          <section className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#a84551]">
              Your first step
            </p>
            <h1 className="mt-3 font-['Bricolage_Grotesque'] text-4xl font-semibold">
              Introduce your business
            </h1>
            <p className="mt-3 text-[#6a565a]">
              Only publish details you are comfortable sharing. A profile
              alone does not verify your identity or work.
            </p>

            <form
              onSubmit={createProfile}
              className="mt-8 grid gap-5 rounded-2xl border border-[#e5d8d8] bg-white p-6 sm:p-8"
            >
              <label className="grid gap-2 text-sm font-medium">
                Business name
                <input
                  className={inputClass}
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                I work as
                <select
                  className={inputClass}
                  value={form.type}
                  onChange={(event) =>
                    setForm({ ...form, type: event.target.value })
                  }
                >
                  <option value="vendor">Vendor</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Location (optional)
                <input
                  className={inputClass}
                  maxLength={100}
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                What do you do?
                <textarea
                  className={inputClass}
                  required
                  rows={3}
                  maxLength={500}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </label>

              {message && (
                <p role="alert" className="text-sm text-[#9c3545]">
                  {message}
                </p>
              )}
              <button
                disabled={busy}
                className="w-fit rounded-full bg-[#a84551] px-6 py-3 font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Creating…" : "Create profile"}
              </button>
            </form>
          </section>
        )}

        {state.kind === "profile" && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#a84551]">
              Your profile
            </p>
            <h1 className="mt-3 font-['Bricolage_Grotesque'] text-4xl font-semibold">
              {state.profile.name}
            </h1>
            <p className="mt-3 max-w-2xl text-[#6a565a]">
              {state.profile.description}
            </p>

            <div className="mt-8 rounded-2xl border border-[#e5d8d8] bg-white p-6">
              <h2 className="text-xl font-semibold">
                Work and customer confirmations
              </h2>
              <p className="mt-3 text-[#6a565a]">
                Record and confirmation actions will become available after
                the profile API supports them.
              </p>
              <p className="mt-3 text-sm text-[#6a565a]">
                {state.profile.records?.length
                  ? `${state.profile.records.length} record(s) returned by the service. View your public profile to see published records.`
                  : "No records returned by the service."}
              </p>
            </div>

            {state.profile.slug && (
              <Link
                className="mt-7 inline-block rounded-full bg-[#a84551] px-6 py-3 text-white"
                to={`/p/${encodeURIComponent(state.profile.slug)}`}
              >
                View public profile
              </Link>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
