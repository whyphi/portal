import '../../globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Whyphi - Family Tree',
    description: "Whyphi - Family Tree",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col mx-auto justify-center max-w-screen-lg">
            {children}
        </div>
    )
}
