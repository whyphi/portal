'use client'
import '../globals.css'
import NavSidebar from "@/components/admin/NavSidebar";
import { SessionProvider } from "next-auth/react";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-w-screen">
        <SessionProvider>
          <NavSidebar />
          <div className="p-4 sm:ml-64 mt-14">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>

  )
}
