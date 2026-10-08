import { useEffect } from "react";
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
import LoanPage from "./pages/LoanPage";
import PageNotFound from "./pages/PageNotFound";
import JobsPage from "./pages/JobsPage";
import AjoPage from "./pages/AjoPage";
import V2Page from "./pages/V2Page";
import { supabase } from "./lib/supabase";

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    async function completeAuthentication() {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (tokenHash && type === "email") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "email",
        });

        if (cancelled) return;

        if (error) {
          console.error("Email confirmation failed:", error);
          navigate(`/login?error=${encodeURIComponent(error.message)}`, {
            replace: true,
          });
          return;
        }

        navigate("/dashboard", { replace: true });
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      navigate(session ? "/dashboard" : "/login", { replace: true });
    }

    completeAuthentication();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="font-['Inter'] text-sm text-[#8A6B70]">
        Confirming your account...
      </p>
    </div>
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
        <Route path="/loan" element={<LoanPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/v2" element={<V2Page />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/ajo" element={<AjoPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
