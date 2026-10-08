import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { profileRequest } from "../lib/profileApi";
import Brand from "../components/Brand";

const inputClass =
  "w-full rounded-xl border border-[#d9c7cb] bg-white px-4 py-3 text-[#24171a] focus-visible:outline-2 focus-visible:outline-[#a84551]";

const emptyProfile = {
  businessName: "",
  businessType: "VENDOR",
  publicSlug: "",
  category: "",
  bio: "",
  location: "",
  contactUrl: "",
};

const emptyEvidence = {
  title: "",
  evidenceType: "SERVICE",
  completedDate: new Date().toISOString().slice(0, 10),
  description: "",
  customerName: "",
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function Status({ record }) {
  const confirmed = record.verificationStatus === "CUSTOMER_CONFIRMED";
  const request = record.confirmationRequest;
  const requestState = request?.state === "PENDING" && new Date(request.expiresAt) <= new Date()
    ? "EXPIRED"
    : request?.state;
  const label = confirmed ? "Customer confirmed" : requestState === "PENDING" ? "Awaiting response" : requestState === "DECLINED" ? "Customer declined" : requestState === "EXPIRED" ? "Link expired" : "Self-reported";

  return (
    <span
      className={
        confirmed
          ? "text-xs font-medium text-[#477243]"
          : "text-xs font-medium text-[#8b3541]"
      }
    >
      {label}
    </span>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [state, setState] = useState({ kind: "loading" });
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [evidence, setEvidence] = useState([]);
  const [evidenceForm, setEvidenceForm] = useState(emptyEvidence);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmationLink, setConfirmationLink] = useState("");
  const [confirmationExpiry, setConfirmationExpiry] = useState("");
  const [requestingId, setRequestingId] = useState(null);

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

          const records = await profileRequest("/profiles/me/evidence", {
            authenticated: true,
          });

          if (!cancelled) {
            setProfileForm({ ...emptyProfile, ...profile });
            setEvidence(records);
            setState({ kind: "profile", profile });
          }
        } catch (requestError) {
          if (!cancelled) {
            setState(
              requestError.status === 404
                ? { kind: "empty" }
                : { kind: "error", message: requestError.message }
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

  function updateProfileField(event) {
    const { name, value } = event.target;

    setProfileForm((current) => {
      const next = { ...current, [name]: value };

      if (
        name === "businessName" &&
        (!state.profile || current.publicSlug === slugify(current.businessName))
      ) {
        next.publicSlug = slugify(value);
      }

      return next;
    });
  }

  async function saveProfile(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const isNew = state.kind === "empty";

      const profile = await profileRequest(
        isNew ? "/profiles/onboard" : "/profiles/me",
        {
          method: isNew ? "POST" : "PATCH",
          body: profileForm,
          authenticated: true,
        }
      );

      setProfileForm({ ...emptyProfile, ...profile });
      setState({ kind: "profile", profile });
      setMessage(
        isNew ? "Your profile is ready." : "Your profile was updated."
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function addEvidence(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const record = await profileRequest("/profiles/me/evidence", {
        method: "POST",
        body: evidenceForm,
        authenticated: true,
      });

      setEvidence((current) => [record, ...current]);
      setEvidenceForm(emptyEvidence);
      setMessage("Completed work added as self-reported.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function requestConfirmation(recordId) {
    setMessage("");
    setRequestingId(recordId);
    setConfirmationLink("");

    try {
      const request = await profileRequest(
        `/profiles/me/evidence/${encodeURIComponent(
          recordId
        )}/confirmation-request`,
        {
          method: "POST",
          authenticated: true,
        }
      );

      const link = `${window.location.origin}/confirm/${encodeURIComponent(request.token)}`;
      setConfirmationLink(link);
      setConfirmationExpiry(request.expiresAt || "");
      setEvidence((current) => current.map((record) => record.id === recordId
        ? { ...record, confirmationRequest: { state: "PENDING", expiresAt: request.expiresAt } }
        : record));

      try {
        await navigator.clipboard.writeText(link);
        setMessage("New customer link copied. Share it with the intended customer only. Creating another link invalidates this one.");
      } catch {
        setMessage("Confirmation link created. Copy it below before sharing.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setRequestingId(null);
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) setMessage(error.message);
    else navigate("/");
  }

  const profile = state.kind === "profile" ? state.profile : null;

  return (
    <div className="app-page dashboard-page">
      <header className="app-header">
        <nav
          className="app-header-inner"
          aria-label="Account navigation"
        >
          <Brand />

          <button
            onClick={signOut}
            className="text-sm font-medium text-[#7b3c47] hover:underline"
          >
            Sign out
          </button>
        </nav>
      </header>

      <main className="app-main">
        {state.kind === "loading" && <LoadingState />}

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
            <button
              className="mt-6 rounded-full border border-[#a84551] px-5 py-2 text-[#8b3541]"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </section>
        )}

        {(state.kind === "empty" || profile) && (
          <>
            <section className="max-w-2xl dashboard-intro">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#a84551]">
                {profile ? "Your profile" : "Your first step"}
              </p>

              <h1 className="mt-3 text-4xl font-semibold">
                {profile ? profile.businessName : "Introduce your business"}
              </h1>

              <p className="mt-3 text-[#6a565a]">
                Only publish details you are comfortable sharing. A profile
                alone does not verify your identity or work.
              </p>

              {message && <p role="status" className="app-alert dashboard-global-message">{message}</p>}

              <form
                onSubmit={saveProfile}
                className="mt-8 grid gap-5 rounded-2xl border border-[#e5d8d8] bg-white p-6 sm:p-8"
              >
                <Field label="Business name">
                  <input
                    className={inputClass}
                    name="businessName"
                    required
                    maxLength={100}
                    value={profileForm.businessName}
                    onChange={updateProfileField}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="I work as">
                    <select
                      className={inputClass}
                      name="businessType"
                      value={profileForm.businessType}
                      onChange={updateProfileField}
                    >
                      <option value="VENDOR">Vendor</option>
                      <option value="FREELANCER">Freelancer</option>
                    </select>
                  </Field>

                  <Field label="Category (optional)">
                    <input
                      className={inputClass}
                      name="category"
                      maxLength={100}
                      value={profileForm.category || ""}
                      onChange={updateProfileField}
                    />
                  </Field>
                </div>

                <Field label="Your public Vouch link">
                  <div className="flex items-center rounded-xl border border-[#d9c7cb] bg-white">
                    <span className="pl-4 text-sm text-[#6a565a]">/p/</span>
                    <input
                      className="min-w-0 flex-1 rounded-xl px-2 py-3 text-[#24171a] focus-visible:outline-2 focus-visible:outline-[#a84551]"
                      name="publicSlug"
                      required
                      pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                      value={profileForm.publicSlug}
                      onChange={updateProfileField}
                    />
                  </div>
                </Field>

                <Field label="Location (optional)">
                  <input
                    className={inputClass}
                    name="location"
                    maxLength={100}
                    value={profileForm.location || ""}
                    onChange={updateProfileField}
                  />
                </Field>

                <Field label="What do you do? (optional)">
                  <textarea
                    className={inputClass}
                    name="bio"
                    rows={3}
                    maxLength={500}
                    value={profileForm.bio || ""}
                    onChange={updateProfileField}
                  />
                </Field>

                <Field label="Website or contact link (optional)">
                  <input
                    className={inputClass}
                    name="contactUrl"
                    type="url"
                    value={profileForm.contactUrl || ""}
                    onChange={updateProfileField}
                  />
                </Field>

                <button
                  disabled={busy}
                  className="w-fit rounded-full bg-[#a84551] px-6 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {busy
                    ? "Saving..."
                    : profile
                    ? "Save profile"
                    : "Create profile"}
                </button>
              </form>
            </section>

            {profile && (
              <section className="mt-12 max-w-3xl rounded-2xl border border-[#e5d8d8] bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#a84551]">
                      Completed work
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold">
                      Record work, then request a response
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6a565a]">
                      Records stay self-reported unless a customer confirms a
                      specific record.
                    </p>
                  </div>

                  <Link
                    className="rounded-full border border-[#a84551] px-5 py-2 text-sm font-medium text-[#8b3541]"
                    to={`/p/${encodeURIComponent(profile.publicSlug)}`}
                  >
                    View public profile
                  </Link>
                </div>

                {confirmationLink && (
                  <div className="mt-4 break-all border border-[#e5d8d8] bg-[#f8f6f3] p-4 text-sm">
                    <p className="font-semibold">Private customer link</p>
                    <input className="app-input mt-2" aria-label="Private customer confirmation link" readOnly value={confirmationLink} onFocus={(event) => event.target.select()} />
                    <p className="mt-2 text-xs text-[#6a565a]">{confirmationExpiry ? `Expires ${new Date(confirmationExpiry).toLocaleString()}. ` : ""}Anyone holding this link can respond once. Do not post it publicly.</p>
                  </div>
                )}

                <div className="mt-7 divide-y divide-[#eadfdf] border-y border-[#eadfdf]">
                  {evidence.length ? (
                    evidence.map((record) => (
                      <article
                        key={record.id}
                        className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-semibold">{record.title}</h3>
                            <Status record={record} />
                          </div>

                          <p className="mt-1 text-sm text-[#6a565a]">
                            {record.evidenceType.toLowerCase()} ·{" "}
                            {new Date(`${record.completedDate.slice(0, 10)}T12:00:00`).toLocaleDateString()}
                          </p>

                          {record.description && (
                            <p className="mt-2 text-sm text-[#6a565a]">
                              {record.description}
                            </p>
                          )}
                        </div>

                        {record.verificationStatus === "SELF_REPORTED" && record.confirmationRequest?.state !== "DECLINED" && (
                          <button
                            disabled={requestingId !== null}
                            onClick={() => requestConfirmation(record.id)}
                            className="w-fit rounded-full border border-[#a84551] px-4 py-2 text-sm font-medium text-[#8b3541]"
                          >
                            {requestingId === record.id ? "Creating link..." : record.confirmationRequest?.state === "PENDING" && new Date(record.confirmationRequest.expiresAt) > new Date() ? "Replace customer link" : "Create customer link"}
                          </button>
                        )}
                      </article>
                    ))
                  ) : (
                    <p className="py-6 text-sm text-[#6a565a]">
                      No completed work has been recorded yet.
                    </p>
                  )}
                </div>
                <p className="mt-3 text-xs leading-6 text-[#6a565a]">Only confirmed work appears on your public profile. A decline stays recorded and cannot be reset. Replacing a pending link invalidates the earlier link.</p>

                <form
                  onSubmit={addEvidence}
                  className="mt-8 grid gap-5 border-t border-[#eadfdf] pt-8 sm:grid-cols-2"
                >
                  <h3 className="text-xl font-semibold sm:col-span-2">
                    Add completed work
                  </h3>

                  <Field label="Short title">
                    <input
                      className={inputClass}
                      required
                      maxLength={160}
                      value={evidenceForm.title}
                      onChange={(event) =>
                        setEvidenceForm({
                          ...evidenceForm,
                          title: event.target.value,
                        })
                      }
                    />
                  </Field>

                  <Field label="Type">
                    <select
                      className={inputClass}
                      value={evidenceForm.evidenceType}
                      onChange={(event) =>
                        setEvidenceForm({
                          ...evidenceForm,
                          evidenceType: event.target.value,
                        })
                      }
                    >
                      <option value="ORDER">Order</option>
                      <option value="PROJECT">Project</option>
                      <option value="DELIVERY">Delivery</option>
                      <option value="SERVICE">Service</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </Field>

                  <Field label="Completed on">
                    <input
                      className={inputClass}
                      type="date"
                      required
                      value={evidenceForm.completedDate}
                      onChange={(event) =>
                        setEvidenceForm({
                          ...evidenceForm,
                          completedDate: event.target.value,
                        })
                      }
                    />
                  </Field>

                  <Field label="Customer name (private, optional)">
                    <input
                      className={inputClass}
                      maxLength={100}
                      value={evidenceForm.customerName}
                      onChange={(event) =>
                        setEvidenceForm({
                          ...evidenceForm,
                          customerName: event.target.value,
                        })
                      }
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Description (optional, public if confirmed)">
                      <textarea
                        className={inputClass}
                        rows={3}
                        maxLength={500}
                        value={evidenceForm.description}
                        onChange={(event) =>
                          setEvidenceForm({
                            ...evidenceForm,
                            description: event.target.value,
                          })
                        }
                      />
                    </Field>
                    <p className="mt-2 text-xs leading-5 text-[#6a565a]">Describe the work without including a customer's private contact details.</p>
                  </div>

                  <button
                    disabled={busy}
                    className="w-fit rounded-full bg-[#a84551] px-6 py-3 font-semibold text-white disabled:opacity-60 sm:col-span-2"
                  >
                    {busy ? "Adding..." : "Add completed work"}
                  </button>
                </form>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      role="status"
      aria-label="Loading account"
      className="animate-pulse space-y-5"
    >
      <div className="h-10 w-60 rounded bg-[#e8d8d7]" />
      <div className="h-40 rounded-2xl bg-[#eee1df]" />
      <span className="sr-only">Loading account</span>
    </div>
  );
}
