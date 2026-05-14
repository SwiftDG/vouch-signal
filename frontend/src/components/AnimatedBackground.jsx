import { motion, useAnimationFrame } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #ffffff 0%, #ffffff 45%, rgba(168,69,81,0.15) 65%, rgba(196,96,110,0.25) 80%, rgba(255,182,193,0.3) 100%)",
            "linear-gradient(135deg, #ffffff 0%, #ffffff 40%, rgba(196,96,110,0.2) 60%, rgba(168,69,81,0.3) 75%, rgba(255,150,170,0.25) 100%)",
            "linear-gradient(135deg, #ffffff 0%, #ffffff 50%, rgba(168,69,81,0.12) 68%, rgba(220,100,120,0.28) 85%, rgba(255,182,193,0.2) 100%)",
            "linear-gradient(135deg, #ffffff 0%, #ffffff 45%, rgba(168,69,81,0.15) 65%, rgba(196,96,110,0.25) 80%, rgba(255,182,193,0.3) 100%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
