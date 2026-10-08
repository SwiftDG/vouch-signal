import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowRight, Check, Menu, X } from "lucide-react";
import ParticleBurst from "../components/ParticleBurst";
import Brand from "../components/Brand";
import RecordWave from "../components/RecordWave";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

const stages = [
  { number: "01", title: "Start with a profile", detail: "Say what your business does and choose a link you can share." },
  { number: "02", title: "Record completed work", detail: "Add an order or project. It starts as your own account of what happened." },
  { number: "03", title: "Ask for a response", detail: "Send a one-use link to the customer. They can confirm or decline without an account." },
  { number: "04", title: "Let the record speak", detail: "A public profile shows customer-confirmed work, with the source of that claim explained." },
];

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Brand />
        <nav className={open ? "site-nav is-open" : "site-nav"} aria-label="Main navigation">
          <a href="#the-record" onClick={() => setOpen(false)}>The record</a>
          <a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a>
          <a href="#why-vouch" onClick={() => setOpen(false)}>Why Vouch</a>
          <Link to="/example/amara-cakes" onClick={() => setOpen(false)}>Example profile</Link>
        </nav>
        <div className="site-header-actions">
          <Link className="text-link sign-in-link" to="/login">Sign in</Link>
          <Link className="button button-primary button-small" to="/signup">Create profile <ArrowRight size={16} /></Link>
        </div>
        <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function ExampleRecord() {
  return (
    <div className="product-window" aria-label="Fictional Vouch profile preview">
      <div className="window-top"><span className="window-dots"><i /><i /><i /></span><span>Amara Cakes</span><span className="window-example">Illustrative profile</span></div>
      <div className="window-body">
        <div className="window-identity"><div className="window-monogram">AC</div><div><span className="eyebrow">BUSINESS PROFILE</span><h3>Amara Cakes</h3><p>Cake maker in Lagos, Nigeria</p></div></div>
        <div className="window-divider" />
        <p className="window-section-label">Completed work shared publicly</p>
        <div className="window-record"><span className="window-record-icon"><Check size={15} strokeWidth={2.5} /></span><div><strong>Birthday cake order</strong><small>Order completed 12 September 2026</small></div><span className="window-record-status">Customer confirmed</span></div>
        <div className="window-note"><span>What this means</span><p>The business added this record. Someone with its private link confirmed the description. Vouch has not verified that person's identity.</p></div>
      </div>
    </div>
  );
}

