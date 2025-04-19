'use client'

import { useEffect } from 'react'
import { useColorMode } from '@chakra-ui/react'

export function ColorModeScript() {
  const { setColorMode } = useColorMode()
  
  useEffect(() => {
    setColorMode('light')
  }, [setColorMode])

  return null
}