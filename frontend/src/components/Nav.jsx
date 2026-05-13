import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={` border-b border-[#E8DDE0] fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-5 flex items-center justify-between transition-all duration-500 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="font-['Syne'] font-bold text-3xl text-[#1A0A0D] tracking-tight">
        Vou<span className="text-[#A84551]">ch</span>
      </div>

      <ul className="hidden md:flex items-center gap-10 list-none m-0 p-0">
        {["How it Works", "Score", "Squad APIs", "About"].map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] hover:text-[#A84551] transition-colors no-underline"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => (window.location.href = "/login")}
        className="font-['DM_Mono'] text-xs uppercase tracking-widest px-6 py-3 bg-[#A84551] text-white hover:bg-[#8B3541] transition-colors border-none cursor-pointer rounded-sm"
      >
        Get Started
      </motion.button>
    </motion.nav>
  );
}
