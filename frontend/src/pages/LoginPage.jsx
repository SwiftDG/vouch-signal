import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import Brand from "../components/Brand";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams.get("error") || "");

  async function signIn(event) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigate("/dashboard");
    } catch (authError) { setError(authError.message || "Sign in failed. Please try again."); }
    finally { setLoading(false); }
  }

  async function googleSignIn() {
    setError(""); setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
      if (authError) throw authError;
    } catch (authError) { setError(authError.message || "Could not start Google sign in."); setLoading(false); }
  }

  return <div className="auth-page"><div className="auth-visual"><div><Brand light /><p className="section-label">YOUR WORK, IN CONTEXT</p><h2>A record you can<br />stand behind.</h2><p>Return to your business profile, record completed work, and request a customer response.</p></div><span>Vouch account</span></div><main className="auth-main"><div className="auth-top"><Brand /><Link to="/">Back to home</Link></div><div className="auth-form-wrap"><p className="section-label">WELCOME BACK</p><h1>Sign in to Vouch</h1><p>Manage your profile and completed-work records.</p>{error && <div role="alert" className="app-alert auth-error">{error}</div>}<form onSubmit={signIn} className="auth-form"><label className="app-field">Email<input className="app-input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="app-field">Password<input className="app-input" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label><button className="app-button" disabled={loading} type="submit">{loading ? "Signing in..." : "Sign in"}<ArrowRight size={16} /></button></form><div className="auth-divider"><span>or</span></div><button className="app-button app-button-secondary auth-google" type="button" disabled={loading} onClick={googleSignIn}>Continue with Google</button><p className="auth-switch">New to Vouch? <Link to="/signup">Create an account</Link></p></div></main></div>;
}
