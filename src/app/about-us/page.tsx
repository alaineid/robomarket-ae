// filepath: /Users/aeid/Documents/Algorythm/apps/responsive/src/app/about-us/page.tsx
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import PageHero from "../../components/layout/PageHero";
import Container from "../../components/layout/Container";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="About ROBOMARKET"
          description="Your trusted marketplace for premium humanoid robots and accessories"
          breadcrumbItems={[
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about-us" },
          ]}
        />

        <Container>
          <div className="py-12">
            <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Our Mission
                  </h2>
                  <p className="text-lg text-gray-700 mb-4">
                    At ROBOMARKET, our mission is to make advanced robotics
                    accessible to businesses and individuals across the GCC
                    region by providing a trusted marketplace for premium
                    humanoid robots and accessories.
                  </p>
                  <p className="text-gray-700 mb-4">
                    We believe that robotics technology has the potential to
                    transform industries, enhance productivity, and improve
                    quality of life. By connecting buyers with reputable
                    manufacturers and authorized sellers, we aim to accelerate
                    the adoption of robotics in various sectors including
                    healthcare, education, hospitality, and more.
                  </p>
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/images/robot1.png"
                    alt="ROBOMARKET Mission"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                <div className="order-2 md:order-1 relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/images/robot2.png"
                    alt="ROBOMARKET Story"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Our Story
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Founded in 2023 in Dubai, ROBOMARKET emerged from a vision
                    to create a specialized platform dedicated to robotics in
                    the GCC region. Our founders identified a gap in the market
                    for a reliable channel to connect businesses and individuals
                    with quality robotics products.
                  </p>
                  <p className="text-gray-700 mb-4">
                    What began as a small startup has quickly grown into the
                    {
                      " region's leading marketplace for humanoid robots, with a "
                    }
                    carefully curated selection of products from top
                    manufacturers worldwide. Our commitment to quality,
                    security, and exceptional customer service has established
                    ROBOMARKET as a trusted name in the industry.
                  </p>
                </div>
              </div>

              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Our Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4">Quality</h3>
                    <p className="text-gray-700">
                      We are committed to maintaining high standards for all
                      products listed on our platform. We work only with
                      reputable manufacturers and verify product authenticity to
                      ensure our customers receive the best in robotics
                      technology.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4">Innovation</h3>
                    <p className="text-gray-700">
                      We embrace cutting-edge technology and continuously seek
                      innovative ways to improve our platform and expand our
                      product offerings, ensuring our customers have access to
                      the latest advancements in robotics.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4">Trust</h3>
                    <p className="text-gray-700">
                      We build trust through transparency, security, and
                      reliable service. Our platform provides detailed product
                      information, secure transactions, and responsive customer
                      support to create a trustworthy shopping experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Our Team
                </h2>
                <p className="text-gray-700 mb-8">
                  ROBOMARKET is powered by a diverse team of experts in
                  technology, e-commerce, and customer service. Our team
                  combines technical knowledge with a passion for robotics to
                  create an exceptional marketplace experience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          CEO
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">Ahmed Al Maktoum</h3>
                    <p className="text-gray-600">Chief Executive Officer</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          CTO
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">Sophia Chen</h3>
                    <p className="text-gray-600">Chief Technology Officer</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          COO
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">Fahad Al Naimi</h3>
                    <p className="text-gray-600">Chief Operations Officer</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Contact Us
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-700 mb-4">
                      {
                        "We'd love to hear from you! Whether you have questions "
                      }
                      about our platform, suggestions for improvement, or are
                      interested in partnering with us, feel free to reach out.
                    </p>
                    <ul className="list-none pl-0 mt-4">
                      <li className="mb-2 text-gray-700">
                        <strong>Email:</strong> info@robomarket.ae
                      </li>
                      <li className="mb-2 text-gray-700">
                        <strong>Phone:</strong> +971 58 583 6777
                      </li>
                      <li className="text-gray-700">
                        <strong>Address:</strong> Dubai, UAE
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                    <p className="italic text-gray-600">
                      Contact form functionality will be implemented soon. In
                      the meantime, please reach out to us via email or phone.
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-4">
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
                        <label className="block text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          disabled
                          className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                          placeholder="Your email"
                        />
                      </div>
                      <div>
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
                      <div>
                        <button
                          disabled
                          className="bg-gray-400 text-white py-2 px-6 rounded font-medium"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
