import { Link } from 'react-router-dom';
import MovingWave from '../components/MovingWave';
import './vouch.css';

export default function HomePage() {
  return <main className="vouch-site">
    <header className="site-nav"><Link to="/" className="wordmark">Vouch<span>.</span></Link><nav><Link to="/dashboard">See the demo</Link><Link to="/login">Sign in</Link></nav></header>
    <section className="photo-hero">
      <div className="hero-copy"><p className="eyebrow">For small businesses</p><h1>Her shop has a history.<br />The bank sees a blank page.</h1><p>Mama Ngozi sells provisions every day. Customers pay her. Some return. Those payments could tell a lender more than an empty credit file.</p><Link className="action light" to="/dashboard">Watch her score grow <span aria-hidden="true">↗</span></Link></div>
    </section>
    <section className="counter-story">
      <div className="counter-copy"><p className="small-label">A month behind the counter</p><h2>₦3,800 on Monday.<br />₦5,100 on Tuesday.<br />The same customer next week.</h2><p>A payment amount alone says very little. The days a shop trades, the number of people who pay and the customers who come back form a more useful picture. Vouch’s example follows those patterns instead of treating every incoming naira as proof.</p><Link to="/dashboard" className="text-link">See the sample payments <span aria-hidden="true">↗</span></Link></div>
      <div className="counter-photo"><img src="/images/jos-market-fruit.webp" alt="Fruit arranged for sale at a market in Jos, Nigeria" loading="lazy" /></div>
    </section>
    <section className="score-story"><div><p className="small-label">What the example can show</p><h2>From zero to a reasoned score.</h2><p>The interactive example begins with no activity. Load a month of shop payments and see the score change alongside its four ingredients.</p><Link className="action dark" to="/dashboard">Run the example <span aria-hidden="true">↗</span></Link></div><div className="score-preview" aria-label="Example score 484 out of 620"><span>Sample month</span><strong>484</strong><p>12 days with sales<br />8 paying customers<br />3 returning customers<br />28 days of activity</p></div></section>
    <section className="wave-story"><MovingWave /><div><p className="small-label">Try to fool the score</p><h2>Busy is easy to fake.<br />Steady trade is harder.</h2><p>Send money in a circle and it is left out. Split one customer’s payment into five and it still counts as one customer. Move money straight out and that payment does not help the score.</p><Link className="action outline" to="/dashboard">Test the three attempts <span aria-hidden="true">↗</span></Link></div></section>
    <section className="decision-story"><div><h2>A score opens a conversation.<br />It does not approve a loan.</h2></div><div><p>A lender needs to see why a score changed, and which activity was ignored. The lender makes the decision. Vouch does not lend money.</p><p>The site currently uses sample transactions and illustrative rules. Using real account data would require the merchant’s consent, a permitted data source and testing with lenders.</p><Link to="/dashboard" className="text-link">Explore the working example <span aria-hidden="true">↗</span></Link></div></section>
    <footer className="site-footer"><Link to="/" className="wordmark">Vouch<span>.</span></Link><span>Make trading history visible.</span><Link to="/dashboard">Open demo</Link></footer>
  </main>;
}
