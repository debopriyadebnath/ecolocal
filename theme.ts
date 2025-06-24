import { extendTheme, Box, Heading, Text, VStack, Checkbox, Progress, Button, useToast, SimpleGrid } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        bg: 'black',
        color: 'green.200',
        minHeight: '100vh',
      },
      body: {
        bg: 'black',
        color: 'green.200',
      },
    },
  },
  colors: {
    green: {
      50: '#e3ffe3',
      100: '#b3ffb3',
      200: '#6fff6f',
      300: '#39e639',
      400: '#00cc00',
      500: '#009900',
      600: '#007a00',
      700: '#005c00',
      800: '#003d00',
      900: '#001f00',
    },
    black: {
      500: '#000',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: {
          bg: 'green.400',
          color: 'black',
          _hover: {
            bg: 'green.500',
          },
        },
        outline: {
          borderColor: 'green.400',
          color: 'green.200',
          _hover: {
            bg: 'green.900',
          },
        },
      },
    },
  },
});

export default theme;
