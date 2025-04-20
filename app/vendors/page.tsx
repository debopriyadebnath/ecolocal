'use client'

import {
  Box,
  Container,
  Grid,
  Select,
  VStack,
  HStack,
  Text,
  Input,
  Heading,
  SimpleGrid,
  Button,
  Icon,
  Flex,
  Divider,
  useColorModeValue,
  Card,
  CardBody,
  Stack,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  Collapse,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Tooltip,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaMapMarkedAlt, 
  FaList, 
  FaFilter, 
  FaSortAmountDown, 
  FaSearch,
  FaLeaf,
  FaStar,
} from 'react-icons/fa'
import Navbar from '../../components/Navbar'
import VendorCard from '../../components/VendorCard'
import { useLanguage } from '../language-context'

const MotionGrid = motion(Grid)
const MotionBox = motion(Box)

// Categories with icons
const categories = [
  { name: 'Groceries', count: 15, icon: '🥬' },
  { name: 'Zero Waste', count: 8, icon: '♻️' },
  { name: 'Clothing', count: 12, icon: '👕' },
  { name: 'Home Goods', count: 10, icon: '🏠' },
  { name: 'Farmers Markets', count: 6, icon: '🌾' },
  { name: 'Restaurants', count: 20, icon: '🍽️' },
]

// Enhanced mock data for vendors
const mockVendors = [
  {
    name: 'Green Grocer',
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6',
    ecoScore: 9.5,
    distance: 1.2,
    category: 'Groceries',
    rating: 4.8,
    specialties: ['Organic', 'Local', 'Zero-Waste'],
    location: 'Downtown',
    acceptedWasteTypes: ['Organic Waste', 'Paper', 'Glass Containers']
  },
  {
    name: 'Eco Fashion Hub',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f',
    ecoScore: 8.5,
    distance: 2.9,
    category: 'Clothing',
    rating: 4.4,
    specialties: ['Sustainable Fashion', 'Organic Cotton', 'Recycled Materials'],
    location: 'East Side',
    acceptedWasteTypes: ['Textiles', 'Clothing', 'Fabric Scraps']
  },
  {
    name: 'Zero Waste Shop',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    ecoScore: 9.8,
    distance: 4.2,
    category: 'Zero Waste',
    rating: 4.7,
    specialties: ['Zero-Waste', 'Refill Station', 'Bulk Foods'],
    location: 'West End',
    acceptedWasteTypes: ['Plastics', 'Glass', 'Metal', 'Paper', 'Electronics']
  },
  {
    name: 'Local Farmers Market',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9',
    ecoScore: 9.2,
    distance: 3.1,
    category: 'Farmers Market',
    rating: 4.9,
    specialties: ['Local', 'Organic', 'Fresh'],
    location: 'South District',
    acceptedWasteTypes: ['Organic Waste', 'Compost', 'Plant Materials']
  },
  {
    name: 'Eco Electronics',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03',
    ecoScore: 9.0,
    distance: 5.3,
    category: 'Electronics',
    rating: 4.6,
    specialties: ['E-waste Recycling', 'Refurbished Electronics'],
    location: 'Tech District',
    acceptedWasteTypes: ['Electronics', 'Batteries', 'Cables', 'Appliances']
  },
  {
    name: 'Green Building Supplies',
    image: 'https://images.unsplash.com/photo-1504307651254-35b1a8b419c3',
    ecoScore: 8.8,
    distance: 6.7,
    category: 'Construction',
    rating: 4.5,
    specialties: ['Sustainable Materials', 'Recycled Building Materials'],
    location: 'Industrial Zone',
    acceptedWasteTypes: ['Construction Materials', 'Wood', 'Metal', 'Glass']
  }
]

