import { useEffect, useState } from "react";
import { Check, CircleAlert } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { requestApi } from "../lib/api";

export default function ConfirmationPage() {
  const { token } = useParams();
  const [request, setRequest] = useState(null);
  const [confirmerName, setConfirmerName] = useState("");
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    requestApi(`/confirmations/${encodeURIComponent(token)}`, { authenticated: false })
      .then((result) => { if (active) setRequest(result); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  async function confirmWork(event) {
    event.preventDefault(); setError("");
    try {
      await requestApi(`/confirmations/${encodeURIComponent(token)}/confirm`, { method: "POST", authenticated: false, body: JSON.stringify({ confirmerName: confirmerName || null }) });
      setComplete(true);
    } catch (requestError) { setError(requestError.message); }
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f1f4ed] text-sm text-[#667268]">Loading confirmation request…</main>;
  const isPending = request?.state === "PENDING" && !complete;

  return <main className="grid min-h-screen place-items-center bg-[#f1f4ed] px-5 py-10 text-[#18251d]"><section className="w-full max-w-xl border-t-4 border-[#527a38] bg-white p-6 shadow-[0_16px_50px_rgba(24,37,29,0.08)] sm:p-10"><Link to="/" className="font-['Bricolage_Grotesque'] text-xl font-bold">vouch<span className="text-[#527a38]">/</span></Link>
    {complete || request?.state === "CONFIRMED" ? <div className="mt-10"><span className="grid h-12 w-12 place-items-center bg-[#edf4e8] text-[#527a38]"><Check size={24} /></span><h1 className="mt-5 font-['Bricolage_Grotesque'] text-3xl font-bold">Thanks for confirming.</h1><p className="mt-3 text-sm leading-6 text-[#667268]">Your confirmation has been recorded for this completed piece of work.</p></div> : isPending ? <><p className="mt-10 font-['DM_Mono'] text-[10px] uppercase text-[#527a38]">Customer confirmation</p><h1 className="mt-3 font-['Bricolage_Grotesque'] text-3xl font-bold">Did this work take place?</h1><blockquote className="mt-6 border-l-2 border-[#d6a34a] bg-[#f7f9f4] px-5 py-4 text-lg leading-7">{request.statement}</blockquote><form onSubmit={confirmWork} className="mt-7"><label className="mb-2 block font-['DM_Mono'] text-[10px] uppercase text-[#667268]">Your name (optional)</label><input value={confirmerName} onChange={(event) => setConfirmerName(event.target.value)} className="w-full border border-[#c9d3c4] px-3 py-3 text-sm outline-none focus:border-[#527a38]" /><button className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-[#527a38] px-5 py-4 text-sm font-medium text-white hover:bg-[#3f642b]"><Check size={16} /> Confirm this record</button></form></> : <div className="mt-10"><span className="grid h-12 w-12 place-items-center bg-[#fff4e8] text-[#a16b31]"><CircleAlert size={23} /></span><h1 className="mt-5 font-['Bricolage_Grotesque'] text-3xl font-bold">This link can’t be used.</h1><p className="mt-3 text-sm leading-6 text-[#667268]">{error || "The confirmation request may have expired or already been used."}</p></div>}
    {error && isPending && <p role="alert" className="mt-4 text-sm text-[#a34b3c]">{error}</p>}<p className="mt-8 border-t border-[#e0e6dd] pt-4 text-xs leading-5 text-[#7d897f]">Confirm only if you recognize and agree with this specific work record.</p>
  </section></main>;
}