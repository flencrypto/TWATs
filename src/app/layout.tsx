import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { AppDataProvider } from '@/lib/data-context'
import { PWARegister } from '@/components/PWARegister'

export const metadata: Metadata = {
  title: 'TWATS — The Work and Therapy System',
  description: 'Trade management and wellbeing platform for UK tradespeople',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TWATS',
  },
  formatDetection: { telephone: false },
  icons: {
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <SessionProvider>
          <AppDataProvider>
            {children}
          </AppDataProvider>
        </SessionProvider>
        <PWARegister />
      </body>
    </html>
  )
}
