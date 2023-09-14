'use client'
import '../globals.css'
import Navbar from "@/components/admin/Navbar"
import Sidebar from '@/components/admin/Sidebar'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-w-screen min-h-screen">
        <div className='m-4'>
          <Navbar />
          <Sidebar />
          <div className="p-4 sm:ml-64 mt-14">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
