import { ArrowRight, ArrowUpRight, Check, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const exampleWork = [
  { type: "PROJECT", title: "Community archive identity", date: "SEP 18" },
  { type: "SERVICE", title: "Product photography set", date: "SEP 11" },
  { type: "ORDER", title: "Hand-built walnut desk", date: "AUG 29" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f1f4ed] text-[#18251d]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
        <Link to="/" className="font-['Bricolage_Grotesque'] text-2xl font-bold">vouch<span className="text-[#527a38]">/</span></Link>
        <nav className="flex items-center gap-5">
          <a href="#how-it-works" className="hidden text-sm text-[#667268] hover:text-[#18251d] sm:block">How it works</a>
          <Link to="/login" className="text-sm text-[#18251d]">Sign in</Link>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-[#18251d] px-4 py-3 text-sm font-medium text-white hover:bg-[#31503a]">Create a profile <ArrowUpRight size={16} /></Link>
        </nav>
      </header>

      <section className="border-y border-[#d8dfd4] bg-[radial-gradient(#cbd5c7_0.7px,transparent_0.7px)] bg-[size:18px_18px]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1fr_0.82fr] md:px-10 md:py-24">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="mb-5 font-['DM_Mono'] text-xs uppercase text-[#527a38]">A portfolio with a paper trail</p>
            <h1 className="max-w-3xl font-['Bricolage_Grotesque'] text-5xl font-bold leading-[0.98] sm:text-6xl md:text-7xl">Let your work<br /><span className="text-[#527a38]">speak for itself.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#59665d] md:text-lg">Build a simple profile of your skills and finished work. Invite customers to confirm a project, delivery, or service, then share one link.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/signup" className="inline-flex items-center gap-3 bg-[#527a38] px-6 py-4 text-sm font-semibold text-white hover:bg-[#3f642b]">Build your profile <ArrowRight size={17} /></Link>
              <a href="#how-it-works" className="px-2 py-4 text-sm text-[#59665d] hover:text-[#18251d]">See how Vouch works</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.12 }} className="relative mx-auto w-full max-w-lg">
            <div className="absolute -left-3 top-8 h-full w-full border border-[#a8b99f]" />
            <article className="relative bg-white p-6 shadow-[0_16px_50px_rgba(24,37,29,0.08)] sm:p-8">
              <div className="flex items-start justify-between border-b border-[#e0e6dd] pb-5"><div><p className="font-['DM_Mono'] text-[10px] uppercase text-[#7d897f]">Example profile</p><h2 className="mt-2 font-['Bricolage_Grotesque'] text-2xl font-bold">Nia Okafor</h2><p className="mt-1 text-sm text-[#667268]">Furniture maker · Lagos</p></div><div className="grid h-11 w-11 place-items-center bg-[#e9f0e3] font-['Bricolage_Grotesque'] text-lg font-bold text-[#527a38]">N</div></div>
              <div className="flex items-center justify-between py-4"><span className="font-['DM_Mono'] text-[10px] uppercase text-[#7d897f]">Selected work</span><span className="text-xs text-[#667268]">3 records</span></div>
              <div className="divide-y divide-[#e7ebe4]">{exampleWork.map((item) => <div key={item.title} className="flex items-center gap-3 py-4"><span className="grid h-8 w-8 shrink-0 place-items-center bg-[#edf4e8] text-[#527a38]"><Check size={15} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.title}</p><p className="mt-1 font-['DM_Mono'] text-[10px] uppercase text-[#7d897f]">{item.type}</p></div><time className="font-['DM_Mono'] text-[10px] text-[#7d897f]">{item.date}</time></div>)}</div>
              <div className="mt-4 flex items-center gap-2 border-t border-[#e0e6dd] pt-4 text-xs text-[#527a38]"><Quote size={14} /> Customer-confirmed work is clearly labelled</div>
            </article>
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[0.7fr_1fr] md:px-10 md:py-24">
        <div><p className="font-['DM_Mono'] text-xs uppercase text-[#527a38]">A clear record, built by you</p><h2 className="mt-4 max-w-sm font-['Bricolage_Grotesque'] text-3xl font-bold leading-tight sm:text-4xl">Skills shown through finished work.</h2></div>
        <div className="grid gap-0 sm:grid-cols-3">{[["01", "Describe your work", "Add the skills you offer and choose a public profile link."], ["02", "Record what you finish", "Keep a clear list of completed projects, orders, or services."], ["03", "Invite confirmation", "A customer can confirm one specific piece of work."]].map(([number, title, body]) => <article key={number} className="border-t border-[#bfcbb9] py-5 sm:border-l sm:border-t-0 sm:pl-5 sm:first:border-l-0 sm:first:pl-0"><p className="font-['DM_Mono'] text-xs text-[#527a38]">{number}</p><h3 className="mt-4 font-['Bricolage_Grotesque'] text-xl font-semibold">{title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-[#667268]">{body}</p></article>)}</div>
      </section>

      <footer className="border-t border-[#d8dfd4]"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-[#667268] sm:flex-row sm:items-center sm:justify-between md:px-10"><span className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#18251d]">vouch<span className="text-[#527a38]">/</span></span><span>Completed work, described honestly and confirmed by customers.</span><Link to="/signup" className="text-[#527a38] hover:underline">Create your profile</Link></div></footer>
    </main>
  );
}
