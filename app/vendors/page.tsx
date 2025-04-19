import {
  Box,
  Container,
  Grid,
  Select,
  VStack,
  HStack,
  Text,
  Input,
} from '@chakra-ui/react'
import Navbar from '../../components/Navbar'
import VendorCard from '../../components/VendorCard'

// Mock data for vendors
const mockVendors = [
  {
    name: 'Green Grocer',
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6',
    ecoScore: 9,
    distance: 1.2,
  },
  {
    name: 'Eco Market',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    ecoScore: 8,
    distance: 2.5,
  },
  {
    name: 'Sustainable Store',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    ecoScore: 7,
    distance: 3.1,
  },
]

export default function Vendors() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack spacing={4} wrap="wrap">
            <Select placeholder="Category" maxW="200px">
              <option value="groceries">Groceries</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home Goods</option>
            </Select>
            <Select placeholder="Price Range" maxW="200px">
              <option value="low">$</option>
              <option value="medium">$$</option>
              <option value="high">$$$</option>
            </Select>
            <Select placeholder="Packaging" maxW="200px">
              <option value="recyclable">Recyclable</option>
              <option value="compostable">Compostable</option>
              <option value="reusable">Reusable</option>
            </Select>
            <Input
              placeholder="Search vendors..."
              maxW="300px"
              bg="white"
            />
          </HStack>

          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
            gap={6}
          >
            {mockVendors.map((vendor, index) => (
              <VendorCard key={index} {...vendor} />
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
} 