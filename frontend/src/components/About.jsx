import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Users, Target, Zap } from "lucide-react";

const values = [
  {
    icon: <Target size={24} className="text-[#A84551]" />,
    title: "Our Mission",
    desc: "To make every Nigerian informal trader financially visible — using their own transaction history as proof of trustworthiness.",
  },
  {
    icon: <Users size={24} className="text-[#A84551]" />,
    title: "Who We Serve",
    desc: "40 million+ informal traders, artisans, and small business owners who are economically active but financially invisible to traditional banks.",
  },
  {
    icon: <Zap size={24} className="text-[#A84551]" />,
    title: "How We Do It",
    desc: "Every Squad transaction builds a Market Reputation Score. That score unlocks real financial services — automatically, without paperwork.",
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
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="relative bg-[#FAFAFA] border border-[#E8DDE0] p-8 cursor-default"
    >
      <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-[#A84551]" />
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-px bg-[#A84551]" />
            <span className="font-['Inter'] text-xs uppercase tracking-widest text-[#A84551]">
              About
            </span>
          </div>
          <h2 className="font-['Bricolage_Grotesque'] font-bold text-4xl md:text-6xl text-[#1A0A0D] leading-tight mb-16">
            Built for the
            <br />
            <span className="text-[#A84551]">invisible economy.</span>
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ perspective: "1000px" }}
        >
          {values.map((v, i) => (
            <TiltCard key={i} delay={i * 0.1}>
              <div className="w-10 h-10 bg-[#A84551]/10 border border-[#A84551]/20 flex items-center justify-center mb-5 rounded-sm">
                {v.icon}
              </div>
              <h3 className="font-['Bricolage_Grotesque'] font-bold text-lg text-[#1A0A0D] mb-3">
                {v.title}
              </h3>
              <p className="font-['Inter'] text-sm text-[#8A6B70] leading-relaxed">
                {v.desc}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
