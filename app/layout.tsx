import type { Metadata } from "next";
import { CookiesProvider } from 'next-client-cookies/server'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Training Track',
  description: 'Controle a carga de treino do seu atleta',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-br' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <CookiesProvider>{children}</CookiesProvider>
        <Toaster />
      </body>
    </html>
  )
}
