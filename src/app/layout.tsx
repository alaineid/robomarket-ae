import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/auth/AuthProvider'
import ClientProviders from '@/components/providers/ClientProviders'
import { createClient } from "@/supabase/server"; // Supabase client for root layout

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RoboMarket AE - Premium Humanoid Robots',
  description: 'Shop for premium humanoid robots with advanced AI capabilities',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Supabase server client to fetch the initial user state
  const supabase = await createClient(); // Ensure the client is awaited if it returns a Promise
  // Fetch user session on the server.
  // Provides the `serverUser` prop to AuthProvider for initial state.
  const { data: { user } } = await supabase.auth.getUser();
  
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <AuthProvider serverUser={user}>
          <ClientProviders>
            {children}
          </ClientProviders>
        </AuthProvider>
      </body>
    </html>
  )
}