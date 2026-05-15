import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Unlock, CheckCircle, Rocket, Diamond } from "lucide-react";

const TIER_LABELS = {
  2: {
    emoji: <Unlock />,
    title: "Microloan Unlocked!",
    desc: "Your consistency has earned you access to working capital.",
  },
  3: {
    emoji: <Rocket />,
    title: "Inventory Financing Unlocked!",
    desc: "Scale your business with larger inventory credit.",
  },
  4: {
    emoji: <Diamond />,
    title: "Enterprise Credit Unlocked!",
    desc: "Maximum credit access. You've built something real.",
  },
};

export default function LoanUnlock({
  limit,
  tier,
  tierLabel,
  accepted,
  onAccept,
}) {
  const [loading, setLoading] = useState(false);
  const info = TIER_LABELS[tier] || TIER_LABELS[2];

  const handleAccept = async () => {
    setLoading(true);
    // Will call Transfer API when Emmanuel ships endpoint
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    onAccept();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={`relative border p-6 mb-2 overflow-hidden ${
          accepted
            ? "bg-green-50 border-green-200"
            : "bg-[#A84551]/5 border-[#A84551]/20"
        }`}
      >
        {/* Animated background */}
        {!accepted && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#A84551]/5 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.span
              className="text-3xl"
              animate={accepted ? {} : { scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {accepted ? <CheckCircle /> : info.emoji}
            </motion.span>
            <div>
              <p className="font-['Bricolage_Grotesque'] font-bold text-lg text-[#1A0A0D]">
                {accepted ? "Loan Disbursed Successfully!" : info.title}
              </p>
              <p className="font-['Inter'] text-sm text-[#8A6B70]">
                {accepted
                  ? `₦${limit.toLocaleString()} has been sent to your Squad Virtual Account`
                  : info.desc}
              </p>
            </div>
          </div>

          {!accepted && (
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <p className="font-['Inter'] text-xs text-[#8A6B70]">
                  Available Credit
                </p>
                <p className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#A84551]">
                  ₦{limit.toLocaleString()}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAccept}
                disabled={loading}
                className="px-6 py-3 bg-[#A84551] text-white font-['Inter'] font-semibold text-sm border-none cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Disbursing...
                  </>
                ) : (
                  "Accept Loan →"
                )}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
