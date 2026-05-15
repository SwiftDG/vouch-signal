import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function WaveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const lineCount = 80;

      for (let i = 0; i < lineCount; i++) {
        const progress = i / lineCount;
        const alpha = 0.15 + progress * 0.5;

        // Color interpolation wine to light pink
        const r = Math.round(168 + (232 - 168) * progress);
        const g = Math.round(69 + (180 - 69) * progress);
        const b = Math.round(81 + (186 - 81) * progress);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = 0.8;

        for (let x = 0; x <= w; x += 2) {
          const xProg = x / w;
          const y =
            h * 0.4 +
            Math.sin(xProg * Math.PI * 3 + t + progress * 4) *
              (60 + progress * 80) +
            Math.sin(xProg * Math.PI * 6 + t * 1.5 + progress * 2) *
              (20 + progress * 30) +
            progress * h * 0.35;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      t += 0.008;
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

const stats = [
  { number: "40M+", label: "Informal traders in Nigeria" },
  { number: "₦25T", label: "Annual credit gap" },
  { number: "714", label: "Average Vouch Score at loan unlock" },
];

const unlocks = [
  { label: "Squad Virtual Account", unlocked: true },
  { label: "Emergency Microloan ₦50,000", unlocked: true },
  { label: "Inventory Financing", unlocked: true },
  { label: "BNPL Supplier Orders", unlocked: false },
  { label: "Insurance Products", unlocked: false },
];

export default function ScoreDisplay() {
  return (
    <section
      id="score"
      className="relative bg-[#0D0A0A] overflow-hidden"
      style={{ minHeight: "700px" }}
    >
      <WaveCanvas />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0A0A] via-transparent to-[#0D0A0A] opacity-60" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 py-24">
        {/* Top text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-['Inter'] font-bold text-white text-2xl md:text-4xl max-w-2xl">
            <span className="text-white">One score.</span>{" "}
            <span className="text-[#E8B4BA]">
              Every transaction builds your financial identity automatically —
              no applications, no paperwork.
            </span>
          </p>
        </motion.div>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-8 max-w-md mb-24"
        >
          <div className="font-['Inter'] text-xs text-white/50 mb-1">
            Market Reputation Score
          </div>
          <div className="font-['Inter'] text-sm text-white/70 mb-6">
            Mama Ngozi — Fabric Trader, Balogun
          </div>

          <div className="flex items-end gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              className="font-['Bricolage_Grotesque'] font-extrabold text-8xl text-white leading-none"
            >
              714
            </motion.div>
            <div className="pb-2">
              <div className="font-['Inter'] text-xs text-green-400 mb-1">
                ▲ +23 this week
              </div>
              <div className="font-['Inter'] text-xs text-white/40">
                out of 1,000
              </div>
            </div>
          </div>

          <div className="h-1 bg-white/10 mb-6 overflow-hidden rounded-full">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "71.4%" }}
              viewport={{ margin: "-50px" }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
              className="h-full bg-[#A84551] rounded-full"
            />
          </div>

          <div className="space-y-3">
            {unlocks.map((u, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-50px" }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${u.unlocked ? "bg-[#A84551]" : "bg-white/20"}`}
                />
                <span
                  className={`font-['Inter'] text-xs ${u.unlocked ? "text-white" : "text-white/30"}`}
                >
                  {u.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats row — Stripe style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="font-['Bricolage_Grotesque'] font-extrabold text-5xl text-[#E8B4BA] mb-2">
                {s.number}
              </div>
              <div className="font-['Inter'] text-sm text-white/50">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
