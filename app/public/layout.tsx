"use client"
import PublicNavSidebar from '@/components/public/PublicNavSidebar'
import '../globals.css'
import AdminSessionProvider from '../providers'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AdminSessionProvider>
        <PublicNavSidebar />
        <body className="min-w-screen min-h-screen mt-16">
            {children}
        </body>
      </AdminSessionProvider>
    </html>
  )
}
