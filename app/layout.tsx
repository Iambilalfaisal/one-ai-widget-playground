import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: { default: 'Acme Cloud · One-AI Widget Playground', template: '%s · Widget Playground' },
  description: 'A demo website with the One-AI chat widget installed, built for QA to test every widget feature.',
  robots: { index: false, follow: false },
}

// Shared shell only. The demo site (header, footer, widget loader) lives in
// app/(site)/layout.tsx; the chat window iframe (app/(embed)) stays bare.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
