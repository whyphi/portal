"use client"
import { useSession, signIn } from "next-auth/react"
import Loader from '@/components/Loader';

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false // Disable automatic pageview capture, as we capture manually
  })
}

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


export function PHProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}