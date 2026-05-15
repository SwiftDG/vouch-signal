import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";
import ScoreCard from "../components/ScoreCard";
import TransactionFeed from "../components/TransactionFeed";
import LoanUnlock from "../components/LoanUnlock";
import AnimatedBackground from "../components/AnimatedBackground";

const API =
  import.meta.env.VITE_API_BASE_URL || "https://vouch-w5z1.onrender.com/api/v1";

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
    return { tier: 4, label: "Gold", limit: 500000, next: null };
  if (score >= 600)
    return { tier: 3, label: "Silver", limit: 150000, next: 800 };
  if (score >= 400)
    return { tier: 2, label: "Bronze", limit: 50000, next: 600 };
  return { tier: 1, label: "Probation", limit: 0, next: 400 };
}

async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {};
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loanAccepted, setLoanAccepted] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [tierFlash, setTierFlash] = useState(false);
  const [user, setUser] = useState(null);
  const [traderId, setTraderId] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const seenSenders = useRef(new Set());
  const prevTierRef = useRef(1);
  const sseRef = useRef(null);
  const currentScoreRef = useRef(0);

  const tierInfo = getTier(score);

  useEffect(() => {
    currentScoreRef.current = score;
  }, [score]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsDemo(false);
        fetchTraderData(session.access_token);
      } else {
        setIsDemo(true);
        setUser(null);
      }
    });
  }, []);

  const fetchTraderData = async (token) => {
    try {
      const res = await fetch(`${API}/traders/score`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.data) {
        setScore(data.data.currentScore || 0);
        setTraderId(data.data.traderId);
        connectSSE(token);
        fetchTransactions(token);
      }
    } catch {
      // Backend unavailable — stay on mock
    }
  };

  const connectSSE = (token) => {
    if (sseRef.current) sseRef.current.close();
    const es = new EventSource(`${API}/traders/score/stream`);
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.currentScore !== undefined) {
          setScore(data.currentScore);
        }
      } catch {}
    };
    es.onerror = () => es.close();
    sseRef.current = es;
  };

  const fetchTransactions = async (token) => {
    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : await getAuthHeader();
      const res = await fetch(`${API}/traders/transactions`, { headers });
      const data = await res.json();
      if (data?.data?.transactions) {
        const mapped = data.data.transactions.map((tx) => ({
          id: tx.id,
          sender: tx.senderAccount || "Unknown",
          amount: tx.amount,
          points: 0,
          isRepeat: false,
          timestamp: new Date(tx.timestamp),
          status: "verified",
        }));
        setTransactions(mapped);
      }
    } catch {}
  };

  useEffect(() => {
    return () => {
      if (sseRef.current) sseRef.current.close();
    };
  }, []);

  const displayName =
    user?.user_metadata?.full_name || user?.email || "Mama Ngozi";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function generateMockTransaction() {
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

    if (traderId) {
      try {
        const headers = await getAuthHeader();
        const res = await fetch(`${API}/debug/simulate-history`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ traderId }),
        });
        const data = await res.json();
        if (data?.trader?.currentScore) {
          const targetScore = data.trader.currentScore;
          const currentScore = currentScoreRef.current;
          const steps = 8;
          const increment = Math.max(
            Math.floor((targetScore - currentScore) / steps),
            1,
          );
          for (let i = 0; i < steps; i++) {
            await new Promise((r) => setTimeout(r, 400));
            const tx = generateMockTransaction();
            setTransactions((prev) => [tx, ...prev].slice(0, 20));
            setScore((prev) =>
              i === steps - 1
                ? targetScore
                : Math.min(prev + increment, targetScore),
            );
          }
          setSimulating(false);
          return;
        }
      } catch {}
    }

    // Fall back to mock
    for (let i = 0; i < 8; i++) {
      await new Promise((r) => setTimeout(r, 400));
      const tx = generateMockTransaction();
      setTransactions((prev) => [tx, ...prev].slice(0, 20));
      setScore((prev) => Math.min(1000, prev + tx.points));
    }
    setSimulating(false);
  }, [simulating, traderId]);

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
            className="font-['Bricolage_Grotesque'] font-bold text-xl text-[#1A0A0D] cursor-pointer"
          >
            Vou<span className="text-[#A84551]">ch</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#A84551] flex items-center justify-center">
                <span className="font-['Inter'] text-xs text-white font-bold">
                  {initials}
                </span>
              </div>
              <span className="font-['Inter'] text-sm text-[#1A0A0D] hidden md:block">
                {displayName}
              </span>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/login");
              }}
              className="font-['Inter'] text-xs text-[#8A6B70] hover:text-[#A84551] transition-colors cursor-pointer border-none bg-transparent"
            >
              Sign out
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
          <div className="mb-8">
            <h1 className="font-['Bricolage_Grotesque'] font-bold text-3xl text-[#1A0A0D] mb-1">
              Good morning, {displayName.split(" ")[0]} 👋
            </h1>
            <p className="font-['Inter'] text-sm text-[#8A6B70]">
              {isDemo ? "Demo Mode · " : ""}Squad Virtual Account Active
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
              traderId={traderId}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ScoreCard
              score={score}
              tier={tierInfo}
              simulating={simulating}
              transactions={transactions}
              userName={displayName}
              onSimulate={simulate}
            />
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