function EvidenceComparison() {
  return (
    <div className="comparison-sheet">
      <div className="comparison-head"><span>TWO RECORDS</span><span>STATUS</span></div>
      <div className="comparison-row"><div><strong>Custom celebration cake</strong><span>Added by Amara Cakes</span></div><span className="status-chip status-self">Self-reported</span></div>
      <div className="comparison-row"><div><strong>Birthday cake order</strong><span>Added by Amara Cakes. Customer response received.</span></div><span className="status-chip status-confirmed">Customer confirmed</span></div>
      <p className="comparison-caption">Fictional examples. A response is a record of a claim, not identity verification.</p>
    </div>
  );
}

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion ? {} : reveal;

  return (
    <div className="vouch-site">
      <Header />
      <main>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="page-rail hero-grid">
            <motion.div className="hero-copy" {...motionProps}>
              <p className="eyebrow hero-eyebrow">PORTABLE BUSINESS TRUST PROFILES</p>
              <h1 id="home-title">Your work has a history.<br /><em>Give it a place to live.</em></h1>
              <p className="hero-description">Vouch helps independent businesses record completed work, invite a customer response, and share a profile that shows what came from whom.</p>
              <div className="hero-actions"><Link className="button button-primary" to="/signup">Create your profile <ArrowRight size={18} /></Link><Link className="button button-outline" to="/example/amara-cakes">Explore an example <ArrowDownRight size={18} /></Link></div>
              <p className="hero-footnote">Built for vendors and freelancers. A customer can respond without creating an account.</p>
            </motion.div>
            <motion.div className="hero-product" initial={reduceMotion ? false : { opacity: 0, y: 36, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
              <figure className="hero-photo"><img src="/images/vouch-order.webp" alt="A boxed celebration cake on a baker’s worktable" /><figcaption>Illustrative image</figcaption></figure>
              <ExampleRecord />
              <span className="product-annotation">A record you can inspect, not a score you have to trust.</span>
            </motion.div>
          </div>
          <div className="page-rail hero-bottom"><span>THE IDEA</span><a href="#the-record">See how a record works <ArrowDownRight size={16} /></a></div>
        </section>

        <section className="thesis-band" id="the-record" aria-labelledby="record-heading">
          <div className="page-rail thesis-grid">
            <motion.div {...motionProps}><p className="eyebrow">THE RECORD</p><h2 id="record-heading">Screenshots tell a story.<br /><em>Provenance tells you more.</em></h2></motion.div>
            <motion.div {...motionProps}><p>WhatsApp chats and Instagram highlights are useful, but a new buyer has to piece the story together. Vouch gives each completed job a clear status, so a viewer can distinguish what a business reported from what received a customer response.</p><p className="thesis-caveat">A confirmation does not establish identity, eliminate collusion, or guarantee future performance.</p></motion.div>
          </div>
        </section>

        <section className="evidence-section" aria-labelledby="evidence-heading">
          <div className="page-rail evidence-grid">
            <motion.div className="evidence-intro" {...motionProps}><p className="eyebrow">THE DIFFERENCE</p><h2 id="evidence-heading">The label changes<br />when the source does.</h2><p>Every record begins as self-reported. If a customer uses a private link to confirm the description, it can appear on the public profile as customer-confirmed. A decline leaves the record self-reported.</p><Link className="inline-link" to="/example/amara-cakes">See the fictional profile <ArrowRight size={17} /></Link></motion.div>
            <motion.div {...motionProps}><EvidenceComparison /></motion.div>
          </div>
        </section>

        <motion.section className="journey-section" id="how-it-works" initial={reduceMotion ? false : { backgroundColor: "#1a1014" }} whileInView={{ backgroundColor: "#682b36" }} viewport={{ amount: 0.3, once: true }} transition={{ duration: 1.4 }} aria-labelledby="journey-heading">
          <RecordWave />
          <div className="page-rail journey-content">
            <motion.div {...motionProps}><p className="eyebrow eyebrow-light">A SIMPLE SEQUENCE</p><h2 id="journey-heading">From completed work<br />to a clearer decision.</h2><p>One link for the customer. One place for the next person to look.</p></motion.div>
            <div className="journey-steps">{stages.map((stage) => <motion.article key={stage.number} {...motionProps}><span>{stage.number}</span><div><h3>{stage.title}</h3><p>{stage.detail}</p></div><ArrowDownRight size={20} aria-hidden="true" /></motion.article>)}</div>
          </div>
        </motion.section>

        <section className="audience-section" id="why-vouch" aria-labelledby="audience-heading">
          <div className="page-rail"><p className="eyebrow">WHO IT IS FOR</p><h2 id="audience-heading">A history you can carry<br />beyond the last chat.</h2><div className="audience-grid"><article><span className="audience-index">VENDORS</span><h3>When a new buyer asks if you have delivered before.</h3><p>Keep a shareable account of completed orders, with customer responses separated from your own records.</p></article><article><span className="audience-index">FREELANCERS</span><h3>When past work lives across scattered platforms.</h3><p>Bring projects into one profile and ask clients to respond to a specific, plain-language description.</p></article><article><span className="audience-index">VIEWERS</span><h3>When you need to know what the evidence actually says.</h3><p>Inspect the dates, work descriptions, and provenance before deciding whether to start a conversation.</p></article></div></div>
        </section>

        <section className="closing-section"><div className="page-rail closing-inner"><div><p className="eyebrow eyebrow-light">VOUCH IS STILL BEING TESTED</p><h2>Make your work easier<br />to understand.</h2><p>Start with one completed order or project. Share only what you are comfortable making public.</p><Link className="button button-light" to="/signup">Create your profile <ArrowRight size={18} /></Link></div><div className="closing-burst" aria-hidden="true"><ParticleBurst /></div></div></section>
      </main>
      <footer className="site-footer"><div className="page-rail footer-inner"><Brand /><p>Portable proof for independent businesses.</p><div><Link to="/example/amara-cakes">View example</Link><Link to="/login">Sign in</Link></div><span>© 2026 Vouch</span></div></footer>
    </div>
  );
}
