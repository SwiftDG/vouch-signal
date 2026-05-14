import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";
import ScoreCard from "../components/ScoreCard";
import TransactionFeed from "../components/TransactionFeed";
import LoanUnlock from "../components/LoanUnlock";
import AnimatedBackground from "../components/AnimatedBackground";

const SIMULATE_URL = "http://localhost:3000/api/v1/simulate";

const MOCK_TRADERS = [
  { name: "Chidi Okafor", amount: 3500 },
  { name: "Fatima Bello", amount: 7200 },
  { name: "Emeka Eze", amount: 1800 },
  { name: "Aisha Musa", amount: 12000 },
  { name: "Taiwo Adeleke", amount: 4500 },
  { name: "Ngozi Obi", amount: 9800 },
  { name: "Kunle Adeyemi", amount: 2300 },
  { name: "Blessing Nwosu", amount: 6700 },
];

function getTier(score) {
  if (score >= 800)
    return { tier: 4, label: "Enterprise", limit: 500000, next: null };
  if (score >= 600)
    return { tier: 3, label: "Inventory", limit: 150000, next: 800 };
  if (score >= 400)
    return { tier: 2, label: "Microloan", limit: 50000, next: 600 };
  return { tier: 1, label: "Thin File", limit: 0, next: 400 };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loanAccepted, setLoanAccepted] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [tierFlash, setTierFlash] = useState(false);
  const seenSenders = useRef(new Set());
  const prevTierRef = useRef(1);

  const tierInfo = getTier(score);

  function generateTransaction() {
    const sender =
      MOCK_TRADERS[Math.floor(Math.random() * MOCK_TRADERS.length)];
    const isRepeat = seenSenders.current.has(sender.name);
    seenSenders.current.add(sender.name);
    const volumePoints = Math.min(Math.floor(sender.amount / 1000) * 2 + 5, 20);
    const consistencyPoints = Math.floor(Math.random() * 3) * 4 + 3;
    const diversityPoints = Math.min(seenSenders.current.size * 2, 10);
    const points = volumePoints + consistencyPoints + diversityPoints;
    return {
      id: Date.now() + Math.random(),
      sender: sender.name,
      amount: sender.amount + Math.floor(Math.random() * 1000),
      points,
      isRepeat,
      timestamp: new Date(),
      status: "verified",
    };
  }

  useEffect(() => {
    const currentTier = getTier(score).tier;
    if (currentTier > prevTierRef.current) {
      prevTierRef.current = currentTier;
      setTierFlash(true);
      setTimeout(() => setTierFlash(false), 3000);
    }
  }, [score]);

  const simulate = useCallback(async () => {
    if (simulating) return;
    setSimulating(true);
    setLoanAccepted(false);
    seenSenders.current.clear();

    try {
      await fetch(SIMULATE_URL, { method: "POST" });
    } catch {
      // Backend not ready — using mock
    }

    for (let i = 0; i < 8; i++) {
      await new Promise((r) => setTimeout(r, 400));
      const tx = generateTransaction();
      setTransactions((prev) => [tx, ...prev].slice(0, 20));
      setScore((prev) => Math.min(1000, prev + tx.points));
    }

    setSimulating(false);
  }, [simulating]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.shiftKey && e.key === "S") simulate();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [simulate]);

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className="relative z-10">
        <nav className="bg-white/80 backdrop-blur-md border-b border-[#E8DDE0] px-6 md:px-12 py-4 flex items-center justify-between">
          <div
            onClick={() => (window.location.href = "/")}
            className="font-['Syne'] font-bold text-xl text-[#1A0A0D] cursor-pointer"
          >
            Vouch<span className="text-[#A84551]">Signal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#A84551] flex items-center justify-center">
                <span className="font-['Inter'] text-xs text-white font-bold">
                  MN
                </span>
              </div>
              <span className="font-['Inter'] text-sm text-[#1A0A0D] hidden md:block">
                Mama Ngozi
              </span>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="font-['Inter'] text-xs text-[#8A6B70] hover:text-[#A84551] transition-colors cursor-pointer border-none bg-transparent"
            >
              Sign out
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
          <div className="mb-8">
            <h1 className="font-['Syne'] font-bold text-3xl text-[#1A0A0D] mb-1">
              Good morning, Mama Ngozi 👋
            </h1>
            <p className="font-['Inter'] text-sm text-[#8A6B70]">
              Balogun Fabric Store · Squad Virtual Account Active
            </p>
          </div>

          <AnimatePresence>
            {tierFlash && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="bg-[#A84551] text-white px-6 py-3 mb-4 flex items-center gap-3"
              >
                <TrendingUp size={18} />
                <span className="font-['Inter'] font-semibold text-sm">
                  Tier upgrade! You've reached {tierInfo.label} — new credit
                  limit unlocked.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {tierInfo.limit > 0 && (
            <LoanUnlock
              limit={tierInfo.limit}
              tier={tierInfo.tier}
              tierLabel={tierInfo.label}
              accepted={loanAccepted}
              onAccept={() => setLoanAccepted(true)}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ScoreCard score={score} tier={tierInfo} simulating={simulating} />
            <TransactionFeed transactions={transactions} />
          </div>
        </div>

        <div className="fixed bottom-6 right-6">
          <button
            onClick={simulate}
            disabled={simulating}
            className="w-3 h-3 rounded-full bg-[#A84551] opacity-0 hover:opacity-30 transition-opacity cursor-pointer border-none"
          />
        </div>
      </div>
    </div>
  );
}
