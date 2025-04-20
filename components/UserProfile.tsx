'use client'

import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react'
import { FaRecycle, FaTree, FaLeaf } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useLanguage } from '../app/language-context'

const MotionBox = motion(Box)

interface UserProfileProps {
  user: {
    name: string
    email: string
    type: 'individual' | 'vendor'
    avatarUrl?: string
    bio?: string
    location?: string
    ecoScore?: number
    totalImpact?: {
      wasteSaved: number
      co2Reduced: number
      treesPlanted: number
    }
  }
}

export default function UserProfile({ user }: UserProfileProps) {
  const { t } = useLanguage()
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        bg={cardBg}
        borderRadius="2xl"
        boxShadow="xl"
        overflow="hidden"
        borderWidth={1}
        borderColor={borderColor}
      >
        <Box p={6}>
          <VStack spacing={6} align="stretch">
            <HStack spacing={4}>
              <Avatar
                size="xl"
                name={user.name}
                src={user.avatarUrl}
                bg="eco.500"
              />
              <VStack align="start" spacing={2}>
                <Text fontSize="2xl" fontWeight="bold">
                  {user.name}
                </Text>
                <Badge colorScheme={user.type === 'vendor' ? 'eco' : 'blue'}>
                  {user.type === 'vendor' ? t('vendor') : t('individual')}
                </Badge>
                {user.location && (
                  <Text fontSize="sm" color="gray.500">
                    📍 {user.location}
                  </Text>
                )}
              </VStack>
            </HStack>

            {user.bio && (
              <Text color={useColorModeValue('gray.600', 'gray.300')}>
                {user.bio}
              </Text>
            )}

            {user.ecoScore !== undefined && (
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="medium">{t('ecoScore')}</Text>
                  <Text color={useColorModeValue('eco.500', 'eco.300')}>
                    {user.ecoScore}/10
                  </Text>
                </HStack>
                <Progress
                  value={user.ecoScore * 10}
                  colorScheme="eco"
                  borderRadius="full"
                  size="sm"
                />
              </Box>
            )}

            {user.totalImpact && (
              <SimpleGrid columns={3} gap={4} pt={4}>
                <Stat>
                  <StatLabel>{t('wasteSaved')}</StatLabel>
                  <StatNumber>{user.totalImpact.wasteSaved}kg</StatNumber>
                  <StatHelpText>
                    <Icon as={FaRecycle} color="eco.500" mr={1} />
                    {t('recycled')}
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>{t('co2Reduced')}</StatLabel>
                  <StatNumber>{user.totalImpact.co2Reduced}kg</StatNumber>
                  <StatHelpText>
                    <Icon as={FaLeaf} color="eco.500" mr={1} />
                    {t('reduced')}
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>{t('treesPlanted')}</StatLabel>
                  <StatNumber>{user.totalImpact.treesPlanted}</StatNumber>
                  <StatHelpText>
                    <Icon as={FaTree} color="eco.500" mr={1} />
                    {t('planted')}
                  </StatHelpText>
                </Stat>
              </SimpleGrid>
            )}
          </VStack>
        </Box>
      </Box>
    </MotionBox>
  )
}