'use client'

import React, { Suspense, useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  SimpleGrid,
  Button,
  HStack,
  Badge,
  Icon,
} from '@chakra-ui/react'
import { FaCube, FaVrCardboard, FaMobileAlt, FaExpand } from 'react-icons/fa'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import Navbar from '../../components/Navbar'
import Model3D from '../../components/Model3D'
import { useLanguage } from '../language-context'

// Sample products with 3D models
const SAMPLE_PRODUCTS = [
  {
    id: '1',
    name: 'Eco-friendly Water Bottle',
    modelPath: '/models/water-bottle.glb',
    description: 'Reusable water bottle made from recycled materials',
    category: 'Sustainable Living',
    price: '৳299',
  },
  {
    id: '2',
    name: 'Bamboo Cutlery Set',
    modelPath: '/models/cutlery-set.glb',
    description: 'Biodegradable bamboo cutlery set for eco-conscious dining',
    category: 'Kitchen',
    price: '৳399',
  },
  // Add more sample products here
]

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export default function ARPreview() {
  const { t } = useLanguage()
  const [selectedProduct, setSelectedProduct] = useState(SAMPLE_PRODUCTS[0])
  const [viewMode, setViewMode] = useState<'3d' | 'ar'>('3d')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const handleFullscreen = () => {
    const modelContainer = document.getElementById('model-container')
    if (modelContainer) {
      if (!isFullscreen) {
        if (modelContainer.requestFullscreen) {
          modelContainer.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading>{t('arPreview')}</Heading>
          <Text color={textColor}>{t('arPreviewDescription')}</Text>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            <Box
              id="model-container"
              bg={cardBg}
              p={6}
              borderRadius="2xl"
              boxShadow="xl"
              h="500px"
            >
              <Model3D
                modelPath={selectedProduct.modelPath}
                scale={1}
                autoRotate={viewMode === '3d'}
              />
            </Box>

            <VStack align="stretch" spacing={6}>
              <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="xl">
                <VStack align="stretch" spacing={4}>
                  <Heading size="lg">{selectedProduct.name}</Heading>
                  <Badge colorScheme="eco" alignSelf="start">
                    {selectedProduct.category}
                  </Badge>
                  <Text color={textColor}>{selectedProduct.description}</Text>
                  <Text fontWeight="bold" fontSize="2xl" color="eco.500">
                    {selectedProduct.price}
                  </Text>
                </VStack>
              </Box>

              <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="xl">
                <VStack spacing={4}>
                  <HStack spacing={4}>
                    <Button
                      leftIcon={<Icon as={FaCube} />}
                      colorScheme={viewMode === '3d' ? 'eco' : 'gray'}
                      onClick={() => setViewMode('3d')}
                    >
                      {t('view3D')}
                    </Button>
                    <Button
                      leftIcon={<Icon as={FaVrCardboard} />}
                      colorScheme={viewMode === 'ar' ? 'eco' : 'gray'}
                      onClick={() => setViewMode('ar')}
                    >
                      {t('viewAR')}
                    </Button>
                    <Button
                      leftIcon={<Icon as={FaExpand} />}
                      colorScheme="gray"
                      onClick={handleFullscreen}
                    >
                      {isFullscreen ? t('exitFullscreen') : t('fullscreen')}
                    </Button>
                  </HStack>

                  {viewMode === 'ar' && (
                    <VStack
                      spacing={4}
                      p={4}
                      bg={useColorModeValue('gray.100', 'gray.700')}
                      borderRadius="lg"
                    >
                      <Icon as={FaMobileAlt} boxSize={8} color="eco.500" />
                      <Text textAlign="center">{t('scanQRCode')}</Text>
                      {/* Add QR code here */}
                    </VStack>
                  )}
                </VStack>
              </Box>
            </VStack>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
            {SAMPLE_PRODUCTS.map((product) => (
              <Button
                key={product.id}
                h="auto"
                p={4}
                variant="outline"
                colorScheme={selectedProduct.id === product.id ? 'eco' : 'gray'}
                onClick={() => setSelectedProduct(product)}
              >
                <VStack spacing={2}>
                  <Text noOfLines={2} textAlign="center">
                    {product.name}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    {product.price}
                  </Text>
                </VStack>
              </Button>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}
