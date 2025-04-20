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
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '../../../components/Navbar'
import { useUser } from '../../user-context'

const MotionBox = motion(Box)

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'individual',
    bio: '',
    location: ''
  })
  const { setUser } = useUser()
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // This is a mock sign-up - in a real app, you'd call your authentication API
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      type: formData.type as 'individual' | 'vendor',
      bio: formData.bio,
      location: formData.location,
      ecoScore: 7.5,
      totalImpact: {
        wasteSaved: 0,
        co2Reduced: 0,
        treesPlanted: 0
      }
    }

    setUser(mockUser)
    
    toast({
      title: 'Account created.',
      description: "We've created your account for you.",
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
              <Heading size="xl">Create Account</Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')}>
                Join our community of eco-conscious individuals and businesses
              </Text>

              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </FormControl>

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

                  <FormControl isRequired>
                    <FormLabel>Account Type</FormLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="individual">Individual</option>
                      <option value="vendor">Eco-friendly Vendor</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Bio</FormLabel>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself or your business..."
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="eco"
                    size="lg"
                    width="full"
                    mt={6}
                  >
                    Sign Up
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  )
}