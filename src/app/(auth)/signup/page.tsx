import SignupForm from '@/components/auth/SignupForm';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sign Up | RoboMarket',
  description: 'Create an account to start shopping for the best robots on RoboMarket.',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-6 sm:py-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Sign Up', href: '/signup' },
            ]}
          />
          
          <div className="mt-8 mb-16">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Create Your Account</h1>
              <p className="text-gray-600 max-w-md mx-auto">Join RoboMarket today and discover the future of robotics at your fingertips.</p>
            </div>
            
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Left side: Illustration and benefits */}
                <div className="lg:w-1/2 bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] p-8 sm:p-12 text-white flex flex-col justify-center">
                  <div className="mb-8 flex justify-center">
                    <Image 
                      src="/images/robot3.png" 
                      alt="Robot Assistant" 
                      width={240} 
                      height={240} 
                      className="object-contain drop-shadow-lg" 
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Why Join RoboMarket?</h2>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Access to exclusive robot deals</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save your favorite robots</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Fast checkout experience</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Order tracking and history</span>
                    </li>
                  </ul>
                </div>
                
                {/* Right side: Form */}
                <div className="lg:w-1/2 p-6 sm:p-10">
                  <SignupForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}