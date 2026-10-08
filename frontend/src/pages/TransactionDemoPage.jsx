import { useState } from "react";
import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import { assessTransactions } from "../lib/transactionDemo";
import "./transaction-demo.css";

const cases = [
  { id: "repeat", title: "Several payments from one customer", description: "Payments from the same sender on one day count as one customer interaction." },
  { id: "cycle", title: "Money sent back to its source", description: "A matching return payment is excluded from the activity calculation." },
  { id: "outflow", title: "Money leaves right away", description: "A large rapid outflow makes this incoming payment ineligible for points." },
];

const money = (amount) => `₦${amount.toLocaleString("en-NG")}`;
const date = (value) => new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" }).format(new Date(value));

export default function TransactionDemoPage() {
  const [active, setActive] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const result = assessTransactions(active, loaded);
  const toggle = (id) => setActive((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]);

  return <div className="tx-site">
    <header className="tx-header"><div className="tx-wrap tx-header-inner"><Brand /><nav aria-label="Main navigation"><Link to="/">The idea</Link><a href="#cases">Try the checks</a><a href="#ledger">Inspect payments</a></nav><span className="tx-demo-tag">INTERACTIVE DEMO</span></div></header>
    <main>
      <section className="tx-intro tx-wrap"><div><p className="tx-kicker">VOUCH / A DEMONSTRATION WITH SAMPLE TRANSACTIONS</p><h1>See what counts.<br /><span>See what does not.</span></h1><p>This is Mama Ngozi’s made-up provision shop. Add unusual payments and watch the activity calculation respond. You can inspect every decision below.</p></div><div className="tx-score" aria-live="polite"><span>PROTOTYPE ACTIVITY SCORE</span><strong>{result.score}<small> / 1000</small></strong><p>{result.counted} counted customer payments<br />{result.excluded} excluded for review · {result.grouped} grouped</p></div></section>
      <section className="tx-cases" id="cases"><div className="tx-wrap"><div className="tx-section-head"><div><p className="tx-kicker">01 / TEST THE RULES</p><h2>Build the example</h2></div><button className="tx-reset" onClick={() => { setActive([]); setLoaded(false); }} disabled={!active.length && !loaded}>Start over</button></div><button className="tx-load" onClick={() => setLoaded(true)} disabled={loaded}>{loaded ? "Four weeks loaded" : "Load four weeks of customer payments"}</button><p className="tx-case-note">The example begins at zero. Load the ordinary payments, then try unusual activity.</p><div className="tx-case-grid">{cases.map((item) => <button key={item.id} type="button" disabled={!loaded} onClick={() => toggle(item.id)} aria-pressed={active.includes(item.id)} className={`tx-case ${active.includes(item.id) ? "tx-case-active" : ""}`}><span className="tx-case-indicator">{active.includes(item.id) ? "ADDED" : "ADD CASE"}</span><strong>{item.title}</strong><span>{item.description}</span></button>)}</div><p className="tx-case-note">A warning excludes a payment from this demonstration’s points. It does not prove wrongdoing.</p></div></section>
      <section className="tx-wrap tx-analysis"><div className="tx-section-head"><div><p className="tx-kicker">02 / SHOW THE WORK</p><h2>Where the number comes from</h2></div></div><div className="tx-breakdown">{result.breakdown.map((item) => <div key={item.label}><span>{item.label}</span><strong>+{item.points}</strong><small>{item.explanation}</small></div>)}</div><p className="tx-boundary">This score is a rule-based activity illustration, not a validated credit score. It cannot tell whether Mama Ngozi will repay a loan. A lender would need consented data, repayment outcomes, fraud review and independent validation before using it for credit decisions.</p></section>
      <section className="tx-ledger" id="ledger"><div className="tx-wrap"><div className="tx-section-head"><div><p className="tx-kicker">03 / INSPECT THE EVIDENCE</p><h2>Every payment has a reason</h2></div><span>{result.reviewed.length} sample entries</span></div><div className="tx-table-wrap"><table><thead><tr><th>When</th><th>Movement</th><th>Other account</th><th>Amount</th><th>Decision and reason</th></tr></thead><tbody>{result.reviewed.map((row) => <tr key={row.id}><td>{date(row.at)}</td><td>{row.direction === "in" ? "Received" : "Sent"}</td><td>{row.party}</td><td>{money(row.amount)}</td><td><span className={`tx-status tx-status-${row.status.toLowerCase()}`}>{row.status}</span><span className="tx-reason">{row.reason}</span></td></tr>)}</tbody></table></div></div></section>
      <section className="tx-wrap tx-next"><p className="tx-kicker">WHAT COMES NEXT</p><h2>A bank makes the decision.</h2><p>Vouch is being developed as an explainable signal for lenders reviewing people with limited credit history. This page uses invented transactions and does not connect to a bank account.</p><Link to="/">Back to the idea</Link></section>
    </main><footer className="tx-footer"><div className="tx-wrap"><Brand /><span>Team Novate · InnovateX 2026</span></div></footer>
  </div>;
}
