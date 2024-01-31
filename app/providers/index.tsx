"use client"
import { useSession, signIn } from "next-auth/react"
import Loader from '@/components/Loader';

export default function AdminSessionProvider({
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
      {children}
    </>
  )
}
