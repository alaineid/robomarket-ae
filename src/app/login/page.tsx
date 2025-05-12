// filepath: /Users/aeid/Documents/Algorythm/apps/robomarket-ae/src/app/login/page.tsx
import LoginForm from '@/components/auth/LoginForm';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | RoboMarket',
  description: 'Login to your RoboMarket account to manage orders and shop for robots.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Login', href: '/login' },
            ]}
          />
          
          <div className="max-w-md mx-auto mt-10 mb-16">
            <LoginForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}