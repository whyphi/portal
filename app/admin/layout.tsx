import '../globals.css'
import type { Metadata } from 'next'
import Navbar from "@/components/admin/Navbar"
import Sidebar from '@/components/admin/Sidebar'

export const metadata: Metadata = {
  title: 'Whyphi Admin',
  description: "Whyphi's Admin",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-w-screen min-h-screen m-4">
        <Navbar />
        <Sidebar />
        <div className="p-4 sm:ml-64 mt-14">
          {children}
        </div>

      </body>
    </html>
  )
}
