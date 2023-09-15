import '../../globals.css'
import type { Metadata } from 'next'
import Navbar from "@/components/admin/NavSidebar"
import Sidebar from '@/components/admin/Sidebar'

export const metadata: Metadata = {
    title: 'Whyphi - Create',
    description: "Whyphi's Admin",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <div className="flex flex-col mx-auto justify-center p-6">
            {children}
        </div>


    )
}
