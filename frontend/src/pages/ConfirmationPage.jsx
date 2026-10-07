import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { profileRequest } from "../lib/profileApi";
import Brand from "../components/Brand";

function errorState(error) {
  if (error.status === 409 && ["confirmed", "declined"].includes(error.data?.state)) return { kind: "done", decision: error.data.state, previous: true };
  if (error.status === 410) return { kind: "expired" };
  return { kind: "error", message: error.message };
}

export default function ConfirmationPage() {
  const { token } = useParams();
  return <ConfirmationContent key={token} token={token} />;
}

function ConfirmationContent({ token }) {
  const [state, setState] = useState({ kind: "loading" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    profileRequest(`/confirmations/${encodeURIComponent(token)}`, { signal: controller.signal })
      .then((request) => setState({ kind: "ready", request }))
      .catch((error) => { if (error.name !== "AbortError") setState(errorState(error)); });
    return () => controller.abort();
  }, [token]);

  async function respond(decision) {
    if (busy) return;
    setBusy(true);
    try {
      const result = await profileRequest(`/confirmations/${encodeURIComponent(token)}/respond`, { method: "POST", body: { decision } });
      setState({ kind: "done", decision: result.state });
    } catch (error) { setState(errorState(error)); }
    finally { setBusy(false); }
  }

  return <div className="app-page response-page">
    <header className="app-header"><nav className="app-header-inner" aria-label="Customer response navigation"><Brand /><Link className="text-link" to="/"><ArrowLeft size={15} /> Home</Link></nav></header>
    <main className="response-main"><div className="response-intro"><span className="section-label">CUSTOMER RESPONSE</span><p>No account needed. Please respond only if this work involved you.</p></div>
      <section className="app-panel response-card" aria-live="polite">
        {state.kind === "loading" && <div role="status" aria-label="Loading request"><div className="skeleton response-skeleton" /><div className="skeleton response-skeleton short" /><span className="sr-only">Loading customer request</span></div>}
        {state.kind === "error" && <><span className="section-label">UNAVAILABLE</span><h1>We could not open this request.</h1><p>{state.message}</p><p className="response-small">The link may be invalid, or the service may be temporarily unavailable. Ask the business for another link if needed.</p></>}
        {state.kind === "expired" && <><span className="section-label">LINK EXPIRED</span><h1>This request has expired.</h1><p>No response was recorded through this link. Ask the business for a new one if you still want to respond.</p></>}
        {state.kind === "ready" && <><span className="section-label">A BUSINESS ASKED YOU</span><h1>Did this work happen as described?</h1><div className="response-statement"><span>THE DESCRIPTION</span><p>{state.request.statement}</p></div><p>This is a response to a specific description, not a review or identity check. You may decline or leave without responding.</p><div className="response-actions"><button type="button" disabled={busy} className="app-button" onClick={() => respond("confirmed")}>{busy ? "Recording..." : "Yes, confirm"}</button><button type="button" disabled={busy} className="app-button app-button-secondary" onClick={() => respond("declined")}>No, decline</button></div>{state.request.expiresAt && <p className="response-small">This link expires {new Date(state.request.expiresAt).toLocaleString()}.</p>}</>}
        {state.kind === "done" && <><span className="section-label">{state.previous ? "ALREADY RESPONDED" : "RESPONSE RECORDED"}</span><h1>{state.decision === "confirmed" ? "You confirmed this description." : "You declined this description."}</h1><p>{state.previous ? "This link has already been used and cannot be submitted again." : state.decision === "confirmed" ? "The business record can now appear as customer-confirmed. Vouch has not verified your identity." : "Your decline was recorded. The work stays self-reported and will not appear as customer-confirmed."}</p></>}
      </section><p className="response-privacy">Do not share this private link. Anyone with it can respond once while it is valid.</p>
    </main>
  </div>;
}
