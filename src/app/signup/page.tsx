import SignupForm from '@/components/auth/SignupForm';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | RoboMarket',
  description: 'Create an account to start shopping for the best robots on RoboMarket.',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Sign Up', href: '/signup' },
            ]}
          />
          
          <div className="max-w-md mx-auto mt-10 mb-16">
            <SignupForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}