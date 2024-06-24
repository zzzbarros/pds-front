import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Toaster, RouterProgressBar } from '@/components/ui'
import { DialogContextRoot } from '@/contexts'
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
        <RouterProgressBar />
        <DialogContextRoot>{children}</DialogContextRoot>
        <Toaster />
      </body>
    </html>
  )
}
