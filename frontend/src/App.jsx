import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import PublicProfilePage from "./pages/PublicProfilePage";
import ConfirmationPage from "./pages/ConfirmationPage";
import { supabase } from "./lib/supabase";
import Brand from "./components/Brand";
import TransactionDemoPage from "./pages/TransactionDemoPage";

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function completeAuthentication() {
      try {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (tokenHash && type === "email") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "email",
        });

        if (cancelled) return;

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        navigate("/dashboard", { replace: true });
        return;
      }

      const { data: { session }, error } = await supabase.auth.getSession();

      if (cancelled) return;

      if (error) throw error;
      if (searchParams.get("error_description")) { setErrorMessage(searchParams.get("error_description")); return; }
      navigate(session ? "/dashboard" : "/login", { replace: true });
      } catch (error) { if (!cancelled) setErrorMessage(error.message || "Could not complete sign in."); }
    }

    completeAuthentication();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  return (
    <div className="app-page"><header className="app-header"><div className="app-header-inner"><Brand /></div></header><main className="app-main"><section className="app-panel app-panel-padding" aria-live="polite">{errorMessage ? <><h1 className="app-title">We could not confirm your account.</h1><p className="app-alert" role="alert">{errorMessage}</p><a className="app-button" href="/login">Return to sign in</a></> : <><h1 className="app-title">Confirming your account</h1><div className="skeleton" style={{ height: 28, width: "min(100%, 340px)" }} role="status" aria-label="Confirming your account" /></>}</section></main></div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/demo" element={<TransactionDemoPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/example/amara-cakes"
          element={<PublicProfilePage exampleMode />}
        />
        <Route path="/p/:slug" element={<PublicProfilePage />} />
        <Route path="/confirm/:token" element={<ConfirmationPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
