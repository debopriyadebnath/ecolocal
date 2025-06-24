'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  SimpleGrid,
  Button,
  List,
  ListItem,
  ListIcon,
  HStack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Select,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { FaLeaf, FaCar, FaBicycle, FaWalking } from 'react-icons/fa'
import Navbar from '../../components/Navbar'
import { useNotification } from '../notification-context'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as turf from '@turf/turf'

// Replace with your actual Mapbox token
mapboxgl.accessToken = 'your_mapbox_token'

const ROUTES = [
  { id: 1, name: 'Fastest Route', co2: 2.5, green: false },
  { id: 2, name: 'Green Route (Bike + Walk)', co2: 0.2, green: true },
  { id: 3, name: 'Public Transport', co2: 1.1, green: false },
]

export default function RoutePlanner() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const { sendNotification } = useNotification()
  const [selectedVendors, setSelectedVendors] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [totalEmissions, setTotalEmissions] = useState(0)
  const [emissionsSaved, setEmissionsSaved] = useState(0)
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40],  // Default to New York
        zoom: 9
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl())

      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          if (map.current) {
            map.current.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 12
            })
          }
        })
      }
    }
  }, [])

  const calculateOptimalRoute = async () => {
    if (!selectedVendors.length) return

    try {
      // Sort vendors by distance and create an optimized route
      const coordinates = selectedVendors.map(v => v.coordinates)
      const line = turf.lineString(coordinates)
      const length = turf.length(line, { units: 'kilometers' })
      
      // Calculate emissions
      const carEmissions = length * 0.2 // kg CO2 per km
      const optimizedEmissions = length * 0.08 // Using efficient routing and sustainable transport

      setTotalEmissions(carEmissions)
      setEmissionsSaved(carEmissions - optimizedEmissions)

      if (emissionsSaved > 0) {
        sendNotification(
          'Route Optimization Success!',
          `You saved ${Math.round(emissionsSaved)} kg of CO2 emissions with this route!`,
          'success'
        )
      }

      // Draw route on map
      if (map.current) {
        const routeLayer = {
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: line
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3aad3a',
            'line-width': 8
          }
        }

        if (map.current.getSource('route')) {
          map.current.removeLayer('route')
          map.current.removeSource('route')
        }

        map.current.addLayer(routeLayer as any)
      }
    } catch (error) {
      console.error('Error calculating route:', error)
    }
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Heading>Sustainable Route Planner</Heading>
          <Text color={textColor}>
            Plan the most eco-friendly route to visit multiple vendors
          </Text>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
            <Card bg={bgColor}>
              <CardBody>
                <VStack spacing={4}>
                  <Box ref={mapContainer} style={{ width: '100%', height: '400px' }} />
                  <Button
                    colorScheme="eco"
                    leftIcon={<FaLeaf />}
                    onClick={calculateOptimalRoute}
                    isDisabled={!selectedVendors.length}
                  >
                    Calculate Eco-friendly Route
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={bgColor}>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Route Details</Heading>
                  
                  <SimpleGrid columns={2} spacing={4}>
                    <Stat>
                      <StatLabel>Total Distance</StatLabel>
                      <StatNumber>{routes.length ? Math.round(routes[0].distance / 1000) : 0} km</StatNumber>
                      <StatHelpText>Optimized route</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>CO₂ Saved</StatLabel>
                      <StatNumber>{Math.round(emissionsSaved)} kg</StatNumber>
                      <StatHelpText>vs. standard route</StatHelpText>
                    </Stat>
                  </SimpleGrid>

                  <List spacing={3}>
                    {selectedVendors.map((vendor, index) => (
                      <ListItem key={index}>
                        <HStack justify="space-between">
                          <HStack>
                            <ListIcon as={index === 0 ? FaCar : FaLeaf} color="eco.500" />
                            <Text>{vendor.name}</Text>
                          </HStack>
                          <Badge colorScheme="eco">Stop {index + 1}</Badge>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>

                  <VStack spacing={2}>
                    <HStack>
                      <FaBicycle />
                      <Text>Available bike routes</Text>
                    </HStack>
                    <HStack>
                      <FaWalking />
                      <Text>Walking friendly sections</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Card bg={bgColor}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Green Route Delivery</Heading>
                <Text color="green.200" maxW="2xl" textAlign="center">
                  Discover and select the most eco-friendly delivery routes for your orders.
                </Text>
                
                <FormControl mb={4}>
                  <FormLabel color="green.200">Select a Route</FormLabel>
                  <Select
                    bg="gray.900"
                    color="green.100"
                    onChange={e => setSelectedRoute(Number(e.target.value))}
                    value={selectedRoute ?? ''}
                  >
                    <option value="" disabled>Select route</option>
                    {ROUTES.map(route => (
                      <option key={route.id} value={route.id}>{route.name}</option>
                    ))}
                  </Select>
                </FormControl>

                {selectedRoute !== null && (
                  <Box
                    mt={4}
                    p={4}
                    borderRadius="md"
                    bg={ROUTES.find(r => r.id === selectedRoute)?.green ? 'green.900' : 'gray.800'}
                    border="1px solid"
                    borderColor={ROUTES.find(r => r.id === selectedRoute)?.green ? 'green.400' : 'gray.600'}
                  >
                    <Text color="green.200" fontWeight="bold">
                      {ROUTES.find(r => r.id === selectedRoute)?.name}
                    </Text>
                    <Text color="green.100">
                      CO₂ Emitted: {ROUTES.find(r => r.id === selectedRoute)?.co2} kg
                    </Text>
                    {ROUTES.find(r => r.id === selectedRoute)?.green && (
                      <Text color="green.400" fontWeight="bold">
                        🌱 This is the greenest route!
                      </Text>
                    )}
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}
