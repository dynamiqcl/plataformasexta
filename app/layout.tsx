import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import '@aws-amplify/ui-react/styles.css'
import ConfigureAmplify from './components/ConfigureAmplify'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sistema de Registro de Incidentes',
  description: 'Registro y seguimiento de actos de servicio e incidentes',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-100">
        <ConfigureAmplify />
        {children}
      </body>
    </html>
  )
}
