import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { WidgetProvider } from '@/components/widget/widget-provider'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: { default: 'Acme Cloud · One-AI Widget Playground', template: '%s · Widget Playground' },
  description: 'A demo website with the One-AI chat widget installed, built for QA to test every widget feature.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <WidgetProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </WidgetProvider>
      </body>
    </html>
  )
}
