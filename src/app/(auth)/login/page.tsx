import LoginForm from '@/components/auth/LoginForm';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Login | RoboMarket',
  description: 'Login to your RoboMarket account to manage orders and shop for robots.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-6 sm:py-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Login', href: '/login' },
            ]}
          />
          
          <div className="mt-8 mb-16">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Welcome Back</h1>
              <p className="text-gray-600 max-w-md mx-auto">Log in to your account to continue your robot shopping experience.</p>
            </div>
            
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Left side: Form */}
                <div className="lg:w-1/2 p-6 sm:p-10 order-2 lg:order-1">
                  <LoginForm />
                </div>
                
                {/* Right side: Illustration and benefits */}
                <div className="lg:w-1/2 bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] p-8 sm:p-12 text-white flex flex-col justify-center order-1 lg:order-2">
                  <div className="mb-8 flex justify-center">
                    <Image 
                      src="/images/robot2.png" 
                      alt="Robot Assistant" 
                      width={200} 
                      height={200}
                      className="object-contain drop-shadow-lg" 
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Discover the Future</h2>
                  <p className="text-white/90 mb-6 text-center">
                    Log in to explore our premium collection of robots and unlock your personalized shopping experience.
                  </p>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-center text-sm font-medium">
                      &quot;RoboMarket offers the most advanced robots with unparalleled service and support.&quot;
                    </p>
                    <p className="text-center text-xs mt-2 opacity-80">— Tech Robotics Magazine</p>
                  </div>
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