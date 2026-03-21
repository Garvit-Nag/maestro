import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthModalProvider } from "@/lib/auth-modal-context"
import { AuthModal } from "@/components/maestro/auth-modal"
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: 'Maestro — Football Intelligence',
  description: 'Ask anything. Maestro knows.',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased bg-[#0A0A0C] text-white`}>
        <AuthModalProvider>
          {children}
          <AuthModal />
        </AuthModalProvider>
        <Analytics />
      </body>
    </html>
  )
}
