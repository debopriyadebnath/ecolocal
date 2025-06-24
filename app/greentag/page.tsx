import { Box, Heading, Text, VStack, SimpleGrid, Badge } from '@chakra-ui/react';

const PRODUCTS = [
  { name: 'Eco Bamboo Toothbrush', tag: 'Vegan', desc: 'Biodegradable, plastic-free, and cruelty-free.' },
  { name: 'Reusable Water Bottle', tag: 'Zero Waste', desc: 'Reduces single-use plastic.' },
  { name: 'Organic Cotton Tote', tag: 'Organic', desc: 'Sustainable and reusable for shopping.' },
  { name: 'Solar Power Bank', tag: 'Energy Saving', desc: 'Charge devices with clean solar energy.' },
];

export default function GreenTagPage() {
  return (
    <VStack spacing={8} py={10} align="center">
      <Heading color="green.300">Green Tag Products</Heading>
      <Text color="green.200" maxW="2xl" textAlign="center">
        Shop and discover products with verified green tags for sustainability.
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full" maxW="4xl">
        {PRODUCTS.map((prod) => (
          <Box key={prod.name} bg="black" borderRadius="lg" p={6} border="1px solid" borderColor="green.700" boxShadow="md">
            <Heading size="md" color="green.200" mb={2}>{prod.name}</Heading>
            <Badge colorScheme="green" mb={2}>{prod.tag}</Badge>
            <Text color="green.100">{prod.desc}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
