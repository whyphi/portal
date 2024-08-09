'use client'
import './globals.css'
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from './contexts/AuthContext';
import { PHProvider } from './providers';
import dynamic from 'next/dynamic'
import { Flowbite, ThemeModeScript } from 'flowbite-react';

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <PHProvider>
        <body className="min-w-screen">
          <SessionProvider>
            <PostHogPageView />
            <Flowbite>
              {children}
            </Flowbite>
          </SessionProvider>
        </body>
      </PHProvider>

    </html >

  )
}
