import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import { Zap, Shield, Users, BarChart3, Repeat, Globe } from "lucide-react";

const features = [
  {
    icon: <Zap size={20} className="text-[#A84551]" />,
    title: "BNPL Inventory Financing",
    desc: "Buy Now Pay Later for bulk inventory orders. Stock up before peak season without draining your cash flow.",
  },
  {
    icon: <Shield size={20} className="text-[#A84551]" />,
    title: "Business Insurance",
    desc: "Affordable micro-insurance products for informal traders. Protect your stock, your shop, and your income.",
  },
  {
    icon: <Repeat size={20} className="text-[#A84551]" />,
    title: "Digital Ajo Circles",
    desc: "Digitize Nigeria's 200-year-old rotating savings tradition. Automated contributions, enforced payouts, zero defaults.",
  },
  {
    icon: <Users size={20} className="text-[#A84551]" />,
    title: "Verified Employer Directory",
    desc: "High-tier traders get listed as Verified Employers. Unemployed youth can find micro-jobs with businesses proven to have real cash flow.",
  },
  {
    icon: <BarChart3 size={20} className="text-[#A84551]" />,
    title: "B2B Fast-Track Onboarding",
    desc: "Established wholesalers skip Tier 1 entirely. Upload a 6-month bank statement, complete 30-day Squad probation, unlock enterprise credit instantly.",
  },
  {
    icon: <Globe size={20} className="text-[#A84551]" />,
    title: "Lender API Marketplace",
    desc: "Any Nigerian bank can plug into the Vouch Score API. Query Mama Ngozi's reputation score for ₦50 per call. Risk-as-a-Service.",
  },
];

export default function V2Page() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className="relative z-10">
        <nav className="bg-white/80 backdrop-blur-md border-b border-[#E8DDE0] px-6 md:px-12 py-4 flex items-center justify-between">
          <div
            onClick={() => navigate("/")}
            className="font-['Bricolage_Grotesque'] font-bold text-xl text-[#1A0A0D] cursor-pointer"
          >
            Vou<span className="text-[#A84551]">ch</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/signup")}
            className="font-['Inter'] font-semibold text-sm px-6 py-3 bg-[#A84551] text-white border-none cursor-pointer"
          >
            Get Started →
          </motion.button>
        </nav>

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-px bg-[#A84551]" />
              <span className="font-['Inter'] text-xs uppercase tracking-widest text-[#A84551]">
                Coming Soon
              </span>
            </div>
            <h1 className="font-['Bricolage_Grotesque'] font-bold text-5xl md:text-7xl text-[#1A0A0D] leading-tight mb-6">
              Vouch V2.
              <br />
              <span className="text-[#A84551]">The full ecosystem.</span>
            </h1>
            <p className="font-['Inter'] text-base text-[#8A6B70] max-w-xl leading-relaxed">
              V1 gives traders a financial identity. V2 builds an entire
              intelligent economy around it — connecting traders, job seekers,
              lenders, and insurers into one closed-loop ecosystem powered by
              Squad.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative bg-[#FAFAFA] border border-[#E8DDE0] p-8"
              >
                <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-[#A84551]" />
                <div className="w-10 h-10 bg-[#A84551]/10 border border-[#A84551]/20 flex items-center justify-center mb-5 rounded-sm">
                  {f.icon}
                </div>
                <h3 className="font-['Bricolage_Grotesque'] font-bold text-base text-[#1A0A0D] mb-3">
                  {f.title}
                </h3>
                <p className="font-['Inter'] text-sm text-[#8A6B70] leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-50px" }}
            className="bg-[#A84551] p-12 text-center"
          >
            <h2 className="font-['Bricolage_Grotesque'] font-bold text-3xl md:text-4xl text-white mb-4">
              V1 is live. Go try it.
            </h2>
            <p className="font-['Inter'] text-sm text-white/70 mb-8 max-w-md mx-auto">
              Build your Market Reputation Score today. Every transaction you
              process now is a data point that unlocks V2 features the moment
              they launch.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              className="font-['Inter'] font-semibold text-sm px-10 py-4 bg-white text-[#A84551] border-none cursor-pointer"
            >
              Start Building Your Score →
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
