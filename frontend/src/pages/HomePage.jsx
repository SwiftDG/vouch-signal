import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  Fingerprint,
  Link2,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

const cards = [
  {
    icon: Fingerprint,
    title: "A business identity",
    text: "One profile for who you are, what you do, and how long you have been active.",
  },
  {
    icon: ScanLine,
    title: "Evidence people can inspect",
    text: "Completed work, confirmed orders, and references stay connected to their source.",
  },
  {
    icon: Link2,
    title: "Proof you can carry",
    text: "Share your Vouch link anywhere a new customer or partner needs confidence.",
  },
];

const steps = [
  ["01", "Create", "Choose vendor or freelancer and introduce your business."],
  ["02", "Add evidence", "Record completed orders, projects, and references."],
  ["03", "Confirm", "Customers verify work through a secure request link."],
  ["04", "Share", "Use your Vouch profile anywhere trust matters."],
];

function Logo() {
  return (
    <span className="font-['Bricolage_Grotesque'] text-2xl font-bold tracking-[-0.05em] text-white">
      Vou<span className="text-[#ff735c]">ch</span>
    </span>
  );
}

function ProfilePreview() {
  const navigate = useNavigate();
  const signals = [
    ["Business identity", "Verified", "92%"],
    ["Customer confirmations", "18", "78%"],
    ["Fulfilment reliability", "94%", "94%"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative mx-auto w-full max-w-lg"
    >
      <div className="absolute -inset-12 bg-[#ff735c]/10 blur-[100px]" />
      <div className="relative rounded-[30px] border border-white/10 bg-[#111722]/95 p-6 shadow-2xl shadow-black/50">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ff735c] font-bold text-[#080b10]">AC</div>
            <div>
              <div className="flex items-center gap-1.5 font-semibold">Amara Cakes <BadgeCheck size={16} className="text-[#7de2c3]" /></div>
              <p className="text-xs text-white/40">Online food vendor · Lagos</p>
            </div>
          </div>
          <span className="rounded-full bg-[#7de2c3]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#7de2c3]">Active</span>
        </div>
        <div className="mb-7 grid grid-cols-[88px_1fr] items-center gap-5 rounded-3xl border border-white/8 bg-white/[0.03] p-5">
          <div className="grid h-[88px] w-[88px] place-items-center rounded-full bg-[conic-gradient(#ff735c_0_82%,rgba(255,255,255,.08)_82%)]">
            <div className="grid h-[70px] w-[70px] place-items-center rounded-full bg-[#111722] text-center">
              <div><strong className="block text-2xl">82</strong><span className="text-[8px] uppercase tracking-wider text-white/35">Profile</span></div>
            </div>
          </div>
          <p className="text-sm leading-6 text-white/60">Strong recent evidence with consistent fulfilment and returning customers.</p>
        </div>
        <div className="space-y-4">
          {signals.map(([label, value, width]) => (
            <div key={label}>
              <div className="mb-2 flex justify-between text-xs"><span className="text-white/45">{label}</span><span>{value}</span></div>
              <div className="h-1 rounded-full bg-white/8"><motion.div initial={{ width: 0 }} animate={{ width }} transition={{ duration: 1, delay: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-[#ff735c] to-[#ffb067]" /></div>
            </div>
          ))}
        </div>
        <button onClick={() => navigate("/p/amara-cakes")} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 text-sm font-semibold transition hover:bg-white/10">
          Open example profile <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-[#080b10] text-white selection:bg-[#ff735c] selection:text-black">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#080b10]/75 px-5 backdrop-blur-xl md:px-12">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Logo /></button>
          <div className="hidden gap-8 text-sm text-white/50 md:flex">
            <a href="#product" className="hover:text-white">Product</a>
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#for-who" className="hover:text-white">For businesses</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="hidden px-3 text-sm text-white/60 sm:block">Sign in</button>
            <button onClick={() => navigate("/signup")} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#080b10] hover:bg-[#ff735c]">Build your profile</button>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative px-5 pb-24 pt-36 md:px-12 md:pb-32 md:pt-48">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#ff735c]/[0.07] blur-[130px]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff806b]">Portable proof for independent businesses</p>
              <h1 className="font-['Bricolage_Grotesque'] text-5xl font-semibold leading-[.98] tracking-[-0.055em] md:text-7xl lg:text-[84px]">
                Your business is real.
                <span className="block bg-gradient-to-r from-[#ff735c] to-[#ffb067] bg-clip-text text-transparent">Make it provable.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/55 md:text-lg">Vouch turns completed work, customer confirmations, and business activity into one shareable trust profile for vendors and freelancers.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => navigate("/signup")} className="flex items-center justify-center gap-2 rounded-full bg-[#ff735c] px-7 py-4 text-sm font-semibold text-[#080b10] hover:bg-[#ff8d78]">Create your free profile <ArrowRight size={16} /></button>
                <button onClick={() => navigate("/p/amara-cakes")} className="rounded-full border border-white/12 bg-white/[0.04] px-7 py-4 text-sm font-semibold hover:bg-white/[0.08]">View a live example</button>
              </div>
              <p className="mt-5 flex items-center gap-2 text-xs text-white/35"><ShieldCheck size={14} /> Your evidence stays under your control.</p>
            </motion.div>
            <ProfilePreview />
          </div>
        </section>

        <section id="product" className="border-y border-white/8 bg-[#0c1119] px-5 py-24 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 max-w-3xl"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff735c]">The missing trust layer</p><h2 className="font-['Bricolage_Grotesque'] text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Your reputation is scattered. Vouch brings the evidence together.</h2></div>
            <div className="grid gap-4 md:grid-cols-3">
              {cards.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[28px] border border-white/8 bg-white/[0.025] p-7"><div className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-[#ff735c]/10 text-[#ff735c]"><Icon /></div><h3 className="mb-3 text-xl font-semibold">{title}</h3><p className="text-sm leading-6 text-white/45">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section id="how" className="px-5 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff735c]">How Vouch works</p><h2 className="font-['Bricolage_Grotesque'] text-4xl font-semibold tracking-[-0.04em] md:text-6xl">From activity to credible proof.</h2></div>
            <div className="grid gap-px overflow-hidden rounded-[30px] border border-white/8 bg-white/8 md:grid-cols-4">
              {steps.map(([number, title, text]) => <article key={number} className="min-h-60 bg-[#0b0f16] p-7"><span className="text-xs text-[#ff735c]">{number}</span><h3 className="mt-14 text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/45">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section id="for-who" className="px-5 pb-24 md:px-12 md:pb-32">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
            {[
              { icon: ShoppingBag, type: "For vendors", title: "Turn fulfilled orders into buyer confidence.", points: ["Share on WhatsApp and Instagram", "Collect customer confirmations", "Show activity without exposing private payments"] },
              { icon: BriefcaseBusiness, type: "For freelancers", title: "Carry your work history beyond one platform.", points: ["Confirm completed client work", "Combine references in one profile", "Share proof in proposals and applications"] },
            ].map(({ icon: Icon, type, title, points }) => <article key={type} className="rounded-[32px] border border-white/8 bg-white/[0.035] p-8 md:p-10"><p className="mb-10 flex items-center gap-3 text-sm font-semibold text-[#ff8d78]"><Icon />{type}</p><h3 className="max-w-md text-3xl font-semibold tracking-[-0.035em] md:text-4xl">{title}</h3><div className="mt-8 space-y-4">{points.map(point => <p key={point} className="flex items-center gap-3 text-sm text-white/50"><Check size={16} className="text-[#7de2c3]" />{point}</p>)}</div></article>)}
          </div>
        </section>

        <section className="border-t border-white/8 px-5 py-24 text-center md:px-12 md:py-32"><div className="mx-auto max-w-3xl"><p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff735c]">Start with what you have</p><h2 className="text-4xl font-semibold tracking-[-0.045em] md:text-6xl">Give your work a reputation that travels.</h2><p className="mx-auto mt-6 max-w-xl text-white/45">Create your profile, invite your first customer confirmation, and share one credible link.</p><button onClick={() => navigate("/signup")} className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#080b10] hover:bg-[#ff735c]">Build your Vouch profile <ArrowRight size={16} /></button></div></section>
      </main>

      <footer className="border-t border-white/8 px-5 py-8 md:px-12"><div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between"><Logo /><p>Portable proof for independent businesses.</p><p>© 2026 Vouch</p></div></footer>
    </div>
  );
}
