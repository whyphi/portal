'use client'
import '../globals.css'
import NavSidebar from "@/components/admin/NavSidebar"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-w-screen min-h-screen">
        <NavSidebar />
        <div className="p-4 sm:ml-64 mt-14">
          {children}
        </div>
      </body>
    </html>
  )
}
