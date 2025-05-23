import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/layout/HeroSection";
import FeaturedRobots from "../components/layout/FeaturedRobots";
import VideoBanner from "../components/layout/VideoBanner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        
        
        <HeroSection />
        <VideoBanner />
        <FeaturedRobots />
      </main>
      <Footer />
    </div>
  );
}
