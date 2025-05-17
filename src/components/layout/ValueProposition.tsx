import { FaShieldAlt, FaBolt, FaHeadset } from "react-icons/fa";

export default function ValueProposition() {
  return (
    <section
      id="value-prop"
      className="py-20 px-4 lg:px-8 bg-gradient-to-b from-white to-blue-50"
    >
      <div className="container mx-auto max-w-[2400px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
            Why Choose <span className="text-[#4DA9FF]">RoboMarket</span>?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We offer premium humanoid robots with industry-leading features and
            support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Value Prop 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <div className="w-16 h-16 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaShieldAlt className="text-3xl text-[#4DA9FF]" />
            </div>
            <h3 className="font-bold text-2xl mb-4 text-center">
              Verified Quality
            </h3>
            <p className="text-gray-600 text-center">
              All robots on our platform undergo rigorous testing and
              certification to ensure the highest quality standards and safety.
            </p>
          </div>

          {/* Value Prop 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <div className="w-16 h-16 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaBolt className="text-3xl text-[#4DA9FF]" />
            </div>
            <h3 className="font-bold text-2xl mb-4 text-center">
              Advanced Technology
            </h3>
            <p className="text-gray-600 text-center">
              Our humanoid robots feature cutting-edge AI, machine learning
              capabilities, and precision engineering for optimal performance.
            </p>
          </div>

          {/* Value Prop 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <div className="w-16 h-16 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaHeadset className="text-3xl text-[#4DA9FF]" />
            </div>
            <h3 className="font-bold text-2xl mb-4 text-center">
              Dedicated Support
            </h3>
            <p className="text-gray-600 text-center">
              Our team of experts provides comprehensive support, maintenance,
              and updates to ensure your robot operates at peak performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
