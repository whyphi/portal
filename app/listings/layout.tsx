"use client"
import '../globals.css'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-w-screen min-h-screen">
          {children}
      </body>
    </html>
  )
}
