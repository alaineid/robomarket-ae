import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

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
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />        
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
