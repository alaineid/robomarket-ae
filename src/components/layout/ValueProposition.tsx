import React from "react";
import Container from "./Container";

export default function ValueProposition() {
  return (
    <section className="py-16 ">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">
            Why Choose <span className="text-blue-500">RoboMarket</span>?
          </h2>
          <p className="text-gray-600">
            We offer premium humanoid robots with industry-leading features and
            support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Value Proposition 1 */}
          <div className="p-6  border border-gray-200 rounded-lg shadow-md">
            <div className="mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">
              Verified Quality
            </h3>
            <p className="text-gray-600 text-center">
              All robots on our platform undergo rigorous testing and
              certification to ensure the highest quality standards and safety.
            </p>
          </div>

          {/* Value Proposition 2 */}
          <div className="p-6  border border-gray-200 rounded-lg shadow-md">
            <div className="mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">
              Advanced Technology
            </h3>
            <p className="text-gray-600 text-center">
              Our humanoid robots feature cutting-edge AI, machine learning
              capabilities, and precision engineering for optimal performance.
            </p>
          </div>

          {/* Value Proposition 3 */}
          <div className="p-6  border border-gray-200 rounded-lg shadow-md">
            <div className="mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">
              Dedicated Support
            </h3>
            <p className="text-gray-600 text-center">
              Our team of expert service engineers provide extensive support,
              maintenance, and troubleshooting for optimal user experience.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
