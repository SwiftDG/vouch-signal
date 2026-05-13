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

          <h2 className="font-['Syne'] font-extrabold text-5xl md:text-7xl text-[#1A0A0D] leading-tight mb-6">
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
              className="font-['Inter'] font-semibold text-sm px-8 py-4 bg-transparent text-[#1A0A0D] border border-[#E8DDE0] cursor-pointer rounded-md transition-colors flex items-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
