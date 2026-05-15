import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { supabase } from "../lib/supabase";

const API =
  import.meta.env.VITE_API_BASE_URL || "https://vouch-w5z1.onrender.com/api/v1";

export default function LoanPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const limit = state?.limit || 50000;
  const tierLabel = state?.tierLabel || "Bronze";
  const traderId = state?.traderId || null;
  const [amount, setAmount] = useState(Math.floor(limit / 2));
  const [repaymentType, setRepaymentType] = useState("sweep");
  const [loading, setLoading] = useState(false);
  const [disbursed, setDisbursed] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    setLoading(true);
    setError("");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token && traderId) {
        const res = await fetch(`${API}/loans/accept`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, traderId }),
        });
        const data = await res.json();
        if (data?.data?.disbursementStatus === "completed") {
          setLoading(false);
          setDisbursed(true);
          return;
        }
        if (data?.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
      }
    } catch {}
    // Fall back to mock disbursement
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setDisbursed(true);
  };

  if (disbursed) {
    return (
      <div className="relative min-h-screen bg-white flex items-center justify-center px-6">
        <AnimatedBackground />
        <div className="relative z-10 max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="font-['Bricolage_Grotesque'] font-bold text-3xl text-[#1A0A0D] mb-3">
              Loan Disbursed!
            </h1>
            <p className="font-['Inter'] text-sm text-[#8A6B70] mb-2">
              ₦{amount.toLocaleString()} has been sent to your Squad Virtual
              Account
            </p>
            <p className="font-['Inter'] text-xs text-[#8A6B70] mb-8">
              Repayment via{" "}
              {repaymentType === "sweep"
                ? "10% auto-sweep on incoming payments"
                : "bullet payment on the 30th"}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/dashboard")}
              className="font-['Inter'] font-semibold text-sm px-8 py-4 bg-[#A84551] text-white border-none cursor-pointer"
            >
              Back to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <AnimatedBackground />
      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div
            onClick={() => navigate("/dashboard")}
            className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#1A0A0D] cursor-pointer inline-block mb-2"
          >
            Vou<span className="text-[#A84551]">ch</span>
          </div>
          <p className="font-['Inter'] text-sm text-[#8A6B70]">
            {tierLabel} Tier — Loan Application
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-white border border-[#E8DDE0] p-8 shadow-sm"
        >
          <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-[#A84551]" />

          <div className="bg-[#FAFAFA] border border-[#E8DDE0] p-4 mb-6">
            <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] mb-1">
              Your Credit Limit
            </p>
            <p className="font-['Bricolage_Grotesque'] font-bold text-4xl text-[#A84551]">
              ₦{limit.toLocaleString()}
            </p>
            <p className="font-['Inter'] text-xs text-[#8A6B70] mt-1">
              {tierLabel} Tier · No collateral required
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70]">
                Loan Amount
              </label>
              <span className="font-['Bricolage_Grotesque'] font-bold text-lg text-[#A84551]">
                ₦{amount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={limit}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-[#A84551]"
            />
            <div className="flex justify-between mt-1">
              <span className="font-['Inter'] text-xs text-[#8A6B70]">
                ₦5,000
              </span>
              <span className="font-['Inter'] text-xs text-[#8A6B70]">
                ₦{limit.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <label className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] block mb-3">
              Repayment Method
            </label>
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                  repaymentType === "sweep"
                    ? "border-[#A84551] bg-[#A84551]/5"
                    : "border-[#E8DDE0]"
                }`}
              >
                <input
                  type="radio"
                  name="repayment"
                  value="sweep"
                  checked={repaymentType === "sweep"}
                  onChange={() => setRepaymentType("sweep")}
                  className="mt-0.5 accent-[#A84551]"
                />
                <div>
                  <p className="font-['Inter'] text-sm font-semibold text-[#1A0A0D]">
                    10% Auto-Sweep
                  </p>
                  <p className="font-['Inter'] text-xs text-[#8A6B70]">
                    10% of every incoming payment is automatically deducted
                    until fully repaid. No cash-flow shock.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                  repaymentType === "bullet"
                    ? "border-[#A84551] bg-[#A84551]/5"
                    : "border-[#E8DDE0]"
                }`}
              >
                <input
                  type="radio"
                  name="repayment"
                  value="bullet"
                  checked={repaymentType === "bullet"}
                  onChange={() => setRepaymentType("bullet")}
                  className="mt-0.5 accent-[#A84551]"
                />
                <div>
                  <p className="font-['Inter'] text-sm font-semibold text-[#1A0A0D]">
                    Bullet Payment
                  </p>
                  <p className="font-['Inter'] text-xs text-[#8A6B70]">
                    Pay the full amount on the 30th. If missed, auto-sweep
                    activates automatically.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 font-['Inter'] text-xs p-3 mb-4">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#8B3541" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApply}
            disabled={loading}
            className="w-full py-4 bg-[#A84551] text-white font-['Inter'] font-semibold text-sm border-none cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
              `Apply for ₦${amount.toLocaleString()} →`
            )}
          </motion.button>

          <p className="font-['Inter'] text-xs text-[#8A6B70] text-center mt-4">
            No hidden fees. No collateral. Powered by your Vouch Score.
          </p>
        </motion.div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="font-['Inter'] text-xs text-[#8A6B70] hover:text-[#A84551] transition-colors bg-transparent border-none cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
