import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div
            onClick={() => (window.location.href = "/")}
            className="font-['Bricolage_Grotesque'] font-bold text-3xl text-[#1A0A0D] mb-2 cursor-pointer inline-block"
          >
            Vouch<span className="text-[#A84551]">Signal</span>
          </div>
          <p className="font-['Inter'] text-sm text-[#8A6B70]">
            Build your financial identity — one transaction at a time
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white border border-[#E8DDE0] p-8 shadow-sm"
        >
          <h1 className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#1A0A0D] mb-2">
            Create your account
          </h1>
          <p className="font-['Inter'] text-sm text-[#8A6B70] mb-8">
            Start building your Market Reputation Score today
          </p>

          <div className="mb-4">
            <label className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] block mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Mama Ngozi"
              className="w-full border border-[#E8DDE0] px-4 py-3 font-['Inter'] text-sm text-[#1A0A0D] outline-none focus:border-[#A84551] transition-colors bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] block mb-2">
              Business Name
            </label>
            <input
              type="text"
              placeholder="Balogun Fabric Store"
              className="w-full border border-[#E8DDE0] px-4 py-3 font-['Inter'] text-sm text-[#1A0A0D] outline-none focus:border-[#A84551] transition-colors bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] block mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="trader@example.com"
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
              className="w-full border border-[#E8DDE0] px-4 py-3 font-['Inter'] text-sm text-[#1A0A0D] outline-none focus:border-[#A84551] transition-colors bg-white"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#8B3541" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-[#A84551] text-white font-['Inter'] font-semibold text-sm border-none cursor-pointer transition-colors mb-4"
          >
            Create Account →
          </motion.button>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-[#E8DDE0]" />
            <span className="font-['Inter'] text-xs text-[#8A6B70]">or</span>
            <div className="flex-1 h-px bg-[#E8DDE0]" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, borderColor: "#A84551" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-white text-[#1A0A0D] font-['Inter'] font-semibold text-sm border border-[#E8DDE0] cursor-pointer transition-colors flex items-center justify-center gap-3"
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
            Sign up with Google
          </motion.button>

          <p className="font-['Inter'] text-xs text-[#8A6B70] text-center mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-[#A84551] hover:underline">
              Sign in
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
