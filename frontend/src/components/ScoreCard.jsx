import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function AnimatedNumber({ value }) {
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v);
      },
    });
    return controls.stop;
  }, [value]);

  return <span ref={ref}>{value}</span>;
}

const TIERS = [
  { min: 0, max: 399, label: "Thin File", color: "#8A6B70", limit: "₦0" },
  {
    min: 400,
    max: 599,
    label: "Microloan",
    color: "#E8A838",
    limit: "₦50,000",
  },
  {
    min: 600,
    max: 799,
    label: "Inventory",
    color: "#4A90D9",
    limit: "₦150,000",
  },
  {
    min: 800,
    max: 1000,
    label: "Enterprise",
    color: "#A84551",
    limit: "₦500,000",
  },
];

export default function ScoreCard({ score, tier, simulating }) {
  const currentTier =
    TIERS.find((t) => score >= t.min && score <= t.max) || TIERS[0];
  const progress = tier.next
    ? ((score - (tier.tier === 1 ? 0 : tier.tier === 2 ? 400 : 600)) /
        (tier.next - (tier.tier === 1 ? 0 : tier.tier === 2 ? 400 : 600))) *
      100
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-white border border-[#E8DDE0] p-8"
    >
      <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-[#A84551]" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] mb-1">
            Market Reputation Score
          </p>
          <p className="font-['Inter'] text-sm font-semibold text-[#1A0A0D]">
            Mama Ngozi · Balogun Fabric Store
          </p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-['Inter'] font-semibold"
          style={{
            background: `${currentTier.color}15`,
            color: currentTier.color,
          }}
        >
          {currentTier.label}
        </div>
      </div>

      {/* Giant score */}
      <div className="flex items-end gap-4 mb-6">
        <motion.div
          className="font-['Syne'] font-extrabold leading-none"
          style={{ fontSize: "96px", color: "#A84551" }}
          animate={{ scale: simulating ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatedNumber value={score} />
        </motion.div>
        <div className="pb-3">
          <p className="font-['Inter'] text-xs text-[#8A6B70]">/ 1,000</p>
          {simulating && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-['Inter'] text-xs text-green-500 font-semibold"
            >
              ▲ updating...
            </motion.p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2 flex justify-between">
        <span className="font-['Inter'] text-xs text-[#8A6B70]">
          {tier.next ? `Next tier at ${tier.next} pts` : "Maximum tier reached"}
        </span>
        <span className="font-['Inter'] text-xs text-[#A84551]">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1.5 bg-[#E8DDE0] rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-[#A84551] rounded-full"
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Credit limit */}
      <div className="border-t border-[#E8DDE0] pt-6">
        <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] mb-3">
          Credit Limit
        </p>
        <p className="font-['Syne'] font-bold text-3xl text-[#1A0A0D]">
          {currentTier.limit}
        </p>
        <p className="font-['Inter'] text-xs text-[#8A6B70] mt-1">
          {score < 400
            ? `${400 - score} more points to unlock ₦50,000`
            : "Active — apply for a loan below"}
        </p>
      </div>
    </motion.div>
  );
}
