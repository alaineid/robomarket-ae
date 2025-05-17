import Header from "@/components/layout/Header";
import HeroSection from "@/components/layout/HeroSection";
import FeaturedRobots from "@/components/products/FeaturedRobots";
import ValueProposition from "@/components/layout/ValueProposition";
import CallToAction from "@/components/ui/CallToAction";
import Footer from "@/components/layout/Footer";

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