export default function Vendors() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [ecoScoreRange, setEcoScoreRange] = useState([0, 10])
  const [sortBy, setSortBy] = useState('rating')
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure()
  const { t } = useLanguage()

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !selectedCategory || vendor.category === selectedCategory
    const matchesLocation = !selectedLocation || vendor.location?.includes(selectedLocation)
    const matchesEcoScore = vendor.ecoScore >= ecoScoreRange[0] && vendor.ecoScore <= ecoScoreRange[1]
    return matchesSearch && matchesCategory && matchesLocation && matchesEcoScore
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'ecoScore') return b.ecoScore - a.ecoScore
    if (sortBy === 'distance') return a.distance - b.distance
    return 0
  })

  const locations = Array.from(new Set(mockVendors.map(v => v.location)))

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Hero Section */}
          <MotionBox
            textAlign="center"
            pb={8}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading as="h1" size="2xl" mb={4}>
              {t('vendors')}
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')}>
              {t('vendorsDescription')}
            </Text>
          </MotionBox>

          {/* Categories Section */}
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              {t('browseCategories')}
            </Heading>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
              {categories.map((category) => (
                <Card 
                  key={category.name} 
                  bg={cardBg}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.name ? '' : category.name
                  )}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'lg',
                  }}
                  borderWidth={2}
                  borderColor={selectedCategory === category.name ? 'eco.500' : borderColor}
                >
                  <CardBody>
                    <VStack>
                      <Text fontSize="2xl">{category.icon}</Text>
                      <Text fontWeight="bold">{category.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {category.count} {t('vendors')}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Filters and View Toggle */}
          <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
            <HStack spacing={4} flex={1} wrap="wrap">
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder={t('search')}
                  bg={cardBg}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Button
                leftIcon={<FaFilter />}
                onClick={onFilterToggle}
                colorScheme="eco"
                variant="outline"
              >
                {t('filters')}
              </Button>

              <Select
                placeholder={t('sortBy')}
                bg={cardBg}
                maxW="200px"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                icon={<FaSortAmountDown />}
              >
                <option value="rating">{t('rating')}</option>
                <option value="ecoScore">{t('ecoScore')}</option>
                <option value="distance">{t('distance')}</option>
              </Select>
            </HStack>

            <Button
              leftIcon={<Icon as={viewMode === 'grid' ? FaMapMarkedAlt : FaList} />}
              onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
              colorScheme="eco"
            >
              {viewMode === 'grid' ? t('mapView') : t('listView')}
            </Button>
          </Stack>

          {/* Advanced Filters */}
          <Collapse in={isFilterOpen} animateOpacity>
            <Box p={4} bg={cardBg} borderRadius="xl" shadow="sm">
              <Stack spacing={4}>
                <Box>
                  <Text mb={2} fontWeight="medium">{t('ecoScoreRange')}</Text>
                  <RangeSlider
                    aria-label={['min', 'max']}
                    value={ecoScoreRange}
                    onChange={setEcoScoreRange}
                    min={0}
                    max={10}
                    step={0.5}
                  >
                    <RangeSliderTrack bg="eco.100">
                      <RangeSliderFilledTrack bg="eco.500" />
                    </RangeSliderTrack>
                    <Tooltip label={ecoScoreRange[0]} placement="top" isOpen>
                      <RangeSliderThumb index={0} />
                    </Tooltip>
                    <Tooltip label={ecoScoreRange[1]} placement="top" isOpen>
                      <RangeSliderThumb index={1} />
                    </Tooltip>
                  </RangeSlider>
                </Box>

                <Select
                  placeholder={t('location')}
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </Select>
              </Stack>
            </Box>
          </Collapse>

          {viewMode === 'grid' ? (
            <AnimatePresence mode="wait">
              <MotionGrid
                key="grid"
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                }}
                gap={6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredVendors.map((vendor, index) => (
                  <motion.div
                    key={vendor.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <VendorCard {...vendor} />
                  </motion.div>
                ))}
              </MotionGrid>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <MotionBox
                key="map"
                h="600px"
                borderRadius="2xl"
                overflow="hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.35231274201!2d88.26495974522733!3d22.535564507507596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1650456231234!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </MotionBox>
            </AnimatePresence>
          )}
        </VStack>
      </Container>
    </Box>
  )
}