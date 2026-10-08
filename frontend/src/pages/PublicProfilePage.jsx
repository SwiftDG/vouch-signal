import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { profileRequest } from "../lib/profileApi";
import Brand from "../components/Brand";

const example = {
  publicSlug: "amara-cakes", businessName: "Amara Cakes", businessType: "VENDOR",
  category: "Cake maker", location: "Lagos, Nigeria",
  bio: "An illustrative cake business profile. All names and records here are fictional.",
  evidence: [{ title: "Birthday cake order", evidenceType: "ORDER", completedDate: "2026-09-12", verificationStatus: "CUSTOMER_CONFIRMED" }],
};

function safeContact(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

export default function PublicProfilePage({ exampleMode = false }) {
  const { slug } = useParams();
  return <ProfileContent key={exampleMode ? "example" : slug} slug={slug} exampleMode={exampleMode} />;
}

function ProfileContent({ slug, exampleMode }) {
  const [state, setState] = useState(exampleMode ? { kind: "ready", profile: example } : { kind: "loading" });

  useEffect(() => {
    if (exampleMode) return;
    const controller = new AbortController();
    profileRequest(`/public/profiles/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then((profile) => setState({ kind: "ready", profile }))
      .catch((error) => { if (error.name !== "AbortError") setState({ kind: error.status === 404 ? "missing" : "error", message: error.message }); });
    return () => controller.abort();
  }, [slug, exampleMode]);

  const profile = state.kind === "ready" ? state.profile : null;
  const contact = profile?.contactUrl ? safeContact(profile.contactUrl) : null;
  const records = profile?.evidence?.filter((record) => record.verificationStatus === "CUSTOMER_CONFIRMED") || [];

  return (
    <div className="app-page public-page">
      <header className="app-header"><nav className="app-header-inner" aria-label="Profile navigation"><Brand /><Link className="text-link" to="/"><ArrowLeft size={15} /> Home</Link></nav></header>
      <main className="app-main public-main">
        {state.kind === "loading" && <div role="status" aria-label="Loading public profile" className="public-loading"><div className="skeleton" /><div className="skeleton" /><span className="sr-only">Loading public profile</span></div>}
        {(state.kind === "missing" || state.kind === "error") && <section className="app-panel app-panel-padding" role="alert"><p className="section-label">PUBLIC PROFILE</p><h1 className="app-title">{state.kind === "missing" ? "Profile not found" : "Profile unavailable"}</h1><p className="app-lede">{state.kind === "missing" ? "This profile does not exist or is not public." : state.message}</p><Link className="app-button" to="/">Return home</Link></section>}
        {profile && <>
          {exampleMode && <p className="public-example"><strong>Example profile.</strong> This business, its record and customer response are fictional.</p>}
          <div className="public-breadcrumb"><span>Public profile</span><span>{profile.publicSlug}</span></div>
          <section className="public-hero" aria-labelledby="profile-name"><span className="section-label">INDEPENDENT BUSINESS</span><h1 id="profile-name">{profile.businessName}</h1><p className="public-category">{profile.category || (profile.businessType === "VENDOR" ? "Vendor" : "Freelancer")}{profile.location ? ` in ${profile.location}` : ""}</p>{profile.bio && <p className="public-bio">{profile.bio}</p>}{contact && <a className="button button-light" href={contact} target="_blank" rel="noopener noreferrer">Visit contact link <ArrowUpRight size={17} /></a>}</section>
          <div className="public-layout"><section className="public-records" aria-labelledby="records-heading"><div className="public-section-heading"><div><p className="section-label">THE RECORD</p><h2 id="records-heading">Customer-confirmed work</h2></div><span className="public-count">{records.length} {records.length === 1 ? "entry" : "entries"}</span></div>
            {records.length ? <ol>{records.map((record, index) => <li key={`${record.title}-${record.completedDate}-${index}`} className="public-record"><span className="public-record-index">{String(index + 1).padStart(2, "0")}</span><div><h3>{record.title}</h3>{record.description && <p>{record.description}</p>}<small>{record.evidenceType?.toLowerCase()} completed {new Date(`${record.completedDate.slice(0, 10)}T12:00:00`).toLocaleDateString()}</small></div><span className="public-confirmed"><Check size={14} /> Customer confirmed</span></li>)}</ol> : <p className="public-empty">No customer-confirmed work is public yet. Self-reported records do not appear on this page.</p>}
          </section><aside className="public-aside"><span className="section-label">READ THIS FIRST</span><h2>What does confirmed mean?</h2><p>The business recorded completed work. Someone with a private link responded that its description was accurate.</p><p>Vouch has not verified the respondent's identity. A response cannot guarantee future performance or rule out collusion.</p><div className="public-aside-rule" /><small>Customer names are private by default. Only confirmed records appear here.</small></aside></div>
        </>}
      </main>
      <footer className="public-footer"><div className="app-header-inner"><Brand /><span>A clearer record, not a trust score.</span></div></footer>
    </div>
  );
}
