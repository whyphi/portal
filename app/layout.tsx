'use client'
import './globals.css'
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from './contexts/AuthContext';
import { PHProvider } from './providers';
import dynamic from 'next/dynamic'

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <PHProvider>
        <body className="min-w-screen">
          <SessionProvider>
            <PostHogPageView />
            {children}
          </SessionProvider>
        </body>
      </PHProvider>

    </html >

  )
}
