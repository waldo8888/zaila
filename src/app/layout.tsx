import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { DebugTools } from './debug-tools'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zaila',
  description: 'AI-powered operating system for enterprise automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <DebugTools />
      </body>
    </html>
  )
}
