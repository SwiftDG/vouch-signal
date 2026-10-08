import { Link } from 'react-router-dom';
import './vouch.css';
export default function PageNotFound() { return <main className="vouch-site"><header className="site-nav"><Link to="/" className="wordmark">Vouch<span>.</span></Link></header><section className="statement" style={{minHeight:'70vh',alignItems:'center'}}><div><p className="eyebrow">Page not found</p><h2>There is nothing at this address.</h2></div><p>Check the link, or <Link to="/" style={{color:'#743d41',textDecoration:'underline'}}>return to the home page</Link>.</p></section></main>; }
