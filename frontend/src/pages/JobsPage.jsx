import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  Star,
  Search,
  Filter,
  CheckCircle,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

const JOBS = [
  {
    id: 1,
    employer: "Mama Ngozi Fabrics",
    role: "Delivery Rider",
    location: "Balogun Market, Lagos",
    pay: "₦3,500/day",
    type: "Daily",
    vouchScore: 714,
    tier: "Silver",
    verified: true,
    posted: "2 hours ago",
    desc: "Deliver fabric orders across Lagos Island. Must have a bike and phone.",
  },
  {
    id: 2,
    employer: "Alhaji Traders Co.",
    role: "Shop Assistant",
    location: "Kano Market, Kano",
    pay: "₦15,000/week",
    type: "Weekly",
    vouchScore: 856,
    tier: "Gold",
    verified: true,
    posted: "5 hours ago",
    desc: "Assist with stock management, customer service, and daily sales recording.",
  },
  {
    id: 3,
    employer: "Chioma Electronics",
    role: "Logistics Coordinator",
    location: "Computer Village, Lagos",
    pay: "₦8,000/day",
    type: "Daily",
    vouchScore: 623,
    tier: "Silver",
    verified: true,
    posted: "1 day ago",
    desc: "Coordinate delivery of electronics across Lagos. Must be organized and reliable.",
  },
  {
    id: 4,
    employer: "Fatima Fashion Hub",
    role: "Social Media Manager",
    location: "Remote",
    pay: "₦40,000/month",
    type: "Monthly",
    vouchScore: 591,
    tier: "Bronze",
    verified: true,
    posted: "2 days ago",
    desc: "Manage Instagram and WhatsApp Business pages. Post daily content and respond to customers.",
  },
  {
    id: 5,
    employer: "Emeka Food Supplies",
    role: "Market Runner",
    location: "Mile 12 Market, Lagos",
    pay: "₦2,500/day",
    type: "Daily",
    vouchScore: 488,
    tier: "Bronze",
    verified: true,
    posted: "3 days ago",
    desc: "Source and transport food supplies from Mile 12 to various restaurants daily.",
  },
  {
    id: 6,
    employer: "OGverse Logistics",
    role: "Campus Delivery Agent",
    location: "University of Lagos, Lagos",
    pay: "₦5,000/day",
    type: "Daily",
    vouchScore: 912,
    tier: "Gold",
    verified: true,
    posted: "4 days ago",
    desc: "Handle last-mile delivery across UNILAG campus. Flexible hours, high volume.",
  },
];

const TIER_COLORS = {
  Bronze: "#E8A838",
  Silver: "#4A90D9",
  Gold: "#A84551",
};

