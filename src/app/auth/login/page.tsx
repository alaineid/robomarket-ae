import LoginForm from "../../../components/auth/LoginForm";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import PageHero from "../../../components/layout/PageHero";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Welcome Back"
          description="Sign in to your account to access your orders, wishlist, and personalized recommendations."
          breadcrumbItems={[
            { label: "Home", href: "/" },
            { label: "Login", href: "/auth/login" },
          ]}
        />

        <div className="container mx-auto px-4 py-6 mb-16 max-w-[2400px]">
          <div className="max-w-6xl mx-auto rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left side: Illustration and benefits */}
              <div className="lg:w-1/2 bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] p-8 sm:p-12 text-white flex flex-col justify-center">
                <div className="mb-8 flex justify-center">
                  <Image
                    src="/images/robot1.png"
                    alt="Robot Assistant"
                    width={240}
                    height={240}
                    className="object-contain drop-shadow-lg"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Welcome Back!
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <svg
                      className="h-6 w-6 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Access your saved robots</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-6 w-6 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Track your orders</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-6 w-6 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Get personalized recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-6 w-6 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Checkout faster with saved info</span>
                  </li>
                </ul>
              </div>

              {/* Right side: Form */}
              <div className="lg:w-1/2 p-6 sm:p-10">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
