import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Problem from "../components/Problem";
import HowItWorks from "../components/HowItWorks";
import ScoreDisplay from "../components/ScoreDisplay";
import SquadAPIs from "../components/SquadAPIs";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import About from "../components/About";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-[#060C18]"
      style={{
        backgroundImage: `linear-gradient(rgba(232,93,4,0.03) 1px, transparent 1px),linear-gradient(90deg, rgba(232,93,4,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    >
      <Nav />
      <Hero />
      <Stats />
      <Problem />
      <HowItWorks />
      <ScoreDisplay />
      <SquadAPIs />
      <About />
      <CTA />
      <Footer />
    </div>
  );
}
