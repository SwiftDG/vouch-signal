import { Link } from 'react-router-dom';
import MovingWave from '../components/MovingWave';
import './vouch.css';

export default function HomePage() {
  return <main className="vouch-site">
    <header className="site-nav"><Link to="/" className="wordmark">Vouch<span>.</span></Link><nav><Link to="/dashboard">See the demo</Link><Link to="/login">Sign in</Link></nav></header>
    <section className="photo-hero">
      <div className="hero-copy"><p className="eyebrow">For the businesses banks struggle to see</p><h1>Her shop has a history.<br />The bank sees a blank page.</h1><p>Each customer payment tells part of the story. Vouch turns everyday trading activity into a score a lender can question and understand.</p><Link className="action light" to="/dashboard">Watch Mama Ngozi’s score grow <span aria-hidden="true">↗</span></Link></div>
      <p className="photo-credit">Abuja market photograph: Muhammad-Taha Ibrahim / Pexels. The demo business is illustrative.</p>
    </section>
    <section className="statement"><div className="statement-intro"><p className="eyebrow">01 / The problem</p><h2>Sales happen every day.<br />Credit history may never begin.</h2></div><p>A provisions seller can receive payments, restock and serve returning customers for years. A lender may still have little evidence to judge her business. Vouch is a proposed way to read that trading pattern, with the merchant’s consent.</p></section>
    <section className="wave-story"><MovingWave /><div><p className="eyebrow">02 / The signal</p><h2>Count the pattern.<br />Show the reasons.</h2><p>Days with sales, different paying customers and customers who return can add to a score. A circular transfer, repeated payments from one customer and money that goes straight back out should not inflate it.</p><Link className="action outline" to="/dashboard">Try the sample transactions <span aria-hidden="true">↗</span></Link></div></section>
    <section className="statement last"><div><p className="eyebrow">03 / The decision</p><h2>The bank makes the call.</h2></div><p>Vouch does not lend or guarantee a loan. The demo shows a rule-based prototype using sample transactions. A real lender would need consented transaction data, testing and its own checks before using a signal like this.</p></section>
    <footer className="site-footer"><Link to="/" className="wordmark">Vouch<span>.</span></Link><span>Make trading history visible.</span><Link to="/dashboard">Open demo</Link></footer>
  </main>;
}
