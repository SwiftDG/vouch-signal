import { useEffect, useState } from "react";
import { ArrowUpRight, Check, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { requestApi } from "../lib/api";

export default function PublicProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    requestApi(`/public/profiles/${encodeURIComponent(slug)}`, { authenticated: false })
      .then((result) => { if (active) setProfile(result); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, [slug]);

  if (error) return <main className="grid min-h-screen place-items-center bg-[#f1f4ed] px-6 text-center"><div><p className="font-['DM_Mono'] text-xs uppercase text-[#a34b3c]">Profile unavailable</p><h1 className="mt-3 font-['Bricolage_Grotesque'] text-3xl font-bold">This profile could not be found.</h1><Link to="/" className="mt-5 inline-block text-sm text-[#527a38] underline">Back to Vouch</Link></div></main>;
  if (!profile) return <main className="grid min-h-screen place-items-center bg-[#f1f4ed] text-sm text-[#667268]">Loading profile…</main>;

  return <main className="min-h-screen bg-[#f1f4ed] text-[#18251d]">
    <header className="border-b border-[#d8dfd4] bg-[#f8faf6]"><div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4"><Link to="/" className="font-['Bricolage_Grotesque'] text-xl font-bold">vouch<span className="text-[#527a38]">/</span></Link><Link to="/signup" className="text-xs text-[#527a38] hover:underline">Make your own profile <ArrowUpRight size={14} className="inline" /></Link></div></header>
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-16">
      <section className="border-b border-[#cbd5c7] pb-8"><p className="font-['DM_Mono'] text-[10px] uppercase text-[#527a38]">Work profile · /{profile.publicSlug}</p><h1 className="mt-3 font-['Bricolage_Grotesque'] text-4xl font-bold sm:text-5xl">{profile.businessName}</h1><p className="mt-2 text-[#667268]">{profile.category || (profile.businessType === "VENDOR" ? "Vendor" : "Freelancer")}</p>{profile.location && <p className="mt-3 flex items-center gap-2 text-sm text-[#667268]"><MapPin size={15} /> {profile.location}</p>}{profile.bio && <p className="mt-6 max-w-2xl whitespace-pre-wrap text-base leading-7 text-[#46534a]">{profile.bio}</p>}{profile.contactUrl && <a href={profile.contactUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#527a38] underline">Contact / portfolio <ArrowUpRight size={15} /></a>}</section>
      <section className="pt-8"><div className="flex items-end justify-between border-b border-[#cbd5c7] pb-4"><div><p className="font-['DM_Mono'] text-[10px] uppercase text-[#527a38]">Selected work</p><h2 className="mt-2 font-['Bricolage_Grotesque'] text-2xl font-bold">Completed records</h2></div><span className="text-xs text-[#667268]">{profile.evidence.length} customer confirmed</span></div>{profile.evidence.length ? <div className="divide-y divide-[#d8dfd4]">{profile.evidence.map((item) => <article key={`${item.title}-${item.completedDate}`} className="grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-['Bricolage_Grotesque'] text-lg font-semibold">{item.title}</h3><span className="inline-flex items-center gap-1 font-['DM_Mono'] text-[9px] uppercase text-[#527a38]"><Check size={12} /> Customer confirmed</span></div>{item.description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667268]">{item.description}</p>}<p className="mt-2 font-['DM_Mono'] text-[10px] uppercase text-[#7d897f]">{item.evidenceType}</p></div><time className="text-sm text-[#667268]">{new Date(item.completedDate).toLocaleDateString()}</time></article>)}</div> : <p className="py-10 text-sm text-[#667268]">No customer-confirmed work has been shared yet.</p>}</section>
      <footer className="mt-12 border-t border-[#cbd5c7] pt-5 text-xs text-[#7d897f]">Vouch shows completed work and customer confirmations. It does not guarantee future performance.</footer>
    </div>
  </main>;
}