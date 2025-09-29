import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import ProblemSolution from "@/components/landing/ProblemSolution";
import Features from "@/components/landing/Features";
import Benefits from "@/components/landing/Benefits";
import BottomCTA from "@/components/landing/BottomCTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div>
      <Header />
      <Hero />
      <div className="container mx-auto h-px bg-border" />
      <ProblemSolution />
      <Features />
      <Benefits />
      <BottomCTA />
      <div className="container mx-auto h-px bg-border" />
      <Footer />
    </div>
  );
}
