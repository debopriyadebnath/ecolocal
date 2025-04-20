'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { LanguageProvider } from './language-context'
import { OrderProvider } from './order-context'
import { UserProvider } from './user-context'

export const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  colors: {
    eco: {
      50: '#f0f9f0',
      100: '#d8f0d8',
      200: '#b8e6b8',
      300: '#8fd98f',
      400: '#5cc65c',
      500: '#3aad3a',
      600: '#2d8a2d',
      700: '#276e27',
      800: '#245824',
      900: '#1f4a1f',
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <LanguageProvider>
          <UserProvider>
            <OrderProvider>
              {children}
            </OrderProvider>
          </UserProvider>
        </LanguageProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}