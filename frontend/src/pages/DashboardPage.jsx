import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ScoreCard from "../components/ScoreCard";
import TransactionFeed from "../components/TransactionFeed";
import LoanUnlock from "../components/LoanUnlock";

const SIMULATE_URL = "http://localhost:3000/api/v1/simulate"; // swap when Emmanuel deploys

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

function generateTransaction() {
  const sender = MOCK_TRADERS[Math.floor(Math.random() * MOCK_TRADERS.length)];
  const isRepeat = Math.random() > 0.5;
  const points = isRepeat ? 13 : 7;
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
  const [score, setScore] = useState(142);
  const [transactions, setTransactions] = useState([]);
  const [loanAccepted, setLoanAccepted] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const tierInfo = getTier(score);
  const prevTierInfo = getTier(score - 1);
  const justUnlocked = tierInfo.tier > prevTierInfo.tier;

  const simulate = useCallback(async () => {
    if (simulating) return;
    setSimulating(true);

    // Try real endpoint first, fall back to mock
    try {
      await fetch(SIMULATE_URL, { method: "POST" });
    } catch {
      // Backend not ready yet — use mock
    }

    // Fire 8 transactions with 400ms gap
    for (let i = 0; i < 8; i++) {
      await new Promise((r) => setTimeout(r, 400));
      const tx = generateTransaction();
      setTransactions((prev) => [tx, ...prev].slice(0, 20));
      setScore((prev) => Math.min(1000, prev + tx.points));
    }

    setSimulating(false);
  }, [simulating]);

  // Secret keyboard shortcut — Shift+S
  useEffect(() => {
    const handleKey = (e) => {
      if (e.shiftKey && e.key === "S") simulate();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [simulate]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top nav */}
      <nav className="bg-white border-b border-[#E8DDE0] px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="font-['Syne'] font-bold text-xl text-[#1A0A0D]">
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-['Syne'] font-bold text-3xl text-[#1A0A0D] mb-1">
            Good morning, Mama Ngozi 👋
          </h1>
          <p className="font-['Inter'] text-sm text-[#8A6B70]">
            Balogun Fabric Store · Squad Virtual Account Active
          </p>
        </div>

        {/* Loan unlock banner */}
        {tierInfo.limit > 0 && (
          <LoanUnlock
            limit={tierInfo.limit}
            tier={tierInfo.tier}
            tierLabel={tierInfo.label}
            accepted={loanAccepted}
            onAccept={() => setLoanAccepted(true)}
          />
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ScoreCard score={score} tier={tierInfo} simulating={simulating} />
          <TransactionFeed transactions={transactions} />
        </div>

        {/* Secret simulate button — small, hidden in corner */}
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2">
          <p className="font-['Inter'] text-xs text-[#8A6B70] opacity-50">
            Press Shift+S to simulate
          </p>
          <button
            onClick={simulate}
            disabled={simulating}
            className="w-3 h-3 rounded-full bg-[#A84551] opacity-20 hover:opacity-100 transition-opacity cursor-pointer border-none"
          />
        </div>
      </div>
    </div>
  );
}
