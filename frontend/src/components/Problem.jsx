import { motion } from "framer-motion";
import ParticleBurst from "./ParticleBurst";

const problems = [
  {
    num: "01",
    title: "No Credit History",
    body: "Traders doing millions in monthly sales have nothing to show banks. Cash transactions leave no paper trail. 15 years of business = zero credit score.",
  },
  {
    num: "02",
    title: "Banks Say No",
    body: "No payslips. No collateral. No formal documentation. Traditional banks reject Nigeria's most productive informal workers by design, not by data.",
  },
  {
    num: "03",
    title: "Ajo Runs Away",
    body: "Nigeria's 200-year-old rotating savings tradition collapses when one member collects and disappears. Trust is the only enforcement — until now.",
  },
];

export default function Problem() {
  return (
    <section className="py-10 px-6 md:px-16 bg-white">
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
              The Problem
            </span>
          </div>
          <h2 className="font-['Syne'] font-bold text-4xl md:text-6xl text-[#1A0A0D] leading-tight mb-16">
            Financially <span className="text-[#A84551]">invisible.</span>
            <br />
            Economically real.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{
                y: -4,
                boxShadow: "0 12px 40px rgba(168,69,81,0.1)",
              }}
              className="relative bg-[#FAFAFA] border border-[#E8DDE0] p-8 cursor-default"
            >
              <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-[#A84551]" />
              <div className="font-['Syne'] font-extrabold text-6xl text-[#16070A] opacity-30 mb-6">
                {p.num}
              </div>
              <h3 className="font-['Syne'] font-bold text-lg text-[#1A0A0D] mb-4">
                {p.title}
              </h3>
              <p className="font-['Inter'] text-sm text-[#4A4A4A] leading-relaxed">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      {/*Particle Burst animation */}
      <ParticleBurst />
    </section>
  );
}

function CursorEvader() {
  return (
    <motion.div className="relative mt-20 h-32 overflow-hidden rounded-2xl bg-[#FAFAFA] border border-[#E8DDE0] flex items-center justify-center">
      <p className="font-['Inter'] text-sm text-[#8A6B70] z-10 pointer-events-none">
        Move your cursor around
      </p>
      {[...Array(8)].map((_, i) => (
        <EvadingDot key={i} index={i} />
      ))}
    </motion.div>
  );
}

function EvadingDot({ index }) {
  const x = 15 + index * 12;
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-full bg-[#A84551] opacity-30"
      style={{ left: `${x}%`, top: "50%" }}
      animate={{
        y: [0, -10, 0, 10, 0],
        x: [0, 5, -5, 3, 0],
        opacity: [0.15, 0.4, 0.15, 0.35, 0.15],
      }}
      transition={{
        duration: 3 + index * 0.5,
        delay: index * 0.3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
