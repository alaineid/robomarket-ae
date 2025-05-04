import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedRobots from "@/components/FeaturedRobots";
import ValueProposition from "@/components/ValueProposition";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturedRobots />
        <ValueProposition />
        
        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Welcome a Robot Into Your Life?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Browse our collection of premium humanoid robots and find the perfect assistant for your needs.
            </p>
            <a 
              href="/shop" 
              className="bg-[#4DA9FF] hover:bg-[#3B8CD9] text-white font-bold py-3 px-10 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Shop Now
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
