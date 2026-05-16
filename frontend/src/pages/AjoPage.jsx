import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  CheckCircle,
  Lock,
  Plus,
  TrendingUp,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

const CIRCLES = [
  {
    id: 1,
    name: "Balogun Market Women",
    members: 12,
    maxMembers: 15,
    contribution: 5000,
    frequency: "Weekly",
    totalPot: 60000,
    currentRound: 7,
    totalRounds: 15,
    nextPayout: "Mama Chisom",
    nextDate: "May 20, 2026",
    joined: false,
    locked: false,
  },
  {
    id: 2,
    name: "Kano Traders Circle",
    members: 20,
    maxMembers: 20,
    contribution: 10000,
    frequency: "Weekly",
    totalPot: 200000,
    currentRound: 3,
    totalRounds: 20,
    nextPayout: "Alhaji Musa",
    nextDate: "May 21, 2026",
    joined: false,
    locked: true,
  },
  {
    id: 3,
    name: "Computer Village Tech Bros",
    members: 8,
    maxMembers: 10,
    contribution: 20000,
    frequency: "Monthly",
    totalPot: 200000,
    currentRound: 2,
    totalRounds: 10,
    nextPayout: "Emeka C.",
    nextDate: "June 1, 2026",
    joined: true,
    locked: false,
  },
  {
    id: 4,
    name: "UNILAG Alumni Savings",
    members: 5,
    maxMembers: 10,
    contribution: 15000,
    frequency: "Monthly",
    totalPot: 150000,
    currentRound: 1,
    totalRounds: 10,
    nextPayout: "TBD",
    nextDate: "July 1, 2026",
    joined: false,
    locked: false,
  },
];

const MY_CIRCLE = {
  name: "Computer Village Tech Bros",
  contribution: 20000,
  frequency: "Monthly",
  myPosition: 5,
  totalRounds: 10,
  currentRound: 2,
  nextContribution: "June 1, 2026",
  totalSaved: 40000,
  amountToReceive: 200000,
  members: [
    { name: "Emeka C.", paid: true, round: 2 },
    { name: "Tunde A.", paid: true, round: 2 },
    { name: "You", paid: true, round: 2 },
    { name: "Chidera N.", paid: false, round: 2 },
    { name: "Femi O.", paid: false, round: 2 },
    { name: "Amaka I.", paid: true, round: 2 },
    { name: "Kunle B.", paid: false, round: 2 },
    { name: "Ngozi P.", paid: true, round: 2 },
  ],
};

