'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { ReactNode } from 'react'

const theme = extendTheme({
  colors: {
    eco: {
      50: '#f0fdf4',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d'
    }
  }
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
}