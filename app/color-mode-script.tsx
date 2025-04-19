'use client'

import { ColorModeScript } from '@chakra-ui/react'
import { theme } from './providers'

export function ChakraColorModeScript() {
  return <ColorModeScript initialColorMode={theme.config.initialColorMode} />
}