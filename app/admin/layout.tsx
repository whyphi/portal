'use client'
import '../globals.css'
import NavSidebar from "@/components/admin/NavSidebar";
import { useSession, signIn } from "next-auth/react"
import Loader from '@/components/Loader';

export default function RootLayout({
  children
}: {
  children: React.ReactNode,
}) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Loader />
  }

  if (status === "unauthenticated") {
    signIn('google')
    return
  }

  return (
    <>
      <NavSidebar />
      <div className="p-8 sm:ml-64 mt-14">
        {children}
      </div>
    </>

  )
}
