import { motion } from "framer-motion";

const links = {
  Product: [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Market Score", href: "#score" },
    { label: "Squad APIs", href: "#squad-apis" },
    { label: "V2 Roadmap", href: "/v2" },
    { label: "Job Directory", href: "/jobs" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0D0A0A] border-t border-white/10 px-6 md:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div
              onClick={() => (window.location.href = "/")}
              className="font-['Bricolage_Grotesque'] font-bold text-xl text-white mb-4 cursor-pointer inline-block"
            >
              Vou<span className="text-[#A84551]">ch</span>
            </div>
            <p className="font-['Inter'] text-sm text-white/40 leading-relaxed">
              Trust infrastructure for Nigeria's informal economy. Built on
              Squad.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://github.com/SwiftDG/vouch-signal"
                target="_blank"
                rel="noreferrer"
                className="font-['Inter'] text-xs text-white/40 hover:text-white transition-colors no-underline flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-['Inter'] text-xs uppercase tracking-widest text-white/40 mb-4">
                {category}
              </h4>
              <ul className="space-y-3 list-none p-0 m-0">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="font-['Inter'] text-sm text-white/60 hover:text-white transition-colors no-underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-['Inter'] text-xs text-white/30">© 2026 Vouch.</p>
          <p className="font-['Inter'] text-xs text-white/30">
            Powered by Squad · GTCo · HabariPay
          </p>
        </div>
      </div>
    </footer>
  );
}
