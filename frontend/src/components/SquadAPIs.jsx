import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Wallet,
  CreditCard,
  Webhook,
  Zap,
  RefreshCw,
  Shield,
} from "lucide-react";

const apis = [
  {
    icon: <Wallet size={24} />,
    name: "Virtual Accounts",
    desc: "One permanent Squad account per trader. Created instantly on registration. Every inbound payment feeds the score.",
  },
  {
    icon: <CreditCard size={24} />,
    name: "Payment Gateway",
    desc: "All customer purchases flow through Squad. Every transaction is a verified trust signal — timestamped and undeniable.",
  },
  {
    icon: <Webhook size={24} />,
    name: "Webhooks",
    desc: "Real-time transaction events fire into our scoring engine the moment a payment lands. Score updates are instant.",
  },
  {
    icon: <Zap size={24} />,
    name: "Transfer API",
    desc: "Loan disbursements delivered directly to trader Virtual Accounts the moment they accept. No waiting. No paperwork.",
  },
  {
    icon: <RefreshCw size={24} />,
    name: "Recurring Payments",
    desc: "Loan repayments and Ajo contributions automated. Consistent repayment adds positive signals to the score.",
  },
  {
    icon: <Shield size={24} />,
    name: "Dispute APIs",
    desc: "Dispute events are negative scoring signals. Resolved disputes restore score points. Fraud rings get flagged.",
  },
];

function TiltCard({ children, delay }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [6, -6]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-6, 6]),
    springConfig,
  );

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-50px" }}
      transition={{ delay, duration: 0.6 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="relative bg-white/5 border border-white/10 p-8 cursor-default hover:bg-white/10 transition-colors"
    >
      <div className="absolute top-0 left-0 w-1/3 h-px bg-[#A84551]" />
      {children}
    </motion.div>
  );
}

export default function SquadAPIs() {
  return (
    <section id="squad-apis" className="py-24 bg-[#0D0A0A]">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-px bg-[#A84551]" />
            <span className="font-['Inter'] text-xs uppercase tracking-widest text-[#A84551]">
              Squad API Integration
            </span>
          </div>
          <h2 className="font-['Syne'] font-bold text-4xl md:text-6xl text-white leading-tight max-w-2xl">
            Squad is not optional.
            <br />
            <span className="text-[#A84551]">Squad is the engine.</span>
          </h2>
          <p className="font-['Inter'] text-base text-white/50 mt-6 max-w-xl leading-relaxed">
            Without Squad processing every transaction, there is no data.
            Without data, there is no score. Without a score, there is no
            product.
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          style={{ perspective: "1000px" }}
        >
          {apis.map((api, i) => (
            <TiltCard key={i} delay={i * 0.08}>
              <div className="w-10 h-10 bg-[#A84551]/10 border border-[#A84551]/20 flex items-center justify-center text-[#A84551] mb-5 rounded-sm">
                {api.icon}
              </div>
              <h3 className="font-['Syne'] font-bold text-base text-white mb-3">
                {api.name}
              </h3>
              <p className="font-['Inter'] text-sm text-white/50 leading-relaxed">
                {api.desc}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
