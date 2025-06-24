import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
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
  fonts: {
    heading: 'var(--font-inter)',
    body: 'var(--font-inter)',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      variants: {
        solid: {
          bg: 'eco.500',
          color: 'white',
          _hover: {
            bg: 'eco.600',
          },
        },
      },
    },
  },
})

export default theme