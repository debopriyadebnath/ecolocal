import {
  Box,
  Container,
  VStack,
  Text,
  HStack,
  Badge,
  Button,
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Navbar from '../../components/Navbar'

// Dynamically import Webcam to avoid SSR issues
const Webcam = dynamic(() => import('react-webcam'), {
  ssr: false,
})

export default function Gesture() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          <Box
            bg="white"
            borderRadius="lg"
            p={4}
            boxShadow="sm"
            textAlign="center"
          >
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Gesture Control
            </Text>
            <Box
              w="full"
              h="400px"
              bg="black"
              borderRadius="md"
              overflow="hidden"
              position="relative"
            >
              <Webcam
                audio={false}
                width="100%"
                height="100%"
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Box>

          <Box
            bg="white"
            borderRadius="lg"
            p={4}
            boxShadow="sm"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Available Gestures
            </Text>
            <HStack spacing={4} wrap="wrap">
              <Badge
                colorScheme="green"
                fontSize="md"
                p={2}
                borderRadius="md"
              >
                Swipe Left
              </Badge>
              <Badge
                colorScheme="green"
                fontSize="md"
                p={2}
                borderRadius="md"
              >
                Swipe Right
              </Badge>
              <Badge
                colorScheme="green"
                fontSize="md"
                p={2}
                borderRadius="md"
              >
                Thumbs Up
              </Badge>
              <Badge
                colorScheme="green"
                fontSize="md"
                p={2}
                borderRadius="md"
              >
                Peace ✌
              </Badge>
            </HStack>
          </Box>

          <Box
            bg="white"
            borderRadius="lg"
            p={4}
            boxShadow="sm"
            textAlign="center"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Gesture Status
            </Text>
            <Text color="gray.600">
              Waiting for gesture input...
            </Text>
          </Box>

          <Button colorScheme="green" size="lg">
            Start Gesture Detection
          </Button>
        </VStack>
      </Container>
    </Box>
  )
} 