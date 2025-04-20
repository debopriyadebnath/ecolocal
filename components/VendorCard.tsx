'use client'

import { 
  Box, 
  Image, 
  Text, 
  Badge, 
  Flex, 
  VStack, 
  Icon, 
  Button, 
  useToast, 
  HStack,
  useColorModeValue
} from '@chakra-ui/react'
import { FaStar, FaLeaf, FaMapMarkerAlt, FaHeart, FaComments, FaRecycle } from 'react-icons/fa'
import { useState } from 'react'
import { useLanguage } from '../app/language-context'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface VendorCardProps {
  name: string
  image: string
  ecoScore: number
  distance: number
  category: string
  rating: number
  specialties: string[]
  priceRange?: string
  location: string
  cuisineType?: string
  isFeatured?: boolean
  acceptedWasteTypes?: string[]
}

const MotionBox = motion(Box)

export default function VendorCard({ 
  name, 
  image, 
  ecoScore, 
  distance, 
  category,
  rating,
  specialties,
  priceRange,
  location,
  cuisineType,
  isFeatured,
  acceptedWasteTypes = []
}: VendorCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const toast = useToast()
  const { t } = useLanguage()
  const router = useRouter()
  
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast({
      title: isLiked ? t('removedFromFavorites') : t('addedToFavorites'),
      status: isLiked ? 'info' : 'success',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right'
    })
  }

  const handleChatClick = () => {
    router.push('/chat')
  }

  return (
    <MotionBox
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="lg"
      position="relative"
    >
      {isFeatured && (
        <Badge
          position="absolute"
          top={4}
          right={4}
          colorScheme="green"
          variant="solid"
          borderRadius="full"
          px={3}
          py={1}
          zIndex={1}
        >
          {t('featured')}
        </Badge>
      )}

      <Box position="relative" h="200px">
        <Image
          src={image}
          alt={name}
          objectFit="cover"
          w="full"
          h="full"
          transition="transform 0.3s ease"
          _hover={{ transform: 'scale(1.05)' }}
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
          p={4}
        >
          <Flex justify="space-between" align="center">
            <Badge colorScheme="green" fontSize="sm" borderRadius="full" px={2}>
              <Flex align="center" gap={1}>
                <Icon as={FaLeaf} />
                <Text>{ecoScore.toFixed(1)}</Text>
              </Flex>
            </Badge>
            <Badge colorScheme="yellow" fontSize="sm" borderRadius="full" px={2}>
              <Flex align="center" gap={1}>
                <Icon as={FaStar} />
                <Text>{rating}</Text>
              </Flex>
            </Badge>
          </Flex>
        </Box>
      </Box>

      <VStack align="stretch" p={4} spacing={3}>
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold" noOfLines={1}>
            {name}
          </Text>
          <Button
            size="sm"
            variant="ghost"
            colorScheme={isLiked ? 'red' : 'gray'}
            onClick={handleLike}
          >
            <Icon as={FaHeart} />
          </Button>
        </Flex>

        <HStack spacing={2} color={textColor}>
          <Icon as={FaMapMarkerAlt} />
          <Text fontSize="sm">
            {location} • {distance} km
          </Text>
        </HStack>

        <Box>
          <Text fontSize="sm" color={textColor} mb={2}>
            {category} {cuisineType && `• ${cuisineType}`}
          </Text>
          <Flex gap={2} flexWrap="wrap">
            {specialties.map((specialty, index) => (
              <Badge
                key={index}
                colorScheme="eco"
                variant="subtle"
                borderRadius="full"
                px={2}
                py={1}
                fontSize="xs"
              >
                {specialty}
              </Badge>
            ))}
          </Flex>
        </Box>

        {acceptedWasteTypes && acceptedWasteTypes.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              {t('acceptedWasteTypes')}:
            </Text>
            <Flex gap={2} flexWrap="wrap">
              {acceptedWasteTypes.map((wasteType, index) => (
                <Badge
                  key={index}
                  colorScheme="purple"
                  variant="subtle"
                  borderRadius="full"
                  px={2}
                  py={1}
                  fontSize="xs"
                >
                  {wasteType}
                </Badge>
              ))}
            </Flex>
          </Box>
        )}

        <Flex justify="space-between" mt={2}>
          <Button
            size="sm"
            colorScheme="eco"
            leftIcon={<FaComments />}
            variant="outline"
            onClick={handleChatClick}
          >
            {t('chat')}
          </Button>
          <Button
            size="sm"
            colorScheme="eco"
            leftIcon={<FaRecycle />}
            onClick={() => {
              router.push({
                pathname: '/chat',
                query: { vendor: name }
              })
            }}
          >
            {t('sellWaste')}
          </Button>
        </Flex>
      </VStack>
    </MotionBox>
  )
}