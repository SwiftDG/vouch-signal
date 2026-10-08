import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MovingWave from '../components/MovingWave';
import { assess, sampleActivity, newSales, attempts } from '../lib/assessment';
import './vouch.css';
import './demo-score.css';

const choices = [
  { id: 'circle', label: 'Try a circular transfer', explanation: '₦90,000 comes in and goes back to the same account.' },
  { id: 'repeat', label: 'Try five quick payments', explanation: 'One existing customer pays five more times within an hour.' },
  { id: 'passThrough', label: 'Try money in, money out', explanation: '₦80,000 arrives, then leaves fifteen minutes later.' },
];
const stages = [
  { count: 4, label: 'Add the first four sales', detail: 'Four days of sales, three customers, one who returns.' },
  { count: 8, label: 'Add four more sales', detail: 'More trading days and more returning customers.' },
  { count: 12, label: 'Finish the month', detail: 'Twelve sales over 28 days bring the score to 484.' },
];
const money = amount => `₦${amount.toLocaleString('en-NG')}`;

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);
  useEffect(() => {
    const start = current.current;
    const begun = performance.now();
    const duration = 850;
    let frame;
    const tick = now => {
      const progress = Math.min((now - begun) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = Math.round(start + (value - start) * eased);
      current.current = next;
      setDisplay(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      frame = requestAnimationFrame(() => { current.current = value; setDisplay(value); });
    } else frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return display;
}

export default function DemoPage() {
  const [stage, setStage] = useState(0);
  const [extraSales, setExtraSales] = useState(0);
  const [selected, setSelected] = useState([]);
  const [lastChange, setLastChange] = useState(null);
  const rows = [...sampleActivity.slice(0, stages[stage - 1]?.count || 0), ...newSales.slice(0, extraSales), ...selected.flatMap(key => attempts[key])];
  const result = assess(rows);
  const advance = () => {
    const next = stage + 1;
    const previous = result.score;
    const updated = assess(sampleActivity.slice(0, stages[next - 1].count));
    setLastChange({ delta: updated.score - previous, text: stages[next - 1].detail });
    setStage(next);
  };
  const addSale = () => {
    const next = extraSales + 1;
    const updated = assess([...sampleActivity, ...newSales.slice(0, next)]);
    const text = next === 1
      ? 'A new customer paid on another trading day. The score gains 12 for that day, 18 for the customer and 8 for longer history.'
      : 'Customer 08 paid again on another day. The score gains 12 for that trading day and 28 for a returning customer.';
    setLastChange({ delta: updated.score - result.score, text });
    setExtraSales(next);
  };
  const addAttempt = key => {
    const updated = assess([...rows, ...attempts[key]]);
    setLastChange({ delta: updated.score - result.score, text: 'These payments were excluded by the rules below. No eligible trading activity was added.' });
    setSelected(current => [...current, key]);
  };
  const reset = () => { setStage(0); setExtraSales(0); setSelected([]); setLastChange(null); };
  const complete = stage === stages.length;

  return <main className="vouch-site demo-site">
    <header className="site-nav"><Link to="/" className="wordmark">Vouch<span>.</span></Link><nav><Link to="/">Home</Link><Link to="/login">Sign in</Link></nav></header>
    <section className="demo-heading"><div><p className="eyebrow">Mama Ngozi’s provisions shop</p><h1>What can a month of sales tell us?</h1><p>Add the payments, see why the score changes, then test whether suspicious transactions can change it.</p></div><p className="demo-notice">Sample transactions only. No bank account is connected. This score is an illustration, not a credit decision.</p></section>
    <div className="demo-layout">
      <section className="score-panel"><MovingWave /><div className="score-content"><p className="eyebrow">Illustrative Vouch score</p><div className="score-number"><strong aria-label={`Score ${result.score} out of 620`}><AnimatedNumber value={result.score} /></strong><span>of 620</span></div><p>{stage ? 'Built from the eligible payment pattern below.' : 'No activity has been loaded yet.'}</p><div className="measure-grid"><div><strong><AnimatedNumber value={result.days} /></strong><span>days with sales</span></div><div><strong><AnimatedNumber value={result.customers} /></strong><span>paying customers</span></div><div><strong><AnimatedNumber value={result.returning} /></strong><span>returning customers</span></div><div><strong><AnimatedNumber value={result.span} /></strong><span>days of history</span></div></div></div></section>
      <section className="demo-controls"><p className="eyebrow">Follow the sales</p>
        {!complete ? <><h2>{stage ? 'The pattern is growing.' : 'Begin at zero.'}</h2><p>Each group of payments adds trading days, customers and repeat visits. The numbers on the left come from those payments.</p><button className="action dark" onClick={advance}>{stages[stage].label} <span aria-hidden="true">↗</span></button></> : <><h2>What happens next?</h2><p>The first month gives her 484. Add genuine sales to see it rise, then try payments that should not count.</p>{extraSales < newSales.length && <button className="action dark" onClick={addSale}>{extraSales ? 'Add a returning customer sale' : 'Add a new customer sale'} <span aria-hidden="true">↗</span></button>}<div className="attempts">{choices.map(choice => <button key={choice.id} disabled={selected.includes(choice.id)} onClick={() => addAttempt(choice.id)}><strong>{selected.includes(choice.id) ? 'Added' : choice.label}</strong><small>{choice.explanation}</small></button>)}</div></>}
        {lastChange && <div className="score-change" role="status"><strong>{lastChange.delta ? `+${lastChange.delta} points` : 'No score change'}</strong><p>{lastChange.text}</p></div>}
        {stage > 0 && <button className="reset-button" onClick={reset}>Reset the demo</button>}
      </section>
    </div>
    {stage > 0 && <section className="ledger"><div className="ledger-heading"><div><p className="eyebrow">Evidence behind the score</p><h2>What counted, and what did not</h2></div><p>The rules below are a prototype. They have not been tested as a real credit model.</p></div><div className="breakdown">{[['Days with sales',result.breakdown.tradingDays],['Different customers',result.breakdown.customers],['Returning customers',result.breakdown.returning],['Length of activity',result.breakdown.history]].map(([label,value]) => <div key={label}><span>{label}</span><strong>+{value}</strong></div>)}</div><div className="ledger-list">{[...result.ignored, ...result.kept].reverse().map(row => <div key={row.id} className="ledger-row"><span>{String(row.day).padStart(2,'0')} {newSales.includes(row) ? 'Oct' : 'Sep'}</span><strong>{row.sender}</strong><span>{money(row.amount)}</span><span className={row.reason ? 'excluded' : 'counted'}>{row.reason || 'Counted'}</span></div>)}</div></section>}
    <section className="decision"><h2>A lender sees the reasons.<br />A lender decides.</h2><p>In a real product, an authorized data source, customer consent, identity checks, security review and validation would be necessary. This demo has none of those connections.</p></section>
    <footer className="site-footer"><Link to="/" className="wordmark">Vouch<span>.</span></Link><span>Illustrative prototype</span><Link to="/">Back to home</Link></footer>
  </main>;
}
