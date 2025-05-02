import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Impact Detector',
  description: 'Dashboard which can show the impact of a crash in pro cycling',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="px-4 sm:px-6 md:px-8 lg:px-12">{children}</body>
    </html>
  )
}
