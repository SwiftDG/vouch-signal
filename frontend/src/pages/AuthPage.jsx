import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './vouch.css';

export default function AuthPage({ signup = false }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const google = async () => {
    setError(''); setBusy(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } });
    if (authError) { setError(authError.message); setBusy(false); }
  };
  const submit = async event => {
    event.preventDefault(); setError(''); setBusy(true);
    const response = signup
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: name, business_name: business }, emailRedirectTo: `${window.location.origin}/auth/callback` } })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (response.error) { setError(response.error.message); return; }
    if (signup) setSent(true); else navigate('/dashboard');
  };
  return <main className="vouch-site auth-site"><header className="site-nav"><Link to="/" className="wordmark">Vouch<span>.</span></Link><nav><Link to="/">Home</Link></nav></header><div className="auth-layout"><aside className="auth-photo"><div><p className="eyebrow">Everyday trading, made visible</p><h1>A business has a story beyond its paperwork.</h1><p>Explore how a payment pattern might help a lender ask better questions.</p></div></aside><section className="auth-form"><p className="eyebrow">Vouch account</p><h1>{signup ? 'Create an account' : 'Welcome back'}</h1><p>Bring a CSV or enter your transactions after signing in. Your records stay in your browser.</p>{sent && <div role="status" className="auth-info">Check your email to confirm your account, then sign in.</div>}{error && <div role="alert" className="auth-error">{error}</div>}<form onSubmit={submit}>{signup && <><label>Full name<input value={name} onChange={e => setName(e.target.value)} required autoComplete="name" /></label><label>Business name<input value={business} onChange={e => setBusiness(e.target.value)} required /></label></>}<label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete={signup ? 'new-password' : 'current-password'} /></label><button className="action dark" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}</button></form><button className="google-button" onClick={google} disabled={busy}>Continue with Google</button><p>{signup ? <>Already have an account? <Link to="/login">Sign in</Link></> : <>New here? <Link to="/signup">Create an account</Link></>}</p>{!signup && <Link className="demo-link" to="/demo">View guided example</Link>}</section></div></main>;
}
