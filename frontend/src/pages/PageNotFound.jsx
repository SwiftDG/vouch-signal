import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(435deg, #ffffff 0%, #ffffff 45%, rgba(168,69,81,0.15) 65%, rgba(196,96,110,0.25) 80%, rgba(255,182,193,0.3) 100%)",
            "linear-gradient(135deg, #ffffff 0%, #ffffff 40%, rgba(196,96,110,0.2) 60%, rgba(168,69,81,0.3) 75%, rgba(255,150,170,0.25) 100%)",
            "linear-gradient(135deg, #ffffff 0%, #ffffff 50%, rgba(168,69,81,0.12) 68%, rgba(220,100,120,0.28) 85%, rgba(255,182,193,0.2) 100%)",
            "linear-gradient(135deg, #ffffff 0%, #ffffff 45%, rgba(168,69,81,0.15) 65%, rgba(196,96,110,0.25) 80%, rgba(255,182,193,0.3) 100%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 overflow-hidden bg-white">
      {/* Retains the identical soft fluid gradient layer */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-6xl mx-auto w-full text-left">
        <motion.div variants={container} initial="hidden" animate="visible">
          {/* Big Error Identifier Pill */}
          <motion.div
            variants={fadeUp}
            className="inline-block font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#A84551] bg-[#A84551]/10 px-3 py-1.5 rounded-full mb-6"
          >
            Error 404
          </motion.div>

          {/* Heading using Bricolage Grotesque */}
          <motion.h1
            variants={fadeUp}
            className="font-['Bricolage_Grotesque'] font-extrabold text-5xl md:text-7xl text-[#1A0A0D] leading-none mb-6 tracking-tight"
          >
            This path is <br />
            <span className="text-[#A84551]">invisible</span> to us.
          </motion.h1>

          {/* Body descriptive text keeping context thematic with Vouch */}
          <motion.p
            variants={fadeUp}
            className="font-['Inter'] text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-md mb-10"
          >
            Unlike Nigeria's hard-working unbanked merchants, this page doesn't
            have a record of history to vouch for it. Let's get you back on
            track.
          </motion.p>

          {/* Action Navigation Matrix */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#8B3541" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              className="font-['Inter'] font-semibold text-sm px-8 py-4 bg-[#A84551] text-white border-none cursor-pointer rounded-md transition-colors shadow-lg shadow-[#A84551]/10"
            >
              ← Back to Home
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.03,
                borderColor: "#A84551",
                color: "#A84551",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(-1)}
              className="font-['Inter'] font-semibold text-sm px-8 py-4 bg-white text-[#1A0A0D] border border-[#E8DDE0] cursor-pointer rounded-md transition-colors"
            >
              Go Previous Page
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
