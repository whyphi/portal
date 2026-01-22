"use client"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-w-screen min-h-screen">
      {children}
    </div>
  )
}
