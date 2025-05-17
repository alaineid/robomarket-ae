"use client";

import React from "react";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import { commonLayoutStyles } from "@/styles/commonStyles";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className={commonLayoutStyles.mainContent}>
        {/* Hero Section */}
        <PageHero
          title="Privacy Policy"
          description="We are committed to protecting your privacy. Learn how we collect, use, and safeguard your information."
          breadcrumbItems={[
            { label: "Home", href: "/" },
            { label: "Privacy", href: "/privacy", active: true },
          ]}
        />

        {/* Privacy Policy Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-[2400px]">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
              <div className="prose max-w-none">
                <p className="lead">
                  ROBOMARKET (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;)
                  is committed to protecting your privacy. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you visit our website and use our platform
                  (collectively, the &quot;Platform&quot;). We handle your
                  personal data in accordance with applicable data protection
                  laws, primarily the UAE Federal Decree-Law No. 45 of 2021 on
                  the Protection of Personal Data (the &quot;PDPL&quot;). Please
                  read this policy carefully.
                </p>

                <p className="text-gray-600 mb-6">
                  We are committed to protecting your privacy. This Privacy
                  Policy explains how RoboMarket (&quot;we&quot;,
                  &quot;us&quot;, or &quot;our&quot;) collects, uses, and
                  safeguards your information when you visit our website (the
                  &quot;Site&quot;) and use our services.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  1. What Personal Data We Collect
                </h2>
                <p>
                  We may collect the following categories of personal data about
                  you:
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Identity Data:</strong> Full name.
                  </li>
                  <li>
                    <strong>Contact Data:</strong> Email address, phone number,
                    shipping address, billing address.
                  </li>
                  <li>
                    <strong>Transaction Data:</strong> Details about products
                    you purchase, order history, payment method information
                    (processed securely by third-party PCI-compliant payment
                    gateways; we do not store your full credit card details).
                  </li>
                  <li>
                    <strong>Technical Data:</strong> Internet protocol (IP)
                    address, browser type and version, time zone setting and
                    location, browser plug-in types and versions, operating
                    system and platform, and other technology on the devices you
                    use to access the Platform. (Collected partly via cookies -
                    see Section 4).
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Information about how you use
                    our website and Platform, including browsing patterns and
                    product interests (&quot;preferences&quot;).
                  </li>
                  <li>
                    <strong>Communication Data:</strong> Records of your
                    communications with us for customer support or inquiries.
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  2. How We Use Your Personal Data
                </h2>
                <p>
                  We use your personal data for the following purposes, based on
                  legitimate legal grounds under the PDPL:
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>
                      To Provide and Manage Services (Performance of Contract):
                    </strong>{" "}
                    Process your orders, manage payments, facilitate shipping
                    and delivery by sharing necessary details (see Section 5)
                    with Manufacturers and logistics partners, manage your
                    account.
                  </li>
                  <li>
                    <strong>
                      To Communicate With You (Performance of Contract,
                      Legitimate Interests):
                    </strong>{" "}
                    Send transactional emails (order confirmations, shipping
                    updates, invoices), respond to your inquiries, provide
                    customer support (available in Arabic, English, and French).
                  </li>
                  <li>
                    <strong>
                      To Improve Our Platform (Legitimate Interests):
                    </strong>{" "}
                    Analyze website traffic and user behavior to understand how
                    our Platform is used, improve user experience, enhance our
                    service offerings, and maintain platform security.
                  </li>
                  <li>
                    <strong>To Comply with Legal Obligations:</strong> Meet
                    legal and regulatory requirements.
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  3. Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational security
                  measures designed to protect your personal data from
                  unauthorized access, use, alteration, disclosure, or
                  destruction, in accordance with the requirements of the PDPL.
                  These measures include:
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    Using Secure Sockets Layer (SSL) encryption for data
                    transmission.
                  </li>
                  <li>
                    Working exclusively with PCI-DSS compliant payment
                    processors.
                  </li>
                  <li>
                    Implementing access controls and internal policies to limit
                    access to personal data.
                  </li>
                  <li>Regularly reviewing our security practices.</li>
                </ul>
                <p>
                  While we strive to protect your personal data, no electronic
                  transmission or storage is 100% secure. We cannot guarantee
                  absolute security. We may consider appointing a Data
                  Protection Officer (DPO) based on the scale and nature of our
                  data processing activities as required by law.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  4. Cookies and Tracking Technologies
                </h2>
                <p>
                  Our Platform uses cookies and similar tracking technologies
                  (like web beacons) to enhance user experience, analyze site
                  usage, and support platform functionality. We use essential
                  cookies required for the site to operate (e.g., session
                  management, shopping cart) and non-essential cookies (e.g.,
                  for analytics, language preferences).
                </p>
                <p>
                  We provide detailed information about the cookies we use and
                  allow you to manage your preferences for non-essential cookies
                  through a separate Cookie Policy and a cookie consent banner
                  presented upon your first visit. Your consent is required for
                  deploying non-essential cookies. You can withdraw your consent
                  or change your preferences at any time via our Cookie Policy
                  page or browser settings.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  5. Third-Party Data Sharing
                </h2>
                <p>
                  We do not sell your personal data. We only share your personal
                  data with third parties under the following limited
                  circumstances, ensuring appropriate safeguards are in place:
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Manufacturers:</strong> We share necessary
                    information (e.g., your name, shipping address, email, phone
                    number, order details) with the Manufacturer of the product
                    you ordered, strictly for the purposes of order fulfillment,
                    shipping, providing tracking information, and handling
                    warranty claims or after-sales support as outlined in our
                    other policies.
                  </li>
                  <li>
                    <strong>Logistics Partners:</strong> We share necessary
                    shipping information (e.g., name, address, phone number)
                    with logistics providers designated by the Manufacturer
                    solely for the purpose of delivering your order.
                  </li>
                  <li>
                    <strong>Payment Processors:</strong> We share transaction
                    information with secure third-party payment gateways to
                    process your payments.
                  </li>
                  <li>
                    <strong>Service Providers:</strong> We may share data with
                    trusted third-party service providers who perform functions
                    on our behalf (e.g., website hosting, data analytics,
                    customer service tools), under strict contractual
                    obligations to protect your data and use it only for the
                    purposes we specify.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose your
                    information if required by law, regulation, legal process,
                    or governmental request.
                  </li>
                </ul>
                <p>
                  We require all third parties to respect the security of your
                  personal data and to treat it in accordance with the law,
                  including through Data Processing Agreements (DPAs) where
                  applicable under the PDPL.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">
                  Cross-Border Data Transfers
                </h3>
                <p>
                  Some Manufacturers, logistics partners, or service providers
                  may be located outside the United Arab Emirates. When we
                  transfer your personal data outside the UAE, we ensure a
                  similar degree of protection is afforded to it by implementing
                  safeguards required by the PDPL. This may include transferring
                  data to countries deemed adequate by the UAE authorities,
                  using specific contractual clauses approved for use in the
                  UAE, or obtaining your explicit consent for the transfer after
                  informing you of the risks.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  6. Your Data Protection Rights
                </h2>
                <p>
                  Under the UAE PDPL, you have the following rights regarding
                  your personal data:
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Right to Access:</strong> Request access to the
                    personal data we hold about you.
                  </li>
                  <li>
                    <strong>Right to Rectification:</strong> Request correction
                    of inaccurate or incomplete personal data
                    (&apos;modification&apos;).
                  </li>
                  <li>
                    <strong>Right to Erasure:</strong> Request deletion of your
                    personal data (&apos;right to be forgotten&apos;), subject
                    to certain legal limitations (e.g., data needed for ongoing
                    transactions or legal compliance).
                  </li>
                  <li>
                    <strong>Right to Restrict Processing:</strong> Request the
                    restriction of processing your personal data under certain
                    conditions.
                  </li>
                  <li>
                    <strong>Right to Object to Processing:</strong> Object to
                    the processing of your personal data based on legitimate
                    interests or for direct marketing purposes.
                  </li>
                  <li>
                    <strong>Right to Data Portability:</strong> Request the
                    transfer of your personal data to you or a third party in a
                    structured, commonly used, machine-readable format (where
                    processing is based on consent or contract and carried out
                    by automated means).
                  </li>
                  <li>
                    <strong>Right to Withdraw Consent:</strong> Withdraw your
                    consent at any time where we rely on consent to process your
                    personal data (this will not affect the lawfulness of
                    processing based on consent before its withdrawal).
                  </li>
                  <li>
                    <strong>Right to be Informed:</strong> Be informed about how
                    we collect and use your personal data (as outlined in this
                    policy).
                  </li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us using the
                  details provided in Section 11. We will respond to your
                  request within the timeframe required by the PDPL (typically
                  one month), subject to verification of your identity.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  7. Data Retention
                </h2>
                <p>
                  We will only retain your personal data for as long as
                  reasonably necessary to fulfill the purposes we collected it
                  for, including for the purposes of satisfying any legal,
                  regulatory, tax, accounting, or reporting requirements. We may
                  retain your personal data for a longer period in the event of
                  a complaint or if we reasonably believe there is a prospect of
                  litigation in respect to our relationship with you.
                </p>
                <p>
                  Account information is generally retained while your account
                  is active, and transaction data is retained for a period
                  necessary to comply with legal obligations (e.g., typically
                  5-7 years for financial records).
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  8. Data Breach Notification
                </h2>
                <p>
                  In the unlikely event of a personal data breach that is likely
                  to result in a risk to your rights and freedoms, we are
                  committed to notifying the UAE Data Office and affected
                  individuals as required by the PDPL and applicable
                  regulations.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  9. Children&apos;s Privacy
                </h2>
                <p>
                  The Platform is not intended for use by individuals under the
                  age of 18 (the typical age of contractual capacity in the
                  UAE). We do not knowingly collect personal data from children
                  under the age of 16 without verifiable parental consent. If
                  you believe we may have collected information from a child
                  under 16 without proper consent, please contact us immediately
                  so we can take appropriate action. We may use age verification
                  measures where appropriate.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  10. Governing Law
                </h2>
                <p>
                  This Privacy Policy and our data processing practices are
                  governed by the laws of the United Arab Emirates, including
                  specifically the Federal Decree-Law No. 45 of 2021 on the
                  Protection of Personal Data (PDPL) and its implementing
                  regulations.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  11. Contact Us for Privacy Matters
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, our data
                  practices, or wish to exercise your data protection rights,
                  please contact us at:{" "}
                  <a
                    href="mailto:privacy@robomarket.ae"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    privacy@robomarket.ae
                  </a>
                </p>

                <p className="text-gray-600 mb-6">
                  By using our Site, you consent to the terms of this Privacy
                  Policy. If you do not agree with our practices, please do not
                  use our Site.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">
                  12. Policy Updates
                </h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices or legal requirements. We will notify
                  you of any material changes by posting the updated policy on
                  the Platform and updating the &quot;Effective Date&quot; at
                  the top. We encourage you to review this policy periodically.
                </p>

                <p className="text-gray-600 mb-6">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new policy on this
                  page. You are advised to review this page periodically for any
                  changes. Changes to this Privacy Policy are effective when
                  they are posted on this page.
                </p>

                <p className="text-gray-600 mb-6">
                  If you have any questions about this Privacy Policy, please
                  contact us at support@robomarket.ae.
                </p>

                <p className="text-gray-600">
                  Thank you for trusting RoboMarket with your information. We
                  are dedicated to keeping your data safe and secure.
                </p>
              </div>
            </div>

            {/* Related Links */}
            <div className="max-w-4xl mx-auto mt-12">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Related Policies
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/terms"
                  className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-4xl mx-auto mt-12 text-center">
              <h3 className="text-2xl font-bold mb-6">
                Ready to explore our products?
              </h3>
              <Link
                href="/shop"
                className="inline-block bg-[#4DA9FF] hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Browse Our Shop
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
