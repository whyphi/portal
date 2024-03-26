import '../../globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Whyphi - QR',
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
