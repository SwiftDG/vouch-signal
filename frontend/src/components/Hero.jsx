import { motion, useAnimationFrame } from "framer-motion";
import { useRef } from "react";
import { supabase } from "../lib/supabase";
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #ffffff 0%, #ffffff 45%, rgba(168,69,81,0.15) 65%, rgba(196,96,110,0.25) 80%, rgba(255,182,193,0.3) 100%)",
            "linear-gradient(135deg, #ffffff 0%, #ffffff 40%, rgba(196,96,110,0.2) 60%, rgba(168,69,81,0.3) 75%, rgba(255,150,170,0.25) 100%)",
            "linear-gradient(135deg, #ffffff 0%, #ffffff 50%, rgba(168,69,81,0.12) 68%, rgba(220,100,120,0.28) 85%, rgba(255,182,193,0.2) 100%)",
            "linear-gradient(135deg, #ffffff 0%, #ffffff 45%, rgba(168,69,81,0.15) 65%, rgba(196,96,110,0.25) 80%, rgba(255,182,193,0.3) 100%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero() {
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
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-32 pb-20 overflow-hidden bg-white">
      <AnimatedBackground />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.h1
            variants={fadeUp}
            className="font-['Bricolage_Grotesque'] font-extrabold text-5xl md:text-7xl text-[#1A0A0D] leading-tight mb-6"
          >
            Your business
            <br />
            <span className="text-[#A84551]">deserves</span> credit.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-['Inter'] text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-xl mb-10"
          >
            Mama Ngozi has sold fabric in Balogun for 15 years. The bank still
            says no. Vouch turns every Squad transaction into a financial
            identity — unlocking loans and credit for Nigeria's 40M+ invisible
            traders.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#8B3541" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => (window.location.href = "/signup")}
              className="font-['Inter'] font-semibold text-sm px-8 py-4 bg-[#A84551] text-white border-none cursor-pointer rounded-md transition-colors"
            >
              Get Started →
            </motion.button>
            <motion.button
              onClick={handleGoogleSignIn}
              whileHover={{
                scale: 1.03,
                borderColor: "#A84551",
                color: "#A84551",
              }}
              whileTap={{ scale: 0.97 }}
              className="font-['Inter'] font-semibold text-sm px-8 py-4 bg-white text-[#1A0A0D] border border-[#E8DDE0] cursor-pointer rounded-md transition-colors flex items-center gap-2"
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
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-20 pt-8 border-t border-[#E8DDE0]"
          >
            <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] mb-6">
              Powered by
            </p>
            <div className="flex flex-wrap items-center gap-8 opacity-40">
              {["Squad", "GTCo", "HabariPay", "Supabase", "Railway"].map(
                (brand) => (
                  <span
                    key={brand}
                    className="font-['Bricolage_Grotesque'] font-bold text-lg text-[#1A0A0D]"
                  >
                    {brand}
                  </span>
                ),
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
