import { Box, Image, Text, Badge, Flex, VStack } from '@chakra-ui/react'

interface VendorCardProps {
  name: string
  image: string
  ecoScore: number
  distance: number
}

const VendorCard = ({ name, image, ecoScore, distance }: VendorCardProps) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
    >
      <Image src={image} alt={name} height="200px" width="100%" objectFit="cover" />

      <VStack p={4} align="stretch" spacing={2}>
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold">
            {name}
          </Text>
          <Badge colorScheme="green" fontSize="md">
            {ecoScore}/10
          </Badge>
        </Flex>

        <Text color="gray.600">{distance} km away</Text>

        <Flex gap={2} wrap="wrap">
          <Badge colorScheme="blue">Organic</Badge>
          <Badge colorScheme="purple">Local</Badge>
          <Badge colorScheme="orange">Sustainable</Badge>
        </Flex>
      </VStack>
    </Box>
  )
}

export default VendorCard 