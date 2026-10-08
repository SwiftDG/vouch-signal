import { Link } from 'react-router-dom';
import MovingWave from '../components/MovingWave';
import './vouch.css';

export default function HomePage() {
  return <main className="vouch-site">
    <header className="site-nav"><Link to="/" className="wordmark">Vouch<span>.</span></Link><nav><Link to="/login">Sign in</Link><Link to="/signup">Get started</Link></nav></header>
    <section className="photo-hero">
      <div className="hero-copy"><p className="eyebrow">For businesses built one sale at a time</p><h1>There is a story<br />in your payments.</h1><p>See when your business trades, how many customers pay you and who comes back. Vouch turns those records into a clear account of your activity.</p><Link className="action light" to="/signup">Get started <span aria-hidden="true">↗</span></Link></div>
    </section>
    <section className="counter-story">
      <div className="counter-copy"><p className="small-label">More than money in</p><h2>One sale.<br />Another tomorrow.<br />A customer who returns.</h2><p>A large payment by itself may tell little about a shop. Vouch looks at days with sales, named payers, returning payers and how long that activity continues.</p><p>Upload a CSV of your transactions or enter them yourself. You can see exactly what counted.</p></div>
      <div className="counter-photo"><img src="/images/jos-market-fruit.webp" alt="Fruit arranged for sale at a market in Jos, Nigeria" loading="lazy" /></div>
    </section>
    <section className="score-story"><div><p className="small-label">Your activity, explained</p><h2>A number you can take apart.</h2><p>The score adds points for active trading days, named payers, returning payers and the length of the record. Open each measure to understand where it came from.</p><Link className="action dark" to="/signup">Create your account <span aria-hidden="true">↗</span></Link></div><div className="score-preview" aria-label="The four measures in the Vouch activity score"><span>What Vouch reads</span><ul><li>Days with sales</li><li>Named payers</li><li>Returning payers</li><li>Length of activity</li></ul></div></section>
    <section className="wave-story"><MovingWave /><div><p className="small-label">A closer look at each payment</p><h2>More payments do not always mean more trade.</h2><p>Vouch leaves out a payment that quickly returns to the same account. Several payments from one customer within an hour count as one. Money that comes in and moves straight out does not add to the score.</p></div></section>
    <section className="decision-story"><div><h2>Bring your records.<br />See what they show.</h2></div><div><p>You can use Vouch now with a CSV statement or transactions you enter. The calculation happens in your browser, so your records are not uploaded to Vouch.</p><p>A score from a file you provide is not proof of a payment or an approval for credit. A lender would need verified records and its own checks to make a decision.</p><Link to="/signup" className="text-link">Get started <span aria-hidden="true">↗</span></Link></div></section>
    <footer className="site-footer"><Link to="/" className="wordmark">Vouch<span>.</span></Link><span>Make trading history visible.</span><Link to="/login">Sign in</Link></footer>
  </main>;
}
