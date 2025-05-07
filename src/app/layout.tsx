import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RoboMarket AE - Premium Humanoid Robots',
  description: 'Shop for premium humanoid robots with advanced AI capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Using plain vanilla HTML here to avoid any hydration issues with the html tag
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
