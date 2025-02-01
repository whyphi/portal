import '../../globals.css'
import type { Metadata } from 'next'


export const metadata: Metadata = {
    title: 'Whyphi - Analytics',
    description: "Whyphi's Analytics Overview Page",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <div className="flex flex-col mx-auto justify-center">
            {children}
        </div>


    )
}
