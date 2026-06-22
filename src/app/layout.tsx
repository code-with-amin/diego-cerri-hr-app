import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { Language } from '@/lib/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HR Admin Dashboard',
  description: 'Internal HR candidate management system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const stored = cookieStore.get('hr_lang')?.value
  const initialLang: Language = stored === 'pt' ? 'pt' : 'en'

  return (
    <html lang={initialLang}>
      <body className={inter.className}>
        <LanguageProvider initialLang={initialLang}>{children}</LanguageProvider>
      </body>
    </html>
  )
}