function CircleCard({ circle, onJoin }) {
  const progress = (circle.currentRound / circle.totalRounds) * 100;
  const spotsLeft = circle.maxMembers - circle.members;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="relative bg-white border border-[#E8DDE0] p-6"
    >
      <div className="absolute top-0 left-0 w-1/3 h-0.5 bg-[#A84551]" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-['Bricolage_Grotesque'] font-bold text-lg text-[#1A0A0D] mb-1">
            {circle.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="font-['Inter'] text-xs text-[#8A6B70] flex items-center gap-1">
              <Users size={11} /> {circle.members}/{circle.maxMembers} members
            </span>
            <span className="font-['Inter'] text-xs text-[#8A6B70] flex items-center gap-1">
              <Calendar size={11} /> {circle.frequency}
            </span>
          </div>
        </div>
        {circle.locked ? (
          <div className="flex items-center gap-1 px-2 py-1 bg-[#F5F0F1] border border-[#E8DDE0]">
            <Lock size={11} className="text-[#8A6B70]" />
            <span className="font-['Inter'] text-xs text-[#8A6B70]">Full</span>
          </div>
        ) : circle.joined ? (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200">
            <CheckCircle size={11} className="text-green-500" />
            <span className="font-['Inter'] text-xs text-green-600">
              Joined
            </span>
          </div>
        ) : (
          <div className="px-2 py-1 bg-[#A84551]/10 border border-[#A84551]/20">
            <span className="font-['Inter'] text-xs text-[#A84551]">
              {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
            </span>
          </div>
        )}
      </div>

      <div className="bg-[#FAFAFA] border border-[#E8DDE0] p-4 mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-['Inter'] text-xs text-[#8A6B70] mb-1">
              Contribution
            </p>
            <p className="font-['Bricolage_Grotesque'] font-bold text-base text-[#A84551]">
              ₦{circle.contribution.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="font-['Inter'] text-xs text-[#8A6B70] mb-1">
              Total Pot
            </p>
            <p className="font-['Bricolage_Grotesque'] font-bold text-base text-[#1A0A0D]">
              ₦{circle.totalPot.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="font-['Inter'] text-xs text-[#8A6B70] mb-1">
              Next Payout
            </p>
            <p className="font-['Inter'] text-xs font-semibold text-[#1A0A0D]">
              {circle.nextPayout}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="font-['Inter'] text-xs text-[#8A6B70]">
            Round {circle.currentRound} of {circle.totalRounds}
          </span>
          <span className="font-['Inter'] text-xs text-[#A84551]">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 bg-[#E8DDE0] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#A84551] rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ margin: "-50px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="font-['Inter'] text-xs text-[#8A6B70]">
          Next: {circle.nextDate}
        </p>
        {!circle.joined && !circle.locked && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onJoin(circle)}
            className="px-5 py-2 bg-[#A84551] text-white font-['Inter'] font-semibold text-sm border-none cursor-pointer"
          >
            Join Circle →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function AjoPage() {
  const navigate = useNavigate();
  const [circles, setCircles] = useState(CIRCLES);
  const [joinedCircle, setJoinedCircle] = useState(null);
  const [activeTab, setActiveTab] = useState("browse");

  const handleJoin = (circle) => {
    setCircles((prev) =>
      prev.map((c) =>
        c.id === circle.id ? { ...c, joined: true, members: c.members + 1 } : c,
      ),
    );
    setJoinedCircle(circle);
    setTimeout(() => setJoinedCircle(null), 4000);
  };

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
                Digital Ajo Circles
              </span>
            </div>
            <h1 className="font-['Bricolage_Grotesque'] font-bold text-5xl md:text-6xl text-[#1A0A0D] leading-tight mb-4">
              Save together.
              <br />
              <span className="text-[#A84551]">Grow together.</span>
            </h1>
            <p className="font-['Inter'] text-base text-[#8A6B70] max-w-xl leading-relaxed">
              Nigeria's 200-year-old rotating savings tradition — digitized and
              automated. Contributions enforced. Payouts guaranteed. No
              defaults. No drama.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-[#E8DDE0] pb-0">
            {["browse", "my circle"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-['Inter'] text-sm font-semibold px-6 py-3 border-none cursor-pointer transition-colors capitalize ${
                  activeTab === tab
                    ? "text-[#A84551] border-b-2 border-[#A84551] bg-transparent -mb-px"
                    : "text-[#8A6B70] bg-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Join toast */}
          <AnimatePresence>
            {joinedCircle && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="bg-green-50 border border-green-200 px-6 py-3 mb-6 flex items-center gap-3"
              >
                <CheckCircle size={16} className="text-green-500" />
                <span className="font-['Inter'] text-sm text-green-700">
                  You've joined <strong>{joinedCircle.name}</strong>! Your first
                  contribution is due on {joinedCircle.nextDate}.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === "browse" ? (
            <>
              {/* Stats */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-[#E8DDE0]">
                <div>
                  <p className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#A84551]">
                    {circles.length}
                  </p>
                  <p className="font-['Inter'] text-xs text-[#8A6B70]">
                    Active circles
                  </p>
                </div>
                <div className="w-px h-8 bg-[#E8DDE0]" />
                <div>
                  <p className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#A84551]">
                    ₦
                    {circles
                      .reduce((s, c) => s + c.totalPot, 0)
                      .toLocaleString()}
                  </p>
                  <p className="font-['Inter'] text-xs text-[#8A6B70]">
                    Total in circulation
                  </p>
                </div>
                <div className="w-px h-8 bg-[#E8DDE0]" />
                <div>
                  <p className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#A84551]">
                    0%
                  </p>
                  <p className="font-['Inter'] text-xs text-[#8A6B70]">
                    Default rate
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {circles.map((circle) => (
                  <CircleCard
                    key={circle.id}
                    circle={circle}
                    onJoin={handleJoin}
                  />
                ))}
              </div>

              {/* Create circle CTA */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-50px" }}
                className="border-2 border-dashed border-[#E8DDE0] p-12 text-center hover:border-[#A84551] transition-colors cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                <Plus size={32} className="text-[#E8DDE0] mx-auto mb-4" />
                <h3 className="font-['Bricolage_Grotesque'] font-bold text-xl text-[#1A0A0D] mb-2">
                  Start your own Ajo Circle
                </h3>
                <p className="font-['Inter'] text-sm text-[#8A6B70] max-w-sm mx-auto">
                  Create a circle for your market, your street, your community.
                  Vouch handles the automation — you just save.
                </p>
              </motion.div>
            </>
          ) : (
            /* My Circle tab */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Circle summary */}
                <div className="relative bg-white border border-[#E8DDE0] p-6">
                  <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-[#A84551]" />
                  <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] mb-4">
                    My Circle
                  </p>
                  <h2 className="font-['Bricolage_Grotesque'] font-bold text-2xl text-[#1A0A0D] mb-6">
                    {MY_CIRCLE.name}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-['Inter'] text-sm text-[#8A6B70]">
                        My contribution
                      </span>
                      <span className="font-['Inter'] text-sm font-semibold text-[#1A0A0D]">
                        ₦{MY_CIRCLE.contribution.toLocaleString()} /{" "}
                        {MY_CIRCLE.frequency.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-['Inter'] text-sm text-[#8A6B70]">
                        My position
                      </span>
                      <span className="font-['Inter'] text-sm font-semibold text-[#1A0A0D]">
                        #{MY_CIRCLE.myPosition} of {MY_CIRCLE.totalRounds}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-['Inter'] text-sm text-[#8A6B70]">
                        Total saved
                      </span>
                      <span className="font-['Inter'] text-sm font-semibold text-green-600">
                        ₦{MY_CIRCLE.totalSaved.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-['Inter'] text-sm text-[#8A6B70]">
                        I receive
                      </span>
                      <span className="font-['Bricolage_Grotesque'] font-bold text-lg text-[#A84551]">
                        ₦{MY_CIRCLE.amountToReceive.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-['Inter'] text-sm text-[#8A6B70]">
                        Next contribution
                      </span>
                      <span className="font-['Inter'] text-sm font-semibold text-[#1A0A0D]">
                        {MY_CIRCLE.nextContribution}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#E8DDE0]">
                    <div className="flex justify-between mb-2">
                      <span className="font-['Inter'] text-xs text-[#8A6B70]">
                        Round {MY_CIRCLE.currentRound} of{" "}
                        {MY_CIRCLE.totalRounds}
                      </span>
                      <span className="font-['Inter'] text-xs text-[#A84551]">
                        {Math.round(
                          (MY_CIRCLE.currentRound / MY_CIRCLE.totalRounds) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#E8DDE0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#A84551] rounded-full"
                        style={{
                          width: `${(MY_CIRCLE.currentRound / MY_CIRCLE.totalRounds) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Members status */}
                <div className="relative bg-white border border-[#E8DDE0] p-6">
                  <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-[#A84551]" />
                  <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#8A6B70] mb-4">
                    Round {MY_CIRCLE.currentRound} Contributions
                  </p>
                  <div className="space-y-3">
                    {MY_CIRCLE.members.map((member, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-[#E8DDE0] last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              member.name === "You"
                                ? "bg-[#A84551] text-white"
                                : "bg-[#F5F0F1] text-[#8A6B70]"
                            }`}
                          >
                            {member.name.charAt(0)}
                          </div>
                          <span
                            className={`font-['Inter'] text-sm ${
                              member.name === "You"
                                ? "font-bold text-[#1A0A0D]"
                                : "text-[#4A4A4A]"
                            }`}
                          >
                            {member.name}
                          </span>
                        </div>
                        {member.paid ? (
                          <div className="flex items-center gap-1 text-green-500">
                            <CheckCircle size={14} />
                            <span className="font-['Inter'] text-xs">Paid</span>
                          </div>
                        ) : (
                          <span className="font-['Inter'] text-xs text-[#8A6B70]">
                            Pending
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#E8DDE0] flex justify-between">
                    <span className="font-['Inter'] text-xs text-[#8A6B70]">
                      {MY_CIRCLE.members.filter((m) => m.paid).length} of{" "}
                      {MY_CIRCLE.members.length} paid
                    </span>
                    <div className="flex items-center gap-1 text-[#A84551]">
                      <TrendingUp size={12} />
                      <span className="font-['Inter'] text-xs font-semibold">
                        +10 Vouch pts on completion
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
