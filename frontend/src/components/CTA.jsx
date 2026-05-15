import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function Blob({ style, delay }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={style}
      animate={{
        x: [0, 30, -20, 10, 0],
        y: [0, -20, 30, -10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{ duration: 12, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function CTA() {
  return (
    <section className="relative bg-white overflow-hidden py-32 px-6 md:px-16">
      <Blob
        style={{
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(168,69,81,0.12) 0%, transparent 70%)",
          top: -100,
          right: -100,
        }}
        delay={0}
      />
      <Blob
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(196,96,110,0.1) 0%, transparent 70%)",
          bottom: -80,
          right: 200,
        }}
        delay={3}
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-px bg-[#A84551]" />
            <span className="font-['Inter'] text-xs uppercase tracking-widest text-[#A84551]">
              Built on Squad
            </span>
            <div className="w-6 h-px bg-[#A84551]" />
          </div>

          <h2 className="font-['Bricolage_Grotesque'] font-extrabold text-5xl md:text-7xl text-[#1A0A0D] leading-tight mb-6">
            Every trader deserves
            <br />
            <span className="text-[#A84551]">to be seen.</span>
          </h2>

          <p className="font-['Inter'] text-base text-[#4A4A4A] max-w-xl mx-auto leading-relaxed mb-12">
            40 million Nigerian traders are invisible to the financial system.
            VouchSignal changes that — one Squad transaction at a time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#8B3541" }}
              whileTap={{ scale: 0.97 }}
              className="font-['Inter'] font-semibold text-sm px-8 py-4 bg-[#A84551] text-white border-none cursor-pointer rounded-md transition-colors flex items-center gap-2"
            >
              Get Started <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.03,
                borderColor: "#A84551",
                color: "#A84551",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="font-['Inter'] font-semibold text-sm px-8 py-4 bg-transparent text-[#1A0A0D] border border-[#E8DDE0] cursor-pointer rounded-md transition-colors"
            >
              See How It Works
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
