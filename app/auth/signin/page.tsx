'use client'

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  HStack,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '../../../components/Navbar'
import { useUser } from '../../user-context'

const MotionBox = motion(Box)

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { setUser } = useUser()
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // This is a mock sign-in - in a real app, you'd call your authentication API
    const mockUser = {
      id: '123456789',
      name: 'John Doe',
      email: formData.email,
      type: 'individual' as const,
      bio: 'Passionate about sustainability and eco-friendly living',
      location: 'New York, USA',
      ecoScore: 8.5,
      totalImpact: {
        wasteSaved: 250,
        co2Reduced: 500,
        treesPlanted: 10
      }
    }

    setUser(mockUser)
    
    toast({
      title: 'Welcome back!',
      description: 'You have successfully signed in.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })

    router.push('/')
  }

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Navbar />
      <Container maxW="container.md" py={12}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            bg={bgColor}
            p={8}
            borderRadius="2xl"
            boxShadow="xl"
            borderWidth={1}
            borderColor={borderColor}
          >
            <VStack spacing={6} align="stretch">
              <Heading size="xl">Welcome Back</Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')}>
                Sign in to continue your eco-friendly journey
              </Text>

              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="eco"
                    size="lg"
                    width="full"
                    mt={6}
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>

              <HStack justify="space-between" pt={4}>
                <Link
                  color="eco.500"
                  href="/auth/signup"
                  _hover={{ textDecoration: 'none', color: 'eco.600' }}
                >
                  Don't have an account? Sign up
                </Link>
                <Link
                  color="eco.500"
                  href="/auth/forgot-password"
                  _hover={{ textDecoration: 'none', color: 'eco.600' }}
                >
                  Forgot password?
                </Link>
              </HStack>
            </VStack>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  )
}