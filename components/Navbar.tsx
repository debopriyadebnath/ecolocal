'use client'

import { Box, Flex, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

const Navbar = () => {
  return (
    <Box as="nav" bg="eco.500" color="white" py={4}>
      <Flex
        maxW="container.xl"
        mx="auto"
        px={4}
        justify="space-between"
        align="center"
      >
        <NextLink href="/" passHref>
          <Text fontSize="xl" fontWeight="bold">
            EcoLocal
          </Text>
        </NextLink>
        <Flex gap={6}>
          <NextLink href="/" passHref>
            <Link>Home</Link>
          </NextLink>
          <NextLink href="/vendors" passHref>
            <Link>Vendors</Link>
          </NextLink>
          <NextLink href="/chat" passHref>
            <Link>Chatbot</Link>
          </NextLink>
          <NextLink href="/gesture" passHref>
            <Link>Gesture Control</Link>
          </NextLink>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar 