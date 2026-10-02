import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Clipboard, ExternalLink, Plus, Save, Sparkles, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { requestApi } from "../lib/api";
import { supabase } from "../lib/supabase";

const emptyProfile = { businessName: "", businessType: "VENDOR", publicSlug: "", category: "", bio: "", location: "", contactUrl: "" };
const inputClass = "w-full border border-[#c9d3c4] bg-white px-3 py-3 text-sm text-[#18251d] outline-none placeholder:text-[#a1aaa1] focus:border-[#527a38]";

function Field({ label, children }) {
  return <label className="block"><span className="mb-1.5 block font-['DM_Mono'] text-[10px] uppercase text-[#667268]">{label}</span>{children}</label>;
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function WorkProfileDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [evidence, setEvidence] = useState([]);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmationLink, setConfirmationLink] = useState("");
  const [evidenceForm, setEvidenceForm] = useState({ title: "", evidenceType: "PROJECT", completedDate: new Date().toISOString().slice(0, 10), description: "", customerName: "" });

  useEffect(() => {
    let active = true;
    async function loadWorkspace() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      if (!session) { navigate("/login", { replace: true }); return; }
      try {
        const currentProfile = await requestApi("/profiles/me");
        if (!active) return;
        setProfile(currentProfile);
        setProfileForm({ ...emptyProfile, ...currentProfile });
        setEvidence(await requestApi("/profiles/me/evidence"));
      } catch (requestError) {
        if (!active) return;
        if (requestError.status === 404) setNeedsOnboarding(true);
        else setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadWorkspace();
    return () => { active = false; };
  }, [navigate]);

  function updateProfileField(event) {
    const { name, value } = event.target;
    setProfileForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "businessName" && (!profile || current.publicSlug === slugify(current.businessName))) next.publicSlug = slugify(value);
      return next;
    });
  }

  async function submitProfile(event) {
    event.preventDefault(); setError(""); setNotice(""); setSaving(true);
    try {
      const saved = await requestApi(needsOnboarding ? "/profiles/onboard" : "/profiles/me", { method: needsOnboarding ? "POST" : "PATCH", body: JSON.stringify(profileForm) });
      setProfile(saved); setProfileForm({ ...emptyProfile, ...saved }); setNeedsOnboarding(false);
      setNotice(needsOnboarding ? "Profile created." : "Profile updated.");
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  }

  async function submitEvidence(event) {
    event.preventDefault(); setError(""); setNotice(""); setSaving(true);
    try {
      const created = await requestApi("/profiles/me/evidence", { method: "POST", body: JSON.stringify(evidenceForm) });
      setEvidence((items) => [created, ...items]);
      setEvidenceForm((current) => ({ ...current, title: "", description: "", customerName: "" }));
      setNotice("Completed work added as self-reported.");
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  }

  async function requestConfirmation(itemId) {
    setError(""); setNotice("");
    try {
      const result = await requestApi(`/profiles/me/evidence/${encodeURIComponent(itemId)}/confirmation-request`, { method: "POST" });
      const url = `${window.location.origin}/confirm/${result.token}`;
      setConfirmationLink(url);
      await navigator.clipboard.writeText(url);
      setNotice("Confirmation link copied. It expires in seven days.");
    } catch (requestError) { setError(requestError.message); }
  }

  async function copyProfileLink() {
    if (!profile) return;
    await navigator.clipboard.writeText(`${window.location.origin}/p/${profile.publicSlug}`);
    setNotice("Public profile link copied.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f1f4ed] text-sm text-[#667268]">Loading your work profile…</main>;

  return (
    <main className="min-h-screen bg-[#f1f4ed] text-[#18251d]">
      <header className="border-b border-[#d8dfd4] bg-[#f8faf6]"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10"><Link to="/" className="font-['Bricolage_Grotesque'] text-xl font-bold">vouch<span className="text-[#527a38]">/</span></Link><div className="flex items-center gap-3">{profile && <button onClick={copyProfileLink} className="hidden items-center gap-2 border border-[#c9d3c4] px-3 py-2 text-xs hover:border-[#527a38] sm:flex"><ExternalLink size={14} /> Copy public link</button>}<button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-[#667268] hover:text-[#18251d]"><LogOut size={16} /> Sign out</button></div></div></header>
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#cbd5c7] pb-7 sm:flex-row sm:items-end"><div><p className="font-['DM_Mono'] text-[11px] uppercase text-[#527a38]">Your work profile</p><h1 className="mt-2 font-['Bricolage_Grotesque'] text-3xl font-bold sm:text-4xl">{profile ? profile.businessName : "Start your profile"}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#667268]">Describe what you do, keep a record of finished work, and invite customers to confirm specific records.</p></div>{profile && <span className="w-fit border border-[#c9d3c4] px-3 py-2 font-['DM_Mono'] text-xs text-[#527a38]">/{profile.publicSlug}</span>}</div>
        {(error || notice) && <div role="status" className={`mb-6 border px-4 py-3 text-sm ${error ? "border-[#d99a8c] bg-[#fff4f0] text-[#9b3c2e]" : "border-[#bbcfac] bg-[#edf4e8] text-[#3f642b]"}`}>{error || notice}</div>}
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="border-t-2 border-[#527a38] pt-5"><div className="mb-5 flex items-center justify-between"><h2 className="font-['Bricolage_Grotesque'] text-xl font-bold">{needsOnboarding ? "Profile details" : "About you"}</h2><Sparkles size={17} className="text-[#527a38]" /></div>
            <form onSubmit={submitProfile} className="space-y-4">
              <Field label="Name or studio name"><input name="businessName" required value={profileForm.businessName} onChange={updateProfileField} placeholder="Nia Okafor Studio" className={inputClass} /></Field>
              <div className="grid grid-cols-2 gap-3"><Field label="Work type"><select name="businessType" value={profileForm.businessType} onChange={updateProfileField} className={inputClass}><option value="VENDOR">Vendor</option><option value="FREELANCER">Freelancer</option></select></Field><Field label="Category"><input name="category" value={profileForm.category || ""} onChange={updateProfileField} placeholder="Furniture" className={inputClass} /></Field></div>
              <Field label="Public link"><div className="flex items-center border border-[#c9d3c4] bg-white"><span className="pl-3 text-xs text-[#7d897f]">/p/</span><input name="publicSlug" required value={profileForm.publicSlug} onChange={updateProfileField} placeholder="nia-okafor" className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none" /></div></Field>
              <Field label="Location"><input name="location" value={profileForm.location || ""} onChange={updateProfileField} placeholder="Lagos, Nigeria" className={inputClass} /></Field>
              <Field label="What do you do?"><textarea name="bio" rows="3" value={profileForm.bio || ""} onChange={updateProfileField} placeholder="Describe your skills and the work you take on." className={`${inputClass} resize-y`} /></Field>
              <Field label="Website or contact link"><input name="contactUrl" type="url" value={profileForm.contactUrl || ""} onChange={updateProfileField} placeholder="https://..." className={inputClass} /></Field>
              <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 bg-[#18251d] px-5 py-3 text-sm font-medium text-white hover:bg-[#31503a] disabled:opacity-60"><Save size={16} /> {saving ? "Saving..." : needsOnboarding ? "Create profile" : "Save profile"}</button>
            </form>
          </section>

          <div className="space-y-10">{profile && <section className="border-t-2 border-[#527a38] pt-5">
            <div className="mb-5 flex items-end justify-between gap-3"><div><h2 className="font-['Bricolage_Grotesque'] text-xl font-bold">Completed work</h2><p className="mt-1 text-sm text-[#667268]">Records are self-reported until a customer confirms them.</p></div><span className="font-['DM_Mono'] text-xs text-[#667268]">{evidence.length} records</span></div>
            <div className="mb-7 divide-y divide-[#d8dfd4] border-y border-[#d8dfd4]">{evidence.length === 0 ? <p className="py-8 text-sm text-[#667268]">Your completed work will appear here.</p> : evidence.map((item) => <article key={item.id} className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-medium">{item.title}</h3><StatusBadge status={item.verificationStatus} /></div><p className="mt-1 text-sm text-[#667268]">{item.description || item.evidenceType} · {new Date(item.completedDate).toLocaleDateString()}</p></div>{item.verificationStatus === "SELF_REPORTED" && <button onClick={() => requestConfirmation(item.id)} className="inline-flex shrink-0 items-center gap-2 border border-[#c9d3c4] px-3 py-2 text-xs hover:border-[#527a38]">Request confirmation <ArrowUpRight size={14} /></button>}</article>)}</div>
            {confirmationLink && <div className="mb-7 flex items-center gap-2 break-all border border-[#bbcfac] bg-[#edf4e8] p-3 text-xs text-[#3f642b]"><Clipboard size={15} className="shrink-0" /><a href={confirmationLink} className="underline">{confirmationLink}</a></div>}
            <h3 className="mb-4 font-['Bricolage_Grotesque'] text-lg font-bold">Add a finished project or service</h3>
            <form onSubmit={submitEvidence} className="grid gap-4 sm:grid-cols-2">
              <Field label="Title"><input required value={evidenceForm.title} onChange={(event) => setEvidenceForm({ ...evidenceForm, title: event.target.value })} placeholder="Product photo set" className={inputClass} /></Field>
              <Field label="Type"><select value={evidenceForm.evidenceType} onChange={(event) => setEvidenceForm({ ...evidenceForm, evidenceType: event.target.value })} className={inputClass}><option value="PROJECT">Project</option><option value="SERVICE">Service</option><option value="ORDER">Order</option><option value="DELIVERY">Delivery</option><option value="OTHER">Other</option></select></Field>
              <Field label="Completed on"><input type="date" required value={evidenceForm.completedDate} onChange={(event) => setEvidenceForm({ ...evidenceForm, completedDate: event.target.value })} className={inputClass} /></Field>
              <Field label="Customer name (optional)"><input value={evidenceForm.customerName} onChange={(event) => setEvidenceForm({ ...evidenceForm, customerName: event.target.value })} className={inputClass} /></Field>
              <div className="sm:col-span-2"><Field label="Short description (optional)"><textarea rows="2" value={evidenceForm.description} onChange={(event) => setEvidenceForm({ ...evidenceForm, description: event.target.value })} className={`${inputClass} resize-y`} /></Field></div>
              <button disabled={saving} className="inline-flex items-center justify-center gap-2 bg-[#527a38] px-5 py-3 text-sm font-medium text-white hover:bg-[#3f642b] disabled:opacity-60 sm:col-span-2"><Plus size={16} /> {saving ? "Adding..." : "Add completed work"}</button>
            </form>
          </section>}
          {profile && <aside className="flex flex-col gap-3 border-l-2 border-[#d6a34a] bg-[#f8faf6] p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-['DM_Mono'] text-[10px] uppercase text-[#7d897f]">Your public profile</p><p className="mt-1 text-sm">Share the work you’ve chosen to make public.</p></div><Link to={`/p/${profile.publicSlug}`} className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#527a38] hover:underline">Preview profile <ArrowUpRight size={15} /></Link></aside>}</div>
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }) {
  const customerConfirmed = status === "CUSTOMER_CONFIRMED";
  return <span className={`font-['DM_Mono'] text-[9px] uppercase ${customerConfirmed ? "text-[#527a38]" : "text-[#a16b31]"}`}>{customerConfirmed ? "Customer confirmed" : "Self-reported"}</span>;
}

function LoadingState() {
  return <main className="grid min-h-screen place-items-center bg-[#f1f4ed] text-sm text-[#667268]">Loading your work profile…</main>;
}