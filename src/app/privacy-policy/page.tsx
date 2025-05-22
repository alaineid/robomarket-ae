// filepath: /Users/aeid/Documents/Algorythm/apps/responsive/src/app/privacy-policy/page.tsx
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import PageHero from "../../components/layout/PageHero";
import PolicyLayout from "../../components/layout/PolicyLayout";
import {
  FiShield,
  FiLock,
  FiGlobe,
  FiUserCheck,
  FiClock,
  FiAlertTriangle,
  FiHelpCircle,
} from "react-icons/fi";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Privacy Policy"
          description="How we handle and protect your personal information"
          breadcrumbItems={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy", href: "/privacy-policy" },
          ]}
        />

        <PolicyLayout>
          <div className="px-1">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] p-3 rounded-full">
                <FiShield className="text-white h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Privacy Policy
              </h2>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-[#4DA9FF] mb-8">
              <p className="text-lg text-gray-700">
                {
                  'ROBOMARKET ("we," "us," "our") is committed to protecting your'
                }
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                {
                  ' website and use our platform (collectively, the "Platform"). We '
                }
                handle your personal data in accordance with applicable data
                protection laws, primarily the UAE Federal Decree-Law No. 45 of
                {
                  ' 2021 on the Protection of Personal Data (the "PDPL"). Please '
                }
                read this policy carefully.
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiUserCheck className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    1. What Personal Data We Collect
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  We may collect the following categories of personal data about
                  you:
                </p>
                <ul className="space-y-3 pl-4">
                  <li className="flex items-start space-x-2">
                    <span className="inline-flex items-center justify-center bg-[#4DA9FF]/10 rounded-full p-1 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-[#4DA9FF]"></span>
                    </span>
                    <div>
                      <span className="font-semibold">Identity Data:</span> Full
                      name.
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="inline-flex items-center justify-center bg-[#4DA9FF]/10 rounded-full p-1 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-[#4DA9FF]"></span>
                    </span>
                    <div>
                      <span className="font-semibold">Contact Data:</span> Email
                      address, phone number, shipping address, billing address.
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="inline-flex items-center justify-center bg-[#4DA9FF]/10 rounded-full p-1 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-[#4DA9FF]"></span>
                    </span>
                    <div>
                      <span className="font-semibold">Transaction Data:</span>{" "}
                      Details about products you purchase, order history,
                      payment method information (processed securely by
                      third-party PCI-compliant payment gateways; we do not
                      store your full credit card details).
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="inline-flex items-center justify-center bg-[#4DA9FF]/10 rounded-full p-1 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-[#4DA9FF]"></span>
                    </span>
                    <div>
                      <span className="font-semibold">Technical Data:</span>{" "}
                      Internet protocol (IP) address, browser type and version,
                      time zone setting and location, browser plug-in types and
                      versions, operating system and platform, and other
                      technology on the devices you use to access the Platform.
                      (Collected partly via cookies - see Section 4).
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="inline-flex items-center justify-center bg-[#4DA9FF]/10 rounded-full p-1 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-[#4DA9FF]"></span>
                    </span>
                    <div>
                      <span className="font-semibold">Usage Data:</span>{" "}
                      Information about how you use our website and Platform,
                      including browsing patterns and product interests
                      {' ("preferences").'}
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="inline-flex items-center justify-center bg-[#4DA9FF]/10 rounded-full p-1 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-[#4DA9FF]"></span>
                    </span>
                    <div>
                      <span className="font-semibold">Communication Data:</span>{" "}
                      Records of your communications with us for customer
                      support or inquiries.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiShield className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    2. How We Use Your Personal Data
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  We use your personal data for the following purposes, based on
                  legitimate legal grounds under the PDPL:
                </p>
                <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200">
                  <div className="p-4">
                    <p className="font-semibold text-gray-800">
                      To Provide and Manage Services (Performance of Contract):
                    </p>
                    <p className="text-gray-700 mt-1">
                      Process your orders, manage payments, facilitate shipping
                      and delivery by sharing necessary details (see Section 5)
                      with Manufacturers and logistics partners, manage your
                      account.
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-800">
                      To Communicate With You (Performance of Contract,
                      Legitimate Interests):
                    </p>
                    <p className="text-gray-700 mt-1">
                      Send transactional emails (order confirmations, shipping
                      updates, invoices), respond to your inquiries, provide
                      customer support (available in Arabic, English, and
                      French).
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-800">
                      To Improve Our Platform (Legitimate Interests):
                    </p>
                    <p className="text-gray-700 mt-1">
                      Analyze website traffic and user behavior to understand
                      how our Platform is used, improve user experience, enhance
                      our service offerings, and maintain platform security.
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-800">
                      To Comply with Legal Obligations:
                    </p>
                    <p className="text-gray-700 mt-1">
                      Meet legal and regulatory requirements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiLock className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    3. Data Security
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational security
                  measures designed to protect your personal data from
                  unauthorized access, use, alteration, disclosure, or
                  destruction, in accordance with the requirements of the PDPL.
                  These measures include:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start space-x-3">
                    <div className="text-[#4DA9FF] shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Using Secure Sockets Layer (SSL) encryption for data
                      transmission.
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start space-x-3">
                    <div className="text-[#4DA9FF] shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Working exclusively with PCI-DSS compliant payment
                      processors.
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start space-x-3">
                    <div className="text-[#4DA9FF] shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Implementing access controls and internal policies to
                      limit access to personal data.
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start space-x-3">
                    <div className="text-[#4DA9FF] shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Regularly reviewing our security practices.
                    </span>
                  </div>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <p className="text-gray-700">
                    While we strive to protect your personal data, no electronic
                    transmission or storage is 100% secure. We cannot guarantee
                    absolute security. We may consider appointing a Data
                    Protection Officer (DPO) based on the scale and nature of
                    our data processing activities as required by law.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <svg
                      className="text-[#4DA9FF] h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="2"></circle>
                      <path d="M2 12h3m14 0h3M12 2v3m0 14v3"></path>
                      <circle cx="20" cy="12" r="2"></circle>
                      <circle cx="4" cy="12" r="2"></circle>
                      <circle cx="12" cy="20" r="2"></circle>
                      <circle cx="12" cy="4" r="2"></circle>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    4. Cookies and Tracking Technologies
                  </h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 mb-4">
                    Our Platform uses cookies and similar tracking technologies
                    (like web beacons) to enhance user experience, analyze site
                    usage, and support platform functionality. We use essential
                    cookies required for the site to operate (e.g., session
                    management, shopping cart) and non-essential cookies (e.g.,
                    for analytics, language preferences).
                  </p>
                  <p className="text-gray-700">
                    We provide detailed information about the cookies we use and
                    allow you to manage your preferences for non-essential
                    cookies through a separate Cookie Policy and a cookie
                    consent banner presented upon your first visit. Your consent
                    is required for deploying non-essential cookies. You can
                    withdraw your consent or change your preferences at any time
                    via our Cookie Policy page or browser settings.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiGlobe className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    5. Third-Party Data Sharing
                  </h3>
                </div>
                <div className="relative pl-6 border-l-2 border-[#4DA9FF] mb-6">
                  <div className="absolute left-[-8px] top-[-1px] bg-white">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#4DA9FF]"></div>
                  </div>
                  <p className="text-gray-700 font-medium mb-6 pl-4">
                    We do not sell your personal data. We only share your
                    personal data with third parties under the following limited
                    circumstances, ensuring appropriate safeguards are in place:
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Manufacturers
                    </h4>
                    <p className="text-gray-700">
                      We share necessary information (e.g., your name, shipping
                      address, email, phone number, order details) with the
                      Manufacturer of the product you ordered, strictly for the
                      purposes of order fulfillment, shipping, providing
                      tracking information, and handling warranty claims or
                      after-sales support as outlined in our other policies.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Logistics Partners
                    </h4>
                    <p className="text-gray-700">
                      We share necessary shipping information (e.g., name,
                      address, phone number) with logistics providers designated
                      by the Manufacturer solely for the purpose of delivering
                      your order.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Payment Processors
                    </h4>
                    <p className="text-gray-700">
                      We share transaction information with secure third-party
                      payment gateways to process your payments.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Service Providers
                    </h4>
                    <p className="text-gray-700">
                      We may share data with trusted third-party service
                      providers who perform functions on our behalf (e.g.,
                      website hosting, data analytics, customer service tools),
                      under strict contractual obligations to protect your data
                      and use it only for the purposes we specify.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Legal Requirements
                    </h4>
                    <p className="text-gray-700">
                      We may disclose your information if required by law,
                      regulation, legal process, or governmental request.
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    We require all third parties to respect the security of your
                    personal data and to treat it in accordance with the law,
                    including through Data Processing Agreements (DPAs) where
                    applicable under the PDPL.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiGlobe className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Cross-Border Data Transfers
                  </h3>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    Some Manufacturers, logistics partners, or service providers
                    may be located outside the United Arab Emirates. When we
                    transfer your personal data outside the UAE, we ensure a
                    similar degree of protection is afforded to it by
                    implementing safeguards required by the PDPL. This may
                    include transferring data to countries deemed adequate by
                    the UAE authorities, using specific contractual clauses
                    approved for use in the UAE, or obtaining your explicit
                    consent for the transfer after informing you of the risks.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiUserCheck className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    6. Your Data Protection Rights
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Under the UAE PDPL, you have the following rights regarding
                  your personal data:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-1">
                      Right to Access
                    </p>
                    <p className="text-gray-700 text-sm">
                      Request access to the personal data we hold about you.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-1">
                      Right to Rectification
                    </p>
                    <p className="text-gray-700 text-sm">
                      Request correction of inaccurate or incomplete personal
                      {" data ('modification')."}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-1">
                      Right to Erasure
                    </p>
                    <p className="text-gray-700 text-sm">
                      {"Request deletion of your personal data ('right to be "}
                      {"forgotten'), subject to certain legal limitations."}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-1">
                      Right to Restrict Processing
                    </p>
                    <p className="text-gray-700 text-sm">
                      Request the restriction of processing your personal data
                      under certain conditions.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-1">
                      Right to Object to Processing
                    </p>
                    <p className="text-gray-700 text-sm">
                      Object to the processing of your personal data based on
                      legitimate interests or for direct marketing purposes.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-1">
                      Right to Data Portability
                    </p>
                    <p className="text-gray-700 text-sm">
                      Request the transfer of your personal data to you or a
                      third party in a structured, commonly used,
                      machine-readable format.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-1">
                      Right to Withdraw Consent
                    </p>
                    <p className="text-gray-700 text-sm">
                      Withdraw your consent at any time where we rely on consent
                      to process your personal data.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-1">
                      Right to be Informed
                    </p>
                    <p className="text-gray-700 text-sm">
                      Be informed about how we collect and use your personal
                      data (as outlined in this policy).
                    </p>
                  </div>
                </div>
                <div className="flex p-4 bg-[#4DA9FF]/5 rounded-lg">
                  <div className="shrink-0 mr-4">
                    <svg
                      className="h-6 w-6 text-[#4DA9FF]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    To exercise any of these rights, please contact us using the
                    details provided in Section 11. We will respond to your
                    request within the timeframe required by the PDPL (typically
                    one month), subject to verification of your identity.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiClock className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    7. Data Retention
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 mb-4">
                  <p className="text-gray-700 mb-4">
                    We will only retain your personal data for as long as
                    reasonably necessary to fulfill the purposes we collected it
                    for, including for the purposes of satisfying any legal,
                    regulatory, tax, accounting, or reporting requirements. We
                    may retain your personal data for a longer period in the
                    event of a complaint or if we reasonably believe there is a
                    prospect of litigation in respect to our relationship with
                    you.
                  </p>
                  <p className="text-gray-700">
                    Account information is generally retained while your account
                    is active, and transaction data is retained for a period
                    necessary to comply with legal obligations (e.g., typically
                    5-7 years for financial records).
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiAlertTriangle className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    8. Data Breach Notification
                  </h3>
                </div>
                <div className="flex p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-gray-700">
                    In the unlikely event of a personal data breach that is
                    likely to result in a risk to your rights and freedoms, we
                    are committed to notifying the UAE Data Office and affected
                    individuals as required by the PDPL and applicable
                    regulations.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <svg
                      className="text-[#4DA9FF] h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {"9. Children's Privacy"}
                  </h3>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    The Platform is not intended for use by individuals under
                    the age of 18 (the typical age of contractual capacity in
                    the UAE). We do not knowingly collect personal data from
                    children under the age of 16 without verifiable parental
                    consent. If you believe we may have collected information
                    from a child under 16 without proper consent, please contact
                    us immediately so we can take appropriate action. We may use
                    age verification measures where appropriate.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <svg
                      className="text-[#4DA9FF] h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    10. Governing Law
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    This Privacy Policy and our data processing practices are
                    governed by the laws of the United Arab Emirates, including
                    specifically the Federal Decree-Law No. 45 of 2021 on the
                    Protection of Personal Data (PDPL) and its implementing
                    regulations.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <FiHelpCircle className="text-[#4DA9FF] h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    11. Contact Us for Privacy Matters
                  </h3>
                </div>
                <div className="bg-[#4DA9FF]/5 rounded-lg p-4 border border-[#4DA9FF]/20">
                  <p className="text-gray-700 mb-4">
                    If you have any questions about this Privacy Policy, our
                    data practices, or wish to exercise your data protection
                    rights, please contact us at:
                  </p>
                  <p className="font-medium text-[#4DA9FF] text-center text-lg">
                    privacy@robomarket.ae
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-[#4DA9FF]/10 p-2 rounded-md">
                    <svg
                      className="text-[#4DA9FF] h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    12. Policy Updates
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-4">
                    We may update this Privacy Policy from time to time to
                    reflect changes in our practices or legal requirements. We
                    will notify you of any material changes by posting the
                    {
                      'updated policy on the Platform and updating the "Effective\ '
                    }
                    {
                      'Date" at the top. We encourage you to review this policy '
                    }
                    periodically.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-[#4DA9FF]/5 rounded-lg shadow-md border border-[#4DA9FF]/20">
              <p className="text-gray-700 text-center text-lg font-medium">
                Thank you for trusting RoboMarket with your information. We are
                dedicated to keeping your data safe and secure.
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-8 text-right italic">
              Last Updated: May 20, 2025
            </p>
          </div>
        </PolicyLayout>
      </main>
      <Footer />
    </div>
  );
}
