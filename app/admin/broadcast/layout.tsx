import '../../globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Whyphi - Broadcast',
    description: "Whyphi's Admin",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
      <>
        {children}
      </>
    )
}
