// filepath: /Users/aeid/Documents/Algorythm/apps/responsive/src/app/terms-of-service/page.tsx
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import PageHero from "../../components/layout/PageHero";
import PolicyLayout from "../../components/layout/PolicyLayout";
import { FiFileText, FiShield, FiTruck, FiUsers } from "react-icons/fi";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Terms of Service"
          description="Please read these terms and conditions carefully before using our platform."
          breadcrumbItems={[
            { label: "Home", href: "/" },
            { label: "Terms of Service", href: "/terms-of-service" },
          ]}
        />

        <PolicyLayout>
          <div className="px-1">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] p-3 rounded-full">
                <FiFileText className="text-white h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {"Welcome to ROBOMARKET"}
              </h2>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-[#4DA9FF] mb-8">
              <p className="text-lg text-gray-700">
                {'These Terms and Conditions (\"Terms\") govern your access to and use ' +
                  "of the ROBOMARKET website, platform, and services (collectively, the " +
                  '\"Platform\"). By accessing or using the Platform, you agree to be ' +
                  "bound by these Terms. Please read them carefully."}
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiShield className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {"1. Platform Role and Limitations of Liability"}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  {"ROBOMARKET operates as an online marketplace platform that connects " +
                    'buyers with manufacturers or authorized sellers (\"Manufacturers\") of ' +
                    'robotics and related products (\"Products\"). ROBOMARKET does not ' +
                    "design, manufacture, store, inspect, or endorse any Products listed " +
                    "on the Platform. We facilitate transactions between buyers and " +
                    "Manufacturers."}
                </p>

                <p className="text-gray-700 mb-4">
                  {"To the fullest extent permitted by applicable law, ROBOMARKET shall " +
                    "not be liable for any direct, indirect, incidental, special, " +
                    "consequential, or punitive damages, including but not limited to, " +
                    "damages for loss of profits, goodwill, use, data, or other " +
                    "intangible losses, arising out of or relating to your access to or " +
                    "use of, or inability to access or use, the Platform or any Products " +
                    "purchased through the Platform. This includes, but is not limited " +
                    "to, any damages resulting from Product use, misuse, defects, or " +
                    "failure."}
                </p>

                <p className="text-gray-700 mb-4">
                  {"All technical specifications, performance claims, safety assurances, " +
                    "and warranty obligations related to Products are the sole " +
                    "responsibility of the respective Manufacturer. ROBOMARKET disclaims " +
                    "all warranties, express or implied, regarding the Platform itself, " +
                    "except where explicitly stated otherwise in writing. Any warranties " +
                    "related to Products are provided directly by the Manufacturer " +
                    "according to their own terms, which may be available on the Product " +
                    "listing page or the Manufacturer's official website."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiUsers className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {"2. User Account and Conduct"}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  {"You are responsible for maintaining the confidentiality of your " +
                    "account information, including your password, and for all activities " +
                    "that occur under your account. You agree to notify ROBOMARKET " +
                    "immediately of any unauthorized use of your account or any other " +
                    "breach of security."}
                </p>

                <p className="text-gray-700 mb-4">
                  {"ROBOMARKET shall not be liable for any loss or damage arising from " +
                    "unauthorized access to your account resulting from your failure to " +
                    "protect your credentials or from external factors, unless such " +
                    "access is determined to be a direct result of ROBOMARKET's gross " +
                    "negligence or failure to implement and maintain reasonable security " +
                    "measures as required by applicable law and outlined in our Privacy " +
                    "Policy."}
                </p>

                <p className="text-gray-700 mb-4">
                  {"You agree not to use the Platform for any unlawful purpose or in any " +
                    "way that could harm ROBOMARKET, its service providers, " +
                    "Manufacturers, or any other person. Prohibited activities include, " +
                    "but are not limited to: uploading malicious code, interfering with " +
                    "the Platform's operation, posting fraudulent or misleading " +
                    "information (including reviews), infringing intellectual property " +
                    "rights, or attempting to circumvent security measures."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiTruck className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {"3. Orders, Payments, and Fulfillment"}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  {"All orders placed through the Platform are subject to acceptance by " +
                    "the Manufacturer. ROBOMARKET facilitates the payment process but " +
                    "does not handle or physically inspect any Product prior to shipment " +
                    "unless explicitly stated otherwise. Shipping and delivery are the " +
                    "responsibility of the Manufacturer or their authorized logistics " +
                    "provider, as outlined in our Shipping & Delivery Policy. Payment " +
                    "processing services are provided by third-party gateways, and your " +
                    "use of these services is subject to their terms and conditions."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiFileText className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {"4. Intellectual Property"}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  {"All content included on the Platform, such as text, graphics, logos, " +
                    "button icons, images, audio clips, digital downloads, data " +
                    "compilations, and software, is the property of ROBOMARKET or its " +
                    "content suppliers (including Manufacturers) and protected by " +
                    "international copyright and trademark laws. The compilation of all " +
                    "content on this site is the exclusive property of ROBOMARKET. You " +
                    "may not systematically extract or re-utilize parts of the contents " +
                    "of the Platform without ROBOMARKET's express written consent. " +
                    "Specifically, you may not utilize any data mining, robots, or " +
                    "similar data gathering and extraction tools to extract (whether once " +
                    "or many times) for re-utilization any substantial parts of this " +
                    "Platform."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {"5. Termination or Suspension"}
                </h3>
                <p className="text-gray-700 mb-4">
                  {"ROBOMARKET reserves the right to suspend or terminate your account " +
                    "and access to the Platform, without notice and at its sole " +
                    "discretion, if it believes you have violated these Terms, engaged in " +
                    "fraudulent or illegal activities, or taken actions harmful to the " +
                    "Platform, its users, or third parties."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {"6. User Indemnification"}
                </h3>
                <p className="text-gray-700 mb-4">
                  {"To the extent permitted by applicable law, you agree to indemnify, " +
                    "defend, and hold harmless ROBOMARKET, its affiliates, officers, " +
                    "directors, employees, agents, and licensors from and against any and " +
                    "all claims, liabilities, damages, losses, costs, expenses, or fees " +
                    "(including reasonable attorneys' fees) that such parties may incur " +
                    "as a result of or arising from your (or anyone using your account's) " +
                    "violation of these Terms, your violation of any law or the rights of " +
                    "a third party, or your use of the Platform or Products purchased " +
                    "through it."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {"7. Force Majeure"}
                </h3>
                <p className="text-gray-700 mb-4">
                  {"ROBOMARKET shall not be held liable for any failure or delay in the " +
                    "performance of its obligations under these Terms (such as platform " +
                    "availability) caused by circumstances beyond our reasonable control, " +
                    "including but not limited to acts of God, war, terrorism, government " +
                    "restrictions or actions, natural disasters, pandemics, strikes, " +
                    "labor disputes, internet or telecommunication outages, or failure of " +
                    "third-party service providers."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {"8. Governing Law and Dispute Resolution"}
                </h3>
                <p className="text-gray-700 mb-4">
                  {"These Terms and any dispute or claim arising out of or in connection " +
                    "with them or their subject matter or formation (including " +
                    "non-contractual disputes or claims) shall be governed by and " +
                    "construed in accordance with the laws of the United Arab Emirates as " +
                    "applied in the Emirate of Dubai. Any dispute arising out of or in " +
                    "connection with these Terms, including any question regarding its " +
                    "existence, validity, or termination, shall be referred to and " +
                    "finally resolved by the competent courts of Dubai, United Arab " +
                    "Emirates, unless otherwise agreed by ROBOMARKET in writing."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {"9. Amendments"}
                </h3>
                <p className="text-gray-700 mb-4">
                  {"ROBOMARKET reserves the right to modify these Terms at any time. We " +
                    "will notify you of significant changes by posting the new Terms on " +
                    "the Platform or by sending you an email notification. Your continued " +
                    "use of the Platform after such changes constitutes your acceptance " +
                    "of the new Terms. We encourage you to review these Terms " +
                    "periodically."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {"10. Contact Information"}
                </h3>
                <p className="text-gray-700 mb-4">
                  {"If you have any questions about these Terms, please contact us at: " +
                    "hello@robomarket.ae"}
                </p>
              </div>
            </div>

            <div className="mt-16">
              <div className="bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] p-4 rounded-t-lg">
                <h2 className="text-3xl font-bold text-white">
                  {"Return & Refund Policy"}
                </h2>
              </div>

              <div className="bg-white p-6 rounded-b-lg shadow-md mb-8">
                <p className="text-gray-700 mb-6">
                  {
                    "This policy outlines the process for returns and refunds for"
                  }
                  {
                    " products purchased through the ROBOMARKET platform. Please note that"
                  }
                  {
                    " ROBOMARKET acts as a marketplace, and returns are primarily governed"
                  }
                  {
                    " by the policies of the individual Manufacturer from whom you"
                  }
                  {" purchased the product."}
                </p>

                <div className="border-l-4 border-[#4DA9FF] pl-4 mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {"1. Return Eligibility"}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {
                      "Returns are generally accepted under the following conditions,"
                    }
                    {" subject to the specific Manufacturer's policy:"}
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-3">
                    <li>
                      <span className="font-semibold">
                        {"Defective on Arrival (DOA):"}
                      </span>
                      {
                        " The product does not function correctly right out of the box."
                      }
                    </li>
                    <li>
                      <span className="font-semibold">
                        {"Damaged During Shipping:"}
                      </span>
                      {
                        " The product packaging or the product itself shows clear signs of damage"
                      }
                      {
                        " sustained during transit. (See Shipping & Delivery Policy for reporting"
                      }
                      {" requirements)."}
                    </li>
                    <li>
                      <span className="font-semibold">
                        {"Significantly Not as Described:"}
                      </span>
                      {
                        " The product received is fundamentally different from the item ordered or"
                      }
                      {
                        " described on the Platform (e.g., wrong model, missing core advertised"
                      }
                      {
                        " features, substantially incorrect specifications). Minor variations in"
                      }
                      {" color or appearance may not qualify."}
                    </li>
                  </ul>
                  <p className="text-gray-700 mb-4">
                    {
                      "Return requests must typically be initiated within 14 calendar days"
                    }
                    {
                      " of the confirmed delivery date. Please check the specific"
                    }
                    {
                      " Manufacturer's return policy, often available on the product page or"
                    }
                    {
                      " their website, as their timeframe may apply. Latent defects"
                    }
                    {
                      " discovered after this initial period may be covered under the"
                    }
                    {
                      " Manufacturer's warranty, and claims should be directed to the"
                    }
                    {" Manufacturer accordingly."}
                  </p>
                </div>

                <div className="border-l-4 border-[#4DA9FF] pl-4 mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {
                      "2. Manufacturer Authority and ROBOMARKET's Facilitation Role"
                    }
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {
                      "All returns, warranty claims, and final decisions regarding"
                    }
                    {
                      " eligibility, repair, replacement, or refund rest with the original"
                    }
                    {
                      " Manufacturer and are subject to their individual warranty and return"
                    }
                    {
                      " policies. ROBOMARKET requires Manufacturers listing on the Platform"
                    }
                    {
                      " to maintain reasonable return and warranty policies, but we do not"
                    }
                    {
                      " process returns or issue refunds directly unless explicitly stated"
                    }
                    {" otherwise."}
                  </p>
                  <p className="text-gray-700 mb-4">
                    {
                      "ROBOMARKET is not typically involved in the return communication or"
                    }
                    {" dispute resolution process between the customer and the"}
                    {
                      " Manufacturer. However, if you have initiated a return request with"
                    }
                    {
                      " the Manufacturer following the correct procedure and have not"
                    }
                    {
                      " received a substantive response (acknowledgment or resolution steps)"
                    }
                    {
                      " within 5 business days, please contact ROBOMARKET support at"
                    }
                    {
                      " support@robomarket.ae with your order details and evidence of your"
                    }
                    {
                      " communication attempt. In such cases, ROBOMARKET may, at its"
                    }
                    {
                      " discretion, attempt to facilitate communication between you and the"
                    }
                    {
                      " Manufacturer to encourage a response. This facilitation role does"
                    }
                    {
                      " not imply ROBOMARKET assumes liability for the return outcome, which"
                    }
                    {
                      " remains subject to the Manufacturer's policy and assessment."
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] p-4 rounded-t-lg">
                <h2 className="text-3xl font-bold text-white">
                  {"Shipping & Delivery Policy"}
                </h2>
              </div>

              <div className="bg-white p-6 rounded-b-lg shadow-md mb-8">
                <p className="text-gray-700 mb-6">
                  {
                    "This policy details how products ordered through ROBOMARKET are"
                  }
                  {" shipped and delivered."}
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {"1. Fulfillment Model"}
                    </h3>
                    <p className="text-gray-700">
                      {
                        "Products listed on ROBOMARKET are shipped directly to you by the"
                      }
                      {
                        " Manufacturer or their designated authorized logistics provider."
                      }
                      {
                        " ROBOMARKET does not typically hold inventory or operate its own"
                      }
                      {" shipping facilities."}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {"2. Shipping Regions"}
                    </h3>
                    <p className="text-gray-700">
                      {
                        "ROBOMARKET currently facilitates orders for shipment to addresses"
                      }
                      {
                        " within the Gulf Cooperation Council (GCC) countries: United Arab"
                      }
                      {
                        " Emirates (UAE), Kingdom of Saudi Arabia (KSA), Kuwait, Oman,"
                      }
                      {
                        " Bahrain, and Qatar. We may expand to additional regions in the"
                      }
                      {" future."}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {"3. Delivery Timeline"}
                    </h3>
                    <p className="text-gray-700">
                      {
                        "Estimated delivery times vary depending on the Product type,"
                      }
                      {
                        " Manufacturer's location (origin country), shipping method chosen,"
                      }
                      {
                        " destination address, and customs processing times. A general"
                      }
                      {
                        " estimate is often between 7–21 calendar days, but this can be"
                      }
                      {
                        " longer, particularly for complex items, international shipments, or"
                      }
                      {
                        " during peak periods. More specific estimates may be provided on the"
                      }
                      {
                        " product page or during checkout where available from the"
                      }
                      {" Manufacturer."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 mb-4">
              <div className="bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] p-4 rounded-t-lg">
                <h2 className="text-3xl font-bold text-white">
                  {"Privacy Policy"}
                </h2>
              </div>

              <div className="bg-white p-6 rounded-b-lg shadow-md">
                <p className="text-gray-700 mb-4">
                  {
                    'ROBOMARKET (\"we,\" \"us,\" \"our\") is committed to protecting your'
                  }
                  {
                    " privacy. This Privacy Policy explains how we collect, use, disclose,"
                  }
                  {
                    " and safeguard your information when you visit our website and use"
                  }
                  {' our platform (collectively, the \"Platform\").'}
                </p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {"For our complete detailed privacy policy, please visit our"}{" "}
                  <a
                    href="/privacy-policy"
                    className="text-[#4DA9FF] hover:text-[#3D89FF] font-semibold underline transition-colors"
                  >
                    {"Privacy Policy page"}
                  </a>
                  {"."}
                </p>
              </div>
            </div>
          </div>
        </PolicyLayout>
      </main>
      <Footer />
    </div>
  );
}
