import { BadgeCheck, Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const evidence = [
  ["12 Sep 2026", "Birthday cake order completed", "Customer confirmed", "Verified"],
  ["08 Sep 2026", "Repeat order completed", "Customer confirmed", "Verified"],
  ["02 Sep 2026", "Business activity record", "Owner submitted", "Self-reported"],
];

export default function PublicProfilePage() {
  const navigate = useNavigate();
  const copyProfile = () => navigator.clipboard?.writeText(window.location.href);

  return (
    <div className="min-h-screen bg-[#080b10] px-5 py-8 text-white md:px-10">
      <header className="mx-auto mb-10 flex max-w-5xl items-center justify-between">
        <button onClick={() => navigate("/")} className="text-2xl font-bold tracking-[-0.05em]">Vou<span className="text-[#ff735c]">ch</span></button>
        <button onClick={copyProfile} className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs text-white/60 hover:bg-white/[0.06]"><Copy size={14} /> Copy profile link</button>
      </header>
      <main className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-[34px] border border-white/10 bg-[#101620]">
          <div className="h-36 bg-[radial-gradient(circle_at_20%_20%,rgba(255,115,92,.45),transparent_38%),linear-gradient(120deg,#191220,#111c26)]" />
          <div className="px-6 pb-8 md:px-10">
            <div className="-mt-12 mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4"><div className="grid h-24 w-24 place-items-center rounded-[28px] border-4 border-[#101620] bg-[#ff735c] text-3xl font-bold text-[#080b10]">AC</div><div className="pb-1"><div className="flex items-center gap-2"><h1 className="text-3xl font-semibold">Amara Cakes</h1><BadgeCheck size={20} className="text-[#7de2c3]" /></div><p className="mt-1 text-sm text-white/45">Online food vendor · Lagos, Nigeria</p></div></div>
              <span className="w-fit rounded-full bg-[#7de2c3]/10 px-4 py-2 text-xs font-semibold text-[#7de2c3]">Identity confirmed</span>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-white/60">Custom celebration cakes and small-event treats, available for pickup and delivery across Lagos.</p>
            <a href="#evidence" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[#080b10]">Inspect evidence <ExternalLink size={14} /></a>
          </div>
        </section>
        <div className="mt-5 grid gap-5 md:grid-cols-[.8fr_1.2fr]">
          <section className="rounded-[30px] border border-white/10 bg-[#101620] p-7"><p className="text-xs uppercase tracking-[.18em] text-white/35">Profile strength</p><div className="my-7 flex items-end gap-2"><strong className="text-7xl text-[#ff806b]">82</strong><span className="pb-2 text-white/30">/ 100</span></div><p className="text-sm leading-6 text-white/55">Strong recent evidence with consistent fulfilment and returning customers.</p><div className="mt-7 space-y-4">{["18 customer confirmations", "94% fulfilment reliability", "6 returning customers", "No unresolved disputes"].map(item => <p key={item} className="flex items-center gap-3 text-sm text-white/65"><Check size={15} className="text-[#7de2c3]" />{item}</p>)}</div></section>
          <section id="evidence" className="rounded-[30px] border border-white/10 bg-[#101620] p-7"><div className="mb-6 flex justify-between"><div><p className="text-xs uppercase tracking-[.18em] text-[#ff806b]">Evidence ledger</p><h2 className="mt-2 text-2xl font-semibold">What this profile is based on</h2></div><ShieldCheck className="text-[#7de2c3]" /></div><div className="divide-y divide-white/8">{evidence.map(([date, title, source, status]) => <div key={title} className="grid gap-2 py-5 sm:grid-cols-[105px_1fr_auto] sm:items-center"><span className="text-xs text-white/30">{date}</span><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-white/35">{source}</p></div><span className={`w-fit rounded-full px-3 py-1 text-[10px] ${status === "Verified" ? "bg-[#7de2c3]/10 text-[#7de2c3]" : "bg-white/[.06] text-white/45"}`}>{status}</span></div>)}</div></section>
        </div>
        <section className="mt-5 rounded-[30px] border border-white/10 bg-[#101620] p-7"><p className="text-xs uppercase tracking-[.18em] text-white/35">Important context</p><p className="mt-3 max-w-3xl text-sm leading-6 text-white/45">Vouch presents submitted and confirmed business evidence. It does not guarantee future performance, approve credit, or replace your own judgment before a transaction.</p></section>
      </main>
    </div>
  );
}
