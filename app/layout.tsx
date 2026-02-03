import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Lead Gen & Agency Auditor',
  description: 'Automated lead generation and technical audit tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}