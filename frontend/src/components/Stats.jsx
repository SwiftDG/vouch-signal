import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-200px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (1500 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { number: 40, suffix: "M+", label: "Informal traders in Nigeria" },
  { number: 25, suffix: "T", label: "₦ annual credit gap" },
  { number: 14, suffix: "M+", label: "Ajo/Esusu participants" },
  { number: 0, suffix: "", label: "Documents required" },
];

export default function Stats() {
  return (
    <div className="border-t border-b border-[#E8DDE0] bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#E8DDE0]">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-200px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="px-8 md:px-12 py-10 hover:bg-[#F5F0F1] transition-colors"
          >
            <div className="font-['Bricolage_Grotesque'] font-extrabold text-4xl md:text-5xl text-[#A84551] mb-2">
              <Counter target={s.number} suffix={s.suffix} />
            </div>
            <div className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70]">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
