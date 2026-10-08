import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MovingWave from '../components/MovingWave';
import { assess, sampleActivity, attempts } from '../lib/assessment';
import './vouch.css';
import './demo-score.css';

const choices = [
  { id: 'circle', label: 'Try a circular transfer', explanation: '₦90,000 comes in and goes back to the same account.' },
  { id: 'repeat', label: 'Try five quick payments', explanation: 'One existing customer pays five more times within an hour.' },
  { id: 'passThrough', label: 'Try money in, money out', explanation: '₦80,000 arrives, then leaves fifteen minutes later.' },
];
const money = amount => `₦${amount.toLocaleString('en-NG')}`;

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);
  useEffect(() => {
    const start = current.current;
    const begun = performance.now();
    const duration = 1150;
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

export default function DashboardPage() {
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState([]);
  const rows = started ? [...sampleActivity, ...selected.flatMap(key => attempts[key])] : [];
  const result = assess(rows);
  const add = key => setSelected(current => current.includes(key) ? current : [...current, key]);
  const reset = () => { setStarted(false); setSelected([]); };

  return <main className="vouch-site demo-site">
    <header className="site-nav"><Link to="/" className="wordmark">Vouch<span>.</span></Link><nav><Link to="/">Home</Link><Link to="/login">Sign in</Link></nav></header>
    <section className="demo-heading"><div><p className="eyebrow">Mama Ngozi’s provisions shop</p><h1>What can a month of sales tell us?</h1><p>Follow the payments, then test whether a few suspicious transactions can change the result.</p></div><p className="demo-notice">Sample transactions only. No bank account is connected. This score is an illustration, not a credit decision.</p></section>
    <div className="demo-layout">
      <section className="score-panel"><MovingWave /><div className="score-content"><p className="eyebrow">Illustrative Vouch score</p><div className="score-number"><strong aria-label={`Score ${result.score} out of 620`}><AnimatedNumber value={result.score} /></strong><span>of 620</span></div><p>{started ? 'Built from the eligible payment pattern below.' : 'No activity has been loaded yet.'}</p><div className="measure-grid"><div><strong><AnimatedNumber value={result.days} /></strong><span>days with sales</span></div><div><strong><AnimatedNumber value={result.customers} /></strong><span>paying customers</span></div><div><strong><AnimatedNumber value={result.returning} /></strong><span>returning customers</span></div><div><strong><AnimatedNumber value={result.span} /></strong><span>days of history</span></div></div></div></section>
      <section className="demo-controls"><p className="eyebrow">Run the example</p>{!started ? <><h2>Begin at zero.</h2><p>Load one month of fictional shop payments. The score will use days of sales, distinct customers, returning customers and the time span.</p><button className="action dark" onClick={() => setStarted(true)}>Run a month of sales <span aria-hidden="true">↗</span></button></> : <><h2>Now try to game it.</h2><p>Each attempt is added to the activity. Watch the score and the reason for ignoring it.</p><div className="attempts">{choices.map(choice => <button key={choice.id} disabled={selected.includes(choice.id)} onClick={() => add(choice.id)}><strong>{selected.includes(choice.id) ? 'Added' : choice.label}</strong><small>{choice.explanation}</small></button>)}</div><button className="reset-button" onClick={reset}>Reset the demo</button></>}</section>
    </div>
    {started && <section className="ledger"><div className="ledger-heading"><div><p className="eyebrow">Evidence behind the score</p><h2>What counted, and what did not</h2></div><p>The rules below are a prototype. They have not been tested as a real credit model.</p></div><div className="breakdown">{[['Days with sales',result.breakdown.tradingDays],['Different customers',result.breakdown.customers],['Returning customers',result.breakdown.returning],['Length of activity',result.breakdown.history]].map(([label,value]) => <div key={label}><span>{label}</span><strong>+{value}</strong></div>)}</div><div className="ledger-list">{[...result.ignored, ...result.kept].reverse().map(row => <div key={row.id} className="ledger-row"><span>{String(row.day).padStart(2,'0')} Sep</span><strong>{row.sender}</strong><span>{money(row.amount)}</span><span className={row.reason ? 'excluded' : 'counted'}>{row.reason || 'Counted'}</span></div>)}</div></section>}
    <section className="decision"><h2>A lender sees the reasons.<br />A lender decides.</h2><p>In a real product, an authorized data source, customer consent, identity checks, security review and validation would be necessary. This demo has none of those connections.</p></section>
    <footer className="site-footer"><Link to="/" className="wordmark">Vouch<span>.</span></Link><span>Illustrative prototype</span><Link to="/">Back to home</Link></footer>
  </main>;
}
