import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Whyphi - Rush',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <div className="flex flex-col justify-center max-w-screen-lg">
      {children}
    </div>


  )
}
