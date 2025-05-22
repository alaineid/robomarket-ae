// filepath: /Users/aeid/Documents/Algorythm/apps/responsive/src/app/support/page.tsx
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import PageHero from "../../components/layout/PageHero";
import Container from "../../components/layout/Container";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Customer Support"
          description="We're here to help you with any questions or issues"
          breadcrumbItems={[
            { label: "Home", href: "/" },
            { label: "Support", href: "/support" },
          ]}
        />

        <Container>
          <div className="py-12">
            <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                How Can We Help You?
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Our dedicated support team is available to assist you with any
                questions, concerns, or issues you may have regarding our
                products or services.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-4">
                    Contact Information
                  </h3>
                  <ul className="list-none pl-0">
                    <li className="mb-3">
                      <strong>Email:</strong> support@robomarket.ae
                    </li>
                    <li className="mb-3">
                      <strong>Phone:</strong> +971 58 583 6777
                    </li>
                    <li className="mb-3">
                      <strong>Hours:</strong> 9:00 AM - 6:00 PM (GST), Sunday to
                      Thursday
                    </li>
                    <li>
                      <strong>Address:</strong> Dubai, UAE
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-4">Support Resources</h3>
                  <ul className="list-none pl-0">
                    <li className="mb-3">
                      <a
                        href="#faq"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Frequently Asked Questions
                      </a>
                    </li>
                    <li className="mb-3">
                      <a
                        href="/terms-of-service"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Terms of Service
                      </a>
                    </li>
                    <li className="mb-3">
                      <a
                        href="/privacy-policy"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#shipping"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Shipping & Delivery Information
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <section id="faq" className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Frequently Asked Questions
                </h3>

                <div className="space-y-6">
                  <div className=" p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold mb-2">
                      How does ROBOMARKET work?
                    </h4>
                    <p className="text-gray-700">
                      ROBOMARKET operates as an online marketplace platform that
                      connects buyers with manufacturers or authorized sellers
                      of robotics and related products. We facilitate
                      transactions and provide a secure platform for purchasing
                      premium humanoid robots and accessories.
                    </p>
                  </div>

                  <div className=" p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold mb-2">
                      What payment methods do you accept?
                    </h4>
                    <p className="text-gray-700">
                      We accept major credit and debit cards, bank transfers,
                      and select digital payment methods. All payments are
                      processed securely through our trusted payment partners.
                    </p>
                  </div>

                  <div className=" p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold mb-2">
                      How long does shipping take?
                    </h4>
                    <p className="text-gray-700">
                      Shipping times vary depending on the product, manufacturer
                      location, and destination. Generally, delivery takes
                      between 7-21 calendar days. You can find more specific
                      information on the product page or at checkout.
                    </p>
                  </div>

                  <div className=" p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold mb-2">
                      What is your return policy?
                    </h4>
                    <p className="text-gray-700">
                      Returns are generally accepted for products that are
                      defective on arrival, damaged during shipping, or
                      significantly not as described. Return requests must
                      typically be initiated within 14 calendar days of
                      delivery. Please check our{" "}
                      <a
                        href="/terms-of-service"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Terms of Service
                      </a>{" "}
                      for complete details.
                    </p>
                  </div>

                  <div className=" p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold mb-2">
                      Do you offer international shipping?
                    </h4>
                    <p className="text-gray-700">
                      Currently, we facilitate orders for shipment to addresses
                      within the Gulf Cooperation Council (GCC) countries:
                      United Arab Emirates (UAE), Kingdom of Saudi Arabia (KSA),
                      Kuwait, Oman, Bahrain, and Qatar. We may expand to
                      additional regions in the future.
                    </p>
                  </div>
                </div>
              </section>

              <section id="shipping" className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Shipping & Delivery Information
                </h3>
                <div className=" p-6 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-gray-700 mb-4">
                    Products listed on ROBOMARKET are shipped directly to you by
                    the Manufacturer or their designated authorized logistics
                    provider. ROBOMARKET does not typically hold inventory or
                    operate its own shipping facilities.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Estimated delivery times vary depending on the Product type,
                    {
                      " Manufacturer's location (origin country), shipping method "
                    }
                    chosen, destination address, and customs processing times. A
                    general estimate is often between 7–21 calendar days, but
                    this can be longer, particularly for complex items,
                    international shipments, or during peak periods.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Contact Form
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                  <p className="italic text-gray-600 mb-6">
                    Contact form functionality will be implemented soon. In the
                    meantime, please reach out to us via email or phone.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        disabled
                        className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        disabled
                        className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                        placeholder="Your email"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        disabled
                        className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                        placeholder="Subject"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        disabled
                        className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                        rows={4}
                        placeholder="Your message"
                      ></textarea>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      disabled
                      className="bg-gray-400 text-white py-2 px-6 rounded font-medium"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
