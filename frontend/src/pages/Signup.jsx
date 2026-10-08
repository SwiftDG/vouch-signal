import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import Brand from "../components/Brand";

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: "", businessName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function field(name) { return { value: form[name], onChange: (event) => setForm((current) => ({ ...current, [name]: event.target.value })) }; }

  async function signUp(event) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.fullName, business_name: form.businessName }, emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (authError) throw authError;
      setConfirmed(true);
    } catch (authError) { setError(authError.message || "Could not create your account."); }
    finally { setLoading(false); }
  }

  async function googleSignIn() {
    setError(""); setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
      if (authError) throw authError;
    } catch (authError) { setError(authError.message || "Could not start Google sign in."); setLoading(false); }
  }

  return <div className="auth-page"><div className="auth-visual"><div><Brand light /><p className="section-label">START WITH YOUR STORY</p><h2>Good work deserves<br />a clearer record.</h2><p>Create a business profile, then add completed work and invite a customer to respond.</p></div><span>Vouch account</span></div><main className="auth-main"><div className="auth-top"><Brand /><Link to="/">Back to home</Link></div><div className="auth-form-wrap"><p className="section-label">GET STARTED</p><h1>Create your account</h1><p>Your public profile is created in the next step. Nothing is confirmed just by signing up.</p>{confirmed ? <div role="status" className="app-alert app-success auth-error">Check your email for a confirmation link before signing in. <Link to="/login">Go to sign in</Link></div> : <>{error && <div role="alert" className="app-alert auth-error">{error}</div>}<form onSubmit={signUp} className="auth-form"><label className="app-field">Your name<input className="app-input" autoComplete="name" required maxLength={100} {...field("fullName")} /></label><label className="app-field">Business name<input className="app-input" autoComplete="organization" required maxLength={100} {...field("businessName")} /></label><label className="app-field">Email<input className="app-input" type="email" autoComplete="email" required {...field("email")} /></label><label className="app-field">Password<input className="app-input" type="password" autoComplete="new-password" required minLength={6} {...field("password")} /></label><button className="app-button" disabled={loading} type="submit">{loading ? "Creating account..." : "Create account"}<ArrowRight size={16} /></button></form><div className="auth-divider"><span>or</span></div><button className="app-button app-button-secondary auth-google" type="button" disabled={loading} onClick={googleSignIn}>Continue with Google</button></>}<p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></div></main></div>;
}
