import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedRobots from "@/components/FeaturedRobots";
import ValueProposition from "@/components/ValueProposition";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturedRobots />
        <ValueProposition />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
}
