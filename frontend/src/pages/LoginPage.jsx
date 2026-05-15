import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AnimatedBackground from "../components/AnimatedBackground";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          window.location.hostname === "localhost"
            ? "http://localhost:5173/dashboard"
            : "https://vouchsignal.vercel.app/dashboard",
      },
    });
  };

  const handleSignIn = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <AnimatedBackground />

      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,69,81,0.12) 0%, transparent 70%)",
          top: -80,
          right: -80,
        }}
        animate={{
          x: [0, -20, 10, 0],
          y: [0, 20, -10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(196,96,110,0.1) 0%, transparent 70%)",
          bottom: -40,
          left: -40,
        }}
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -20, 10, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 10,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5 mt-5"
        >
          <div className="font-['Bricolage_Grotesque'] font-bold text-3xl text-[#1A0A0D] mb-2">
            Vou<span className="text-[#A84551]">ch</span>
          </div>
          <p className="font-['Inter'] text-sm text-[#8A6B70]">
            Trust infrastructure for Nigeria's informal economy
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white border border-[#E8DDE0] p-8 shadow-sm"
        >
          <h1 className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#1A0A0D] mb-2">
            Welcome back
          </h1>
          <p className="font-['Inter'] text-sm text-[#8A6B70] mb-8">
            Sign in to your Vouch account
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 font-['Inter'] text-xs p-3 mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] block mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="trader@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E8DDE0] px-4 py-3 font-['Inter'] text-sm text-[#1A0A0D] outline-none focus:border-[#A84551] transition-colors bg-white"
            />
          </div>

          <div className="mb-6">
            <label className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] block mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E8DDE0] px-4 py-3 font-['Inter'] text-sm text-[#1A0A0D] outline-none focus:border-[#A84551] transition-colors bg-white"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#8B3541" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignIn}
            disabled={loading}
            className="w-full py-4 bg-[#A84551] text-white font-['Inter'] font-semibold text-sm border-none cursor-pointer transition-colors mb-4 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>

          <motion.button
            onClick={handleGoogleSignIn}
            whileHover={{ scale: 1.02, borderColor: "#A84551" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-white text-[#1A0A0D] font-['Inter'] font-semibold text-sm border border-[#E8DDE0] cursor-pointer transition-colors flex items-center justify-center gap-3 mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </motion.button>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-[#E8DDE0]" />
            <span className="font-['Inter'] text-xs text-[#8A6B70]">or</span>
            <div className="flex-1 h-px bg-[#E8DDE0]" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard")}
            className="w-full py-4 bg-[#1A0A0D] text-white font-['Inter'] font-bold text-sm border-none cursor-pointer transition-colors flex items-center justify-center gap-3"
          >
            <span className="text-lg">🛍️</span>
            Log in as Mama Ngozi (Demo)
          </motion.button>

          <p className="font-['Inter'] text-xs text-[#8A6B70] text-center mt-4">
            Demo mode: no OTP required. For live pitch use only.
          </p>

          <p className="font-['Inter'] text-xs text-[#8A6B70] text-center mt-6">
            Don't have an account?{" "}
            <a href="/signup" className="text-[#A84551] hover:underline">
              Sign up free
            </a>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <a
            href="/"
            className="font-['Inter'] text-xs text-[#8A6B70] hover:text-[#A84551] transition-colors no-underline"
          >
            ← Back to home
          </a>
        </motion.div>
      </div>
    </div>
  );
}
