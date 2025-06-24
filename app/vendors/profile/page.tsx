'use client'

import { useSearchParams } from 'next/navigation'
import { Box, Heading, Text, Container } from '@chakra-ui/react'

export default function VendorProfilePage() {
  const searchParams = useSearchParams();
  const vendor = searchParams.get('vendor');

  return (
    <Container maxW="container.md" py={20}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Heading as="h1" size="lg" mb={4}>
          Vendor Profile
        </Heading>
        <Text fontSize="xl">
          {vendor ? `Profile of: ${vendor}` : 'No vendor specified.'}
        </Text>
        <Text mt={4} color="gray.600">
          (This is a placeholder page. You can add vendor details here.)
        </Text>
      </Box>
    </Container>
  );
}
