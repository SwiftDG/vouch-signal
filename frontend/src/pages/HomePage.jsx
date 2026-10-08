import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import RecordWave from "../components/RecordWave";
import { assessTransactions } from "../lib/transactionDemo";
import "./transaction-demo.css";

const example = assessTransactions();

export default function HomePage() {
  return <div className="tx-site vouch-home">
    <header className="tx-header"><div className="tx-wrap tx-header-inner"><Brand /><nav aria-label="Main navigation"><a href="#problem">The problem</a><a href="#method">How it works</a><Link to="/demo">Try the demo</Link></nav><span className="tx-demo-tag">TEAM NOVATE / 2026</span></div></header>
    <main>
      <section className="vh-hero"><div className="tx-wrap vh-hero-grid"><div><p className="tx-kicker">INCLUSIVE FINANCE / VOUCH</p><h1>Her business moves money.<br /><span>Can a lender see why?</span></h1><p>Mama Ngozi receives customer payments every week. Without a borrowing history, her business may be difficult for a lender to assess. Vouch is exploring a clearer view of the activity she already has.</p><div className="vh-actions"><Link to="/demo" className="vh-primary">Try the transaction demo <span aria-hidden="true">↗</span></Link><a href="#method">See how it works</a></div><small>Prototype with sample transactions. No bank account is connected.</small></div><div className="vh-visual" aria-label="Illustrative activity record"><div className="vh-visual-head"><span>MAMA NGOZI / SAMPLE ACCOUNT</span><span>01</span></div><div className="vh-visual-score"><span>Activity score</span><strong>{example.score}</strong><small>Based on the sample ledger</small></div><div className="vh-visual-rows"><div><span>Active weeks</span><strong>04</strong></div><div><span>Different customers</span><strong>05</strong></div><div><span>Returning customers</span><strong>02</strong></div></div><RecordWave /></div></div></section>
      <section id="problem" className="vh-problem"><div className="tx-wrap vh-two"><div><p className="tx-kicker">01 / THE GAP</p><h2>An empty credit file does not mean an empty business.</h2></div><p>A lender may see little borrowing history for a small trader, even while payments move through her account. Transaction history can offer more context. Whether those patterns predict repayment still needs testing with real outcomes.</p></div></section>
      <section id="method" className="tx-wrap vh-method"><p className="tx-kicker">02 / THE METHOD</p><h2>From account activity to an explanation.</h2><div className="vh-steps"><article><span>01</span><h3>Read the pattern</h3><p>Count active weeks, different paying customers and customers who return.</p></article><article><span>02</span><h3>Question unusual activity</h3><p>Group repeated payments and set aside matching return transfers or rapid outflows for review.</p></article><article><span>03</span><h3>Show the reasons</h3><p>Give the lender the transactions and rules behind the prototype score. The lender remains responsible for the decision.</p></article></div></section>
      <section className="vh-demo-band"><div className="tx-wrap"><p className="tx-kicker">THE WORKING DEMONSTRATION</p><h2>Try to make the number move.</h2><p>Start with a small trader’s sample payments. Add unusual transactions and inspect which ones count.</p><Link to="/demo" className="vh-primary">Open the demo <span aria-hidden="true">↗</span></Link></div></section>
      <section className="tx-wrap vh-limit"><h2>What this is today</h2><p>A rule-based prototype using invented transactions. It does not connect to a bank, verify identities, detect proven fraud, offer a loan or predict repayment. The next step is to test whether its explanations add value to a lender’s existing review.</p></section>
    </main><footer className="tx-footer"><div className="tx-wrap"><Brand /><span>Team Novate · InnovateX 2026</span></div></footer>
  </div>;
}
