import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

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
      <div
        onClick={() => (window.location.href = "/")}
        className="font-['Syne'] font-bold text-3xl text-[#1A0A0D] tracking-tight cursor-pointer"
      >
        Vou<span className="text-[#A84551]">ch</span>
      </div>

      <ul className="hidden md:flex items-center gap-10 list-none m-0 p-0">
        {[
          { label: "How it Works", id: "how-it-works" },
          { label: "Score", id: "score" },
          { label: "Squad APIs", id: "squad-apis" },
          { label: "About", id: "about" },
        ].map((link) => (
          <li key={link.label}>
            <a
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(link.id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] hover:text-[#A84551] transition-colors no-underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => (window.location.href = "/signup")}
        className="font-['DM_Mono'] text-xs uppercase tracking-widest px-6 py-3 bg-[#A84551] text-white hover:bg-[#8B3541] transition-colors border-none cursor-pointer rounded-sm"
      >
        Get Started
      </motion.button>
    </motion.nav>
  );
}