function JobCard({ job, onApply }) {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    onApply(job);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="relative bg-white border border-[#E8DDE0] p-6 hover:shadow-md transition-shadow"
    >
      <div className="absolute top-0 left-0 w-1/3 h-0.5 bg-[#A84551]" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-['Bricolage_Grotesque'] font-bold text-lg text-[#1A0A0D] mb-1">
            {job.role}
          </h3>
          <p className="font-['Inter'] text-sm text-[#8A6B70]">
            {job.employer}
          </p>
        </div>
        <div
          className="px-2 py-1 rounded-full text-xs font-['Inter'] font-semibold flex-shrink-0"
          style={{
            background: `${TIER_COLORS[job.tier]}15`,
            color: TIER_COLORS[job.tier],
          }}
        >
          {job.tier} Employer
        </div>
      </div>

      <p className="font-['Inter'] text-sm text-[#4A4A4A] mb-4 leading-relaxed">
        {job.desc}
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-[#8A6B70]">
          <MapPin size={13} />
          <span className="font-['Inter'] text-xs">{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#8A6B70]">
          <Clock size={13} />
          <span className="font-['Inter'] text-xs">{job.posted}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#8A6B70]">
          <Star size={13} />
          <span className="font-['Inter'] text-xs">
            Vouch Score {job.vouchScore}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-['Bricolage_Grotesque'] font-bold text-xl text-[#A84551]">
            {job.pay}
          </p>
          <p className="font-['Inter'] text-xs text-[#8A6B70]">
            {job.type} pay · Verified employer
          </p>
        </div>
        {applied ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200"
          >
            <CheckCircle size={14} className="text-green-500" />
            <span className="font-['Inter'] text-xs text-green-600 font-semibold">
              Applied
            </span>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleApply}
            className="px-5 py-2 bg-[#A84551] text-white font-['Inter'] font-semibold text-sm border-none cursor-pointer"
          >
            Apply →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function JobsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [appliedJob, setAppliedJob] = useState(null);

  const filtered = JOBS.filter((job) => {
    const matchesSearch =
      job.role.toLowerCase().includes(search.toLowerCase()) ||
      job.employer.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    const matchesTier = filterTier === "All" || job.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className="relative z-10">
        {/* Nav */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-[#E8DDE0] px-6 md:px-12 py-4 flex items-center justify-between">
          <div
            onClick={() => navigate("/")}
            className="font-['Bricolage_Grotesque'] font-bold text-xl text-[#1A0A0D] cursor-pointer"
          >
            Vou<span className="text-[#A84551]">ch</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/signup")}
            className="font-['Inter'] font-semibold text-sm px-6 py-3 bg-[#A84551] text-white border-none cursor-pointer"
          >
            Get Started →
          </motion.button>
        </nav>

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-px bg-[#A84551]" />
              <span className="font-['Inter'] text-xs uppercase tracking-widest text-[#A84551]">
                Verified Employer Directory
              </span>
            </div>
            <h1 className="font-['Bricolage_Grotesque'] font-bold text-5xl md:text-6xl text-[#1A0A0D] leading-tight mb-4">
              Work with traders
              <br />
              <span className="text-[#A84551]">you can trust.</span>
            </h1>
            <p className="font-['Inter'] text-base text-[#8A6B70] max-w-xl leading-relaxed">
              Every employer listed here has a verified Vouch Score. That means
              real cash flow, real customers, and a real ability to pay you — on
              time.
            </p>
          </motion.div>

          {/* Search and filter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-10"
          >
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A6B70]"
              />
              <input
                type="text"
                placeholder="Search by role, employer, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-[#E8DDE0] pl-10 pr-4 py-3 font-['Inter'] text-sm text-[#1A0A0D] outline-none focus:border-[#A84551] transition-colors bg-white"
              />
            </div>
            <div className="flex gap-2">
              {["All", "Bronze", "Silver", "Gold"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterTier(tier)}
                  className={`px-4 py-3 font-['Inter'] text-xs font-semibold border cursor-pointer transition-colors ${
                    filterTier === tier
                      ? "bg-[#A84551] text-white border-[#A84551]"
                      : "bg-white text-[#8A6B70] border-[#E8DDE0] hover:border-[#A84551]"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Applied toast */}
          <AnimatePresence>
            {appliedJob && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() =>
                  setTimeout(() => setAppliedJob(null), 3000)
                }
                className="bg-green-50 border border-green-200 px-6 py-3 mb-6 flex items-center gap-3"
              >
                <CheckCircle size={16} className="text-green-500" />
                <span className="font-['Inter'] text-sm text-green-700">
                  Application sent to <strong>{appliedJob.employer}</strong> for{" "}
                  {appliedJob.role}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats bar */}
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-[#E8DDE0]">
            <div>
              <p className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#A84551]">
                {filtered.length}
              </p>
              <p className="font-['Inter'] text-xs text-[#8A6B70]">
                Open positions
              </p>
            </div>
            <div className="w-px h-8 bg-[#E8DDE0]" />
            <div>
              <p className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#A84551]">
                100%
              </p>
              <p className="font-['Inter'] text-xs text-[#8A6B70]">
                Verified employers
              </p>
            </div>
            <div className="w-px h-8 bg-[#E8DDE0]" />
            <div>
              <p className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#A84551]">
                ₦0
              </p>
              <p className="font-['Inter'] text-xs text-[#8A6B70]">
                Placement fee
              </p>
            </div>
          </div>

          {/* Job grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase size={32} className="text-[#E8DDE0] mx-auto mb-4" />
              <p className="font-['Inter'] text-sm text-[#8A6B70]">
                No jobs match your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} onApply={setAppliedJob} />
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-50px" }}
            className="mt-20 bg-[#0D0A0A] p-12 text-center"
          >
            <h2 className="font-['Bricolage_Grotesque'] font-bold text-3xl text-white mb-4">
              Are you a trader?
            </h2>
            <p className="font-['Inter'] text-sm text-white/60 mb-8 max-w-md mx-auto">
              Build your Vouch Score and get listed as a Verified Employer. Your
              score proves to job seekers that you have real cash flow — and can
              actually pay them.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              className="font-['Inter'] font-semibold text-sm px-10 py-4 bg-[#A84551] text-white border-none cursor-pointer"
            >
              Build Your Score →
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
