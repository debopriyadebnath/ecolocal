'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  useColorModeValue,
  Image,
  Badge,
  HStack,
  Icon,
  Tooltip,
  Progress,
  useToast,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  FaLeaf,
  FaMedal,
  FaTrophy,
  FaShareAlt,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaRecycle,
  FaTree,
} from 'react-icons/fa'
import Navbar from '../../components/Navbar'
import { useUser } from '../user-context'
import { useNotification } from '../notification-context'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

interface Badge {
  id: string
  title: string
  description: string
  icon: any
  threshold: number
  type: 'waste' | 'co2' | 'trees'
  color: string
}

const badges: Badge[] = [
  {
    id: 'waste-reducer-1',
    title: 'Waste Warrior',
    description: 'Reduced 100kg of waste',
    icon: FaRecycle,
    threshold: 100,
    type: 'waste',
    color: 'green'
  },
  {
    id: 'carbon-reducer-1',
    title: 'Carbon Champion',
    description: 'Reduced 1000kg of CO2',
    icon: FaLeaf,
    threshold: 1000,
    type: 'co2',
    color: 'blue'
  },
  {
    id: 'tree-planter-1',
    title: 'Forest Friend',
    description: 'Contributed to planting 10 trees',
    icon: FaTree,
    threshold: 10,
    type: 'trees',
    color: 'orange'
  },
  // Add more badges as needed
]

export default function ImpactSharing() {
  const { user } = useUser()
  const { sendNotification } = useNotification()
  const toast = useToast()
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const earnedBadges = badges.filter(badge => {
    if (!user?.totalImpact) return false
    switch (badge.type) {
      case 'waste':
        return user.totalImpact.wasteSaved >= badge.threshold
      case 'co2':
        return user.totalImpact.co2Reduced >= badge.threshold
      case 'trees':
        return user.totalImpact.treesPlanted >= badge.threshold
      default:
        return false
    }
  })

  const shareToSocial = (platform: string) => {
    const message = selectedBadge
      ? `I just earned the ${selectedBadge.title} badge on EcoLocal! Join me in making a sustainable impact!`
      : `Check out my environmental impact on EcoLocal! Together we can make a difference!`
    
    // In a real app, implement proper social sharing
    toast({
      title: 'Shared successfully',
      description: `Your achievement has been shared on ${platform}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    sendNotification(
      'Impact Shared!',
      `Your achievement has been shared on ${platform}`,
      'success'
    )
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Heading>Your Environmental Impact</Heading>
          <Text color={textColor}>Share your achievements and inspire others</Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            <Card bg={bgColor}>
              <CardBody>
                <VStack spacing={6}>
                  <Heading size="md">Your Impact Stats</Heading>

                  <SimpleGrid columns={1} spacing={4} w="full">
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text>Waste Reduced</Text>
                        <Text>{user?.totalImpact?.wasteSaved || 0}kg</Text>
                      </HStack>
                      <Progress
                        value={(user?.totalImpact?.wasteSaved || 0) / 10}
                        colorScheme="green"
                        hasStripe
                      />
                    </Box>

                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text>CO₂ Reduced</Text>
                        <Text>{user?.totalImpact?.co2Reduced || 0}kg</Text>
                      </HStack>
                      <Progress
                        value={(user?.totalImpact?.co2Reduced || 0) / 20}
                        colorScheme="blue"
                        hasStripe
                      />
                    </Box>

                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text>Trees Planted</Text>
                        <Text>{user?.totalImpact?.treesPlanted || 0}</Text>
                      </HStack>
                      <Progress
                        value={(user?.totalImpact?.treesPlanted || 0) * 10}
                        colorScheme="orange"
                        hasStripe
                      />
                    </Box>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={bgColor}>
              <CardBody>
                <VStack spacing={6}>
                  <Heading size="md">Your Badges</Heading>

                  <SimpleGrid columns={2} spacing={4}>
                    {earnedBadges.map((badge) => (
                      <MotionCard
                        key={badge.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        cursor="pointer"
                        onClick={() => setSelectedBadge(badge)}
                        bg={selectedBadge?.id === badge.id ? `${badge.color}.50` : undefined}
                        borderWidth={2}
                        borderColor={selectedBadge?.id === badge.id ? `${badge.color}.500` : 'transparent'}
                      >
                        <CardBody>
                          <VStack>
                            <Icon as={badge.icon} w={8} h={8} color={`${badge.color}.500`} />
                            <Text fontWeight="bold">{badge.title}</Text>
                            <Text fontSize="sm" color={textColor}>
                              {badge.description}
                            </Text>
                          </VStack>
                        </CardBody>
                      </MotionCard>
                    ))}
                  </SimpleGrid>

                  {selectedBadge && (
                    <HStack spacing={4}>
                      <Tooltip label="Share on Twitter">
                        <Button
                          colorScheme="twitter"
                          leftIcon={<FaTwitter />}
                          onClick={() => shareToSocial('Twitter')}
                        >
                          Tweet
                        </Button>
                      </Tooltip>
                      <Tooltip label="Share on Facebook">
                        <Button
                          colorScheme="facebook"
                          leftIcon={<FaFacebook />}
                          onClick={() => shareToSocial('Facebook')}
                        >
                          Share
                        </Button>
                      </Tooltip>
                      <Tooltip label="Share on LinkedIn">
                        <Button
                          colorScheme="linkedin"
                          leftIcon={<FaLinkedin />}
                          onClick={() => shareToSocial('LinkedIn')}
                        >
                          Post
                        </Button>
                      </Tooltip>
                    </HStack>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}
