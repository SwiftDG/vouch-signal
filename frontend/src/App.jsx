import { useState, useEffect } from "react";
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
import { supabase } from "./lib/supabase";
import V2Page from "./pages/V2Page";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription.unsubscribe();
        navigate("/dashboard");
      } else if (event === "SIGNED_OUT") {
        subscription.unsubscribe();
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
        <Route path="*" element={<PageNotFound />} />
        <Route path="/v2" element={<V2Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
