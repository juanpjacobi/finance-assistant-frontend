import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finance Assistant',
  description: 'Personal finance API with LLM integration',
}

const nav = [
  { href: '/', label: 'Dashboard' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/categories', label: 'Categories' },
  { href: '/budgets', label: 'Budgets' },
  { href: '/documents', label: 'Documents' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <nav className="border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-8 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
            <span className="font-bold text-slate-900 text-base tracking-tight shrink-0">
              💰 Finance Assistant
            </span>
            <div className="flex flex-wrap gap-1 text-sm">
              {nav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 rounded-md text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="mx-auto max-w-6xl px-4 sm:px-8 py-6 sm:py-8">
          {children}
        </div>
      </body>
    </html>
  )
}
