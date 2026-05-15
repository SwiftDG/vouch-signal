import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Smartphone,
  CreditCard,
  ChartNoAxesCombined,
  LockKeyholeOpen,
} from "lucide-react";

const steps = [
  {
    num: "01",
    icon: <Smartphone size={28} className="text-[#A84551]" />,
    title: "Onboard",
    body: "Register with your phone number. A Squad Virtual Account is created instantly — your permanent digital financial identity.",
  },
  {
    num: "02",
    icon: <CreditCard size={28} className="text-[#A84551]" />,
    title: "Transact",
    body: "Customers pay you through Squad. Every payment, every recurring customer, every on-time supplier payment becomes a trust signal.",
  },
  {
    num: "03",
    icon: <ChartNoAxesCombined size={28} className="text-[#A84551]" />,
    title: "Score Builds",
    body: "Our AI engine analyses your transaction patterns in real time, generating your Market Reputation Score — updated with every payment.",
  },
  {
    num: "04",
    icon: <LockKeyholeOpen size={28} className="text-[#A84551]" />,
    title: "Access Unlocks",
    body: "Cross the threshold and financial products unlock automatically. Microloans, inventory credit, insurance — powered by your Squad history.",
  },
];

function TiltCard({ children, delay }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [8, -8]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-8, 8]),
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
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="relative bg-white border border-[#E8DDE0] p-8 cursor-default"
    >
      <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-[#A84551]" />
      {children}
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-[#FAFAFA] border-b border-[#E8DDE0]"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-px bg-[#A84551]" />
            <span className="font-['Inter'] text-xs uppercase tracking-widest text-[#A84551]">
              How It Works
            </span>
          </div>
          <h2 className="font-['Bricolage_Grotesque'] font-bold text-4xl md:text-6xl text-[#1A0A0D] leading-tight mb-16">
            Four steps to your
            <br />
            <span className="text-[#A84551]">financial identity.</span>
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          style={{ perspective: "1000px" }}
        >
          {steps.map((s, i) => (
            <TiltCard key={i} delay={i * 0.1}>
              <div className="font-['Inter'] text-xs text-[#A84551] tracking-widest mb-4">
                {s.num}
              </div>
              <div className="mb-4">{s.icon}</div>
              <h3 className="font-['Bricolage_Grotesque'] font-bold text-base text-[#1A0A0D] mb-3">
                {s.title}
              </h3>
              <p className="font-['Inter'] text-sm text-[#8A6B70] leading-relaxed">
                {s.body}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
