'use client'

import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Image, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  SimpleGrid, 
  Icon, 
  useColorModeValue 
} from '@chakra-ui/react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { FaLeaf, FaRecycle, FaHandshake, FaSearch } from 'react-icons/fa'
import { ethers } from 'ethers';
import WebcamComponent from '../components/WebcamComponent'

const Feature = ({ icon, title, description }: { icon: any; title: string; description: string }) => (
  <VStack
    align="start"
    p={6}
    bg="white"
    borderRadius="lg"
    boxShadow="sm"
    spacing={4}
    _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s' }}
  >
    <Icon as={icon} w={8} h={8} color="eco.500" />
    <Heading size="md">{title}</Heading>
    <Text color="gray.600">{description}</Text>
  </VStack>
)

export default function Home() {
  const bgGradient = useColorModeValue(
    'linear(to-r, eco.400, eco.600)',
    'linear(to-r, eco.500, eco.700)'
  )

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <WebcamComponent />
      
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
            gap={8}
          >
            <VStack align={{ base: 'center', md: 'start' }} spacing={6} maxW="2xl">
              <Heading
                as="h1"
                size="2xl"
                textAlign={{ base: 'center', md: 'left' }}
              >
                Discover Eco-Friendly Vendors Near You
              </Heading>
              <Text fontSize="xl" textAlign={{ base: 'center', md: 'left' }}>
                Support local businesses that care about the environment. Find sustainable products and services in your community.
              </Text>
              <HStack spacing={4}>
                <Link href="/vendors" passHref>
                  <Button size="lg" colorScheme="whiteAlpha" variant="solid">
                    Find Vendors
                  </Button>
                </Link>
                <Link href="/chat" passHref>
                  <Button size="lg" variant="outline" color="white" borderColor="white">
                    Chat with EcoBot
                  </Button>
                </Link>
              </HStack>
            </VStack>
            <Box
              w={{ base: 'full', md: '50%' }}
              h="400px"
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1511795409834-432f7b72bcf4"
                alt="Eco-friendly market"
                objectFit="cover"
                w="full"
                h="full"
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center" maxW="2xl">
            <Heading>Why Choose EcoLocal?</Heading>
            <Text color="gray.600" fontSize="lg">
              We make it easy to find and support businesses that share your values
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            <Feature
              icon={FaLeaf}
              title="Sustainable Products"
              description="Find vendors offering eco-friendly and sustainable products"
            />
            <Feature
              icon={FaRecycle}
              title="Zero Waste"
              description="Discover businesses committed to reducing waste"
            />
            <Feature
              icon={FaHandshake}
              title="Local Community"
              description="Support your local economy and build community"
            />
            <Feature
              icon={FaSearch}
              title="Easy Discovery"
              description="Quickly find vendors that match your values"
            />
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg="eco.50" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading>Ready to Make a Difference?</Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              Join our community of eco-conscious consumers and help build a more sustainable future.
            </Text>
            <Link href="/vendors" passHref>
              <Button size="lg" colorScheme="green">
                Get Started
              </Button>
            </Link>
          </VStack>
        </Container>
      </Box>

      {/* Webcam Component Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <WebcamComponent />
        </Container>
      </Box>
    </Box>
  )
}