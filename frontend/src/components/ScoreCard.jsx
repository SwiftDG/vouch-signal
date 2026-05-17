import { motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const prevValue = useRef(value);

  useEffect(() => {
    const from = prevValue.current;
    const to = value;
    prevValue.current = value;
    const controls = animate(from, to, {
      duration: 0.6,
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
  { min: 0, max: 399, label: "Probation", color: "#8A6B70", limit: "₦0" },
  { min: 400, max: 599, label: "Bronze", color: "#E8A838", limit: "₦50,000" },
  { min: 600, max: 799, label: "Silver", color: "#4A90D9", limit: "₦150,000" },
  { min: 800, max: 1000, label: "Gold", color: "#A84551", limit: "₦500,000" },
];

export default function ScoreCard({
  score,
  tier,
  simulating,
  transactions = [],
  userName = "Trader",
  onSimulate,
  outstandingBalance = 0,
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const currentTier =
    TIERS.find((t) => score >= t.min && score <= t.max) || TIERS[0];

  const progress = tier.next
    ? ((score -
        (tier.tier === 1
          ? 0
          : tier.tier === 2
            ? 400
            : tier.tier === 3
              ? 600
              : 800)) /
        (tier.next -
          (tier.tier === 1
            ? 0
            : tier.tier === 2
              ? 400
              : tier.tier === 3
                ? 600
                : 800))) *
      100
    : 100;

  const repeatCount = transactions.filter((tx) => tx.isRepeat).length;
  const newCount = transactions.filter((tx) => !tx.isRepeat).length;
  const isNew = score === 0;

  const availableCredit = Math.max(
    0,
    tierInfo_limit(tier) - outstandingBalance,
  );

  function tierInfo_limit(tier) {
    if (tier.tier === 4) return 500000;
    if (tier.tier === 3) return 150000;
    if (tier.tier === 2) return 50000;
    return 0;
  }

  const handleScoreTap = (e) => {
    e.preventDefault();
    e.stopPropagation();
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 500);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      if (onSimulate) onSimulate();
    }
  };

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
            {userName} · Balogun Fabric Store
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

      {isNew ? (
        <div className="py-8 text-center">
          <p className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#1A0A0D] mb-2">
            Welcome, {userName}! 🎉
          </p>
          <p className="font-['Inter'] text-sm text-[#8A6B70] max-w-xs mx-auto leading-relaxed">
            Your Market Reputation Score starts building the moment your first
            Squad payment arrives. Every transaction counts.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-[#A84551]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <p className="font-['Inter'] text-xs text-[#8A6B70]">
              Waiting for first transaction...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div onTouchStart={handleScoreTap} className="relative">
            <button
              onClick={() => setShowBreakdown((prev) => !prev)}
              className="w-full text-left border-none bg-transparent cursor-pointer p-0"
            >
              <div className="flex items-end gap-4 mb-2">
                <motion.div
                  className="font-['Bricolage_Grotesque'] font-extrabold leading-none"
                  style={{ fontSize: "96px", color: "#A84551" }}
                  animate={{ scale: simulating ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatedNumber value={score} />
                </motion.div>
                <div className="pb-3 flex items-center gap-2">
                  <p className="font-['Inter'] text-xs text-[#8A6B70]">
                    / 1,000
                  </p>
                  {showBreakdown ? (
                    <ChevronUp size={14} className="text-[#8A6B70]" />
                  ) : (
                    <ChevronDown size={14} className="text-[#8A6B70]" />
                  )}
                </div>
              </div>
              <p className="font-['Inter'] text-xs text-[#8A6B70] mb-4">
                Click to {showBreakdown ? "hide" : "see"} score breakdown
              </p>
            </button>
          </div>

          <motion.div
            initial={false}
            animate={{
              height: showBreakdown ? "auto" : 0,
              opacity: showBreakdown ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-[#FAFAFA] border border-[#E8DDE0] p-4 mb-6 space-y-3">
              <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] mb-3">
                Score Breakdown
              </p>
              {/* Variable A */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-['Inter'] text-xs font-semibold text-[#1A0A0D]">
                    Account Age
                  </span>
                  <p className="font-['Inter'] text-xs text-[#8A6B70]">
                    +12 pts/active month (max 150)
                  </p>
                </div>
                <span className="font-['Inter'] text-xs font-bold text-[#A84551]">
                  +12
                </span>
              </div>
              <div className="h-px bg-[#E8DDE0]" />
              {/* Variable B */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-['Inter'] text-xs font-semibold text-[#1A0A0D]">
                    Daily Consistency
                  </span>
                  <p className="font-['Inter'] text-xs text-[#8A6B70]">
                    +3 pts/unique sender/day, max 15/day (max 300)
                  </p>
                </div>
                <span className="font-['Inter'] text-xs font-bold text-[#A84551]">
                  +
                  {Math.min(
                    transactions.filter((tx) => !tx.isRepeat).length * 3,
                    300,
                  )}
                </span>
              </div>
              <div className="h-px bg-[#E8DDE0]" />
              {/* Variable C */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-['Inter'] text-xs font-semibold text-[#1A0A0D]">
                    Network Retention
                  </span>
                  <p className="font-['Inter'] text-xs text-[#8A6B70]">
                    Repeat +13pts · New +7pts (max 250)
                  </p>
                </div>
                <span className="font-['Inter'] text-xs font-bold text-[#A84551]">
                  +{Math.min(repeatCount * 13 + newCount * 7, 250)}
                </span>
              </div>
              <div className="h-px bg-[#E8DDE0]" />
              {/* Variable D */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-['Inter'] text-xs font-semibold text-[#1A0A0D]">
                    Volume Scaling
                  </span>
                  <p className="font-['Inter'] text-xs text-[#8A6B70]">
                    {transactions.reduce((s, tx) => s + tx.amount, 0) > 0
                      ? `₦${transactions.reduce((s, tx) => s + tx.amount, 0).toLocaleString()} processed`
                      : "No volume yet"}
                  </p>
                </div>
                <span className="font-['Inter'] text-xs font-bold text-[#A84551]">
                  +
                  {Math.min(
                    transactions.reduce(
                      (s, tx) =>
                        s +
                        Math.min(
                          Math.floor((tx.amount || 0) / 1000) * 2 + 5,
                          20,
                        ),
                      0,
                    ),
                    300,
                  )}
                </span>
              </div>
              <div className="h-px bg-[#E8DDE0]" />
              <div className="flex justify-between pt-1">
                <span className="font-['Inter'] text-xs font-semibold text-[#1A0A0D]">
                  Total Score
                </span>
                <span className="font-['Inter'] text-xs font-bold text-[#A84551]">
                  {score}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="mb-2 flex justify-between">
            <span className="font-['Inter'] text-xs text-[#8A6B70]">
              {tier.next
                ? `Next tier at ${tier.next} pts`
                : "Maximum tier reached"}
            </span>
            <span className="font-['Inter'] text-xs text-[#A84551]">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
          <div className="h-1.5 bg-[#E8DDE0] rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-[#A84551] rounded-full"
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {/* Credit limit + balance */}
          <div className="border-t border-[#E8DDE0] pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] mb-2">
                  Credit Limit
                </p>
                <p className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#1A0A0D]">
                  {currentTier.limit}
                </p>
              </div>
              <div>
                <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] mb-2">
                  Available Credit
                </p>
                <p className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#A84551]">
                  ₦{availableCredit.toLocaleString()}
                </p>
              </div>
            </div>
            {outstandingBalance > 0 && (
              <div className="mt-3 bg-amber-50 border border-amber-200 px-3 py-2 flex justify-between items-center">
                <span className="font-['Inter'] text-xs text-amber-700">
                  Outstanding balance
                </span>
                <span className="font-['Inter'] text-xs font-bold text-amber-700">
                  ₦{outstandingBalance.toLocaleString()}
                </span>
              </div>
            )}
            <p className="font-['Inter'] text-xs text-[#8A6B70] mt-2">
              {score < 400
                ? `${400 - score} more points to unlock ₦50,000`
                : "Active — apply for a loan below"}
            </p>
          </div>
        </>
      )}

      {simulating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 flex items-center gap-2"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <span className="font-['Inter'] text-xs text-green-500 font-semibold">
            updating...
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
