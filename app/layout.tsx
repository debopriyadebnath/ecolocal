import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { ChakraColorModeScript } from './color-mode-script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EcoLocal - Discover Eco-Friendly Vendors',
  description: 'Find and support eco-friendly local vendors in your area',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ChakraColorModeScript />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}