import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './NavBar/NavBar'
import Footer from './Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UNa Ayuda',
  description: 'Busca profesionales o expertos cuando lo necesites',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
      <NavBar/>
      <main className='p-4 max-w-7xl m-auto min-w-[300px]'>{children}</main>
      <Footer/>
      </body>
    </html>
  )
}
