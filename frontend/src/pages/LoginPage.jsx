import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background blobs */}
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
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="font-['Syne'] font-bold text-3xl text-[#1A0A0D] mb-2">
            Vouch<span className="text-[#A84551]">Signal</span>
          </div>
          <p className="font-['Inter'] text-sm text-[#8A6B70]">
            Trust infrastructure for Nigeria's informal economy
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white border border-[#E8DDE0] p-8 shadow-sm"
        >
          <h1 className="font-['Syne'] font-bold text-2xl text-[#1A0A0D] mb-2">
            Welcome back
          </h1>
          <p className="font-['Inter'] text-sm text-[#8A6B70] mb-8">
            Sign in to your Vouch Signal account
          </p>

          {/* Email input */}
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

          {/* Password input */}
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

          {/* Sign in button */}
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#8B3541" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-[#A84551] text-white font-['Inter'] font-semibold text-sm border-none cursor-pointer transition-colors mb-4"
          >
            Sign In
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-[#E8DDE0]" />
            <span className="font-['Inter'] text-xs text-[#8A6B70]">or</span>
            <div className="flex-1 h-px bg-[#E8DDE0]" />
          </div>

          {/* Demo bypass — the real button */}
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
            Demo mode — no OTP required. For live pitch use only.
          </p>
        </motion.div>

        {/* Back to home */}
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
