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
  return <main className="vouch-site auth-site"><header className="site-nav"><Link to="/" className="wordmark">Vouch<span>.</span></Link><nav><Link to="/">Home</Link></nav></header><div className="auth-layout"><aside className="auth-photo"><div><p className="eyebrow">Everyday trading, made visible</p><h1>A business has a story beyond its paperwork.</h1><p>Explore how a payment pattern might help a lender ask better questions.</p></div></aside><section className="auth-form"><p className="eyebrow">Vouch account</p><h1>{signup ? 'Create an account' : 'Welcome back'}</h1><p>Bring a CSV or enter your transactions after signing in. Your records stay in your browser.</p>{sent && <div role="status" className="auth-info">Check your email to confirm your account, then sign in.</div>}{error && <div role="alert" className="auth-error">{error}</div>}<form onSubmit={submit}>{signup && <><label>Full name<input value={name} onChange={e => setName(e.target.value)} required autoComplete="name" /></label><label>Business name<input value={business} onChange={e => setBusiness(e.target.value)} required /></label></>}<label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete={signup ? 'new-password' : 'current-password'} /></label><button className="action dark" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}</button></form><button className="google-button" onClick={google} disabled={busy}><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg><span>Continue with Google</span></button><p>{signup ? <>Already have an account? <Link to="/login">Sign in</Link></> : <>New here? <Link to="/signup">Create an account</Link></>}</p>{!signup && <Link className="demo-link" to="/demo">View guided example</Link>}</section></div></main>;
}
