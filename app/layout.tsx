import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Deviant Test Harness',
  description: 'Test harness for dev agent interactions',
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
