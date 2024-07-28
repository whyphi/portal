import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Whyphi - Rush Analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <div className="flex flex-col justify-center max-w-screen-xl">
      {children}
    </div>


  )
}
