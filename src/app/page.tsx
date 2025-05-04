import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedRobots from "@/components/FeaturedRobots";
import Footer from "@/components/Footer";
import { FaShieldAlt, FaBolt, FaHeadset } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturedRobots />
        
        {/* Value Proposition Section */}
        <section id="value-prop" className="py-16 px-4 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose RoboMarket?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We offer premium humanoid robots with industry-leading features and support
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Value Prop 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="w-14 h-14 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mb-4">
                  <FaShieldAlt className="text-2xl text-[#4DA9FF]" />
                </div>
                <h3 className="font-bold text-xl mb-3">Verified Quality</h3>
                <p className="text-gray-600">
                  All robots on our platform undergo rigorous testing and certification to ensure the highest quality standards and safety.
                </p>
              </div>
              
              {/* Value Prop 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="w-14 h-14 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mb-4">
                  <FaBolt className="text-2xl text-[#4DA9FF]" />
                </div>
                <h3 className="font-bold text-xl mb-3">Advanced Technology</h3>
                <p className="text-gray-600">
                  Our humanoid robots feature cutting-edge AI, machine learning capabilities, and precision engineering for optimal performance.
                </p>
              </div>
              
              {/* Value Prop 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="w-14 h-14 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mb-4">
                  <FaHeadset className="text-2xl text-[#4DA9FF]" />
                </div>
                <h3 className="font-bold text-xl mb-3">Dedicated Support</h3>
                <p className="text-gray-600">
                  Our team of experts provides comprehensive support, maintenance, and updates to ensure your robot operates at peak performance.
                </p>
              </div>
            </div>
          </div>
        </section>
        
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
