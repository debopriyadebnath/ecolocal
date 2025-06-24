'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Card,
  CardBody,
  Icon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaCar, FaLightbulb, FaUtensils, FaShoppingBag } from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import Navbar from '../../components/Navbar'
import { useUser } from '../user-context'
import { useNotification } from '../notification-context'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const MotionBox = motion(Box)

const TRANSPORT_EMISSIONS = {
  car: 0.21, // kg CO2/km
  bus: 0.09,
  train: 0.04,
  bike: 0,
  walk: 0,
};

export default function CarbonCalculator() {
  const [formData, setFormData] = useState({
    transportation: '',
    electricityUsage: '',
    dietType: 'mixed',
    monthlyPurchases: '',
  })
  const [distance, setDistance] = useState('')
  const [mode, setMode] = useState('car')
  const [result, setResult] = useState<number | null>(null)

  const { user } = useUser()
  const { sendNotification } = useNotification()
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const calculateCarbonFootprint = () => {
    // Basic calculation (can be made more sophisticated)
    const transportationEmissions = parseFloat(formData.transportation) * 0.14 // kg CO2 per km
    const electricityEmissions = parseFloat(formData.electricityUsage) * 0.5 // kg CO2 per kWh
    const dietEmissions = {
      vegan: 1.5,
      vegetarian: 2.5,
      mixed: 3.3,
      highMeat: 4.5
    }[formData.dietType] * 365 // yearly emissions
    const purchaseEmissions = parseFloat(formData.monthlyPurchases) * 0.5 * 12 // yearly emissions

    const totalEmissions = transportationEmissions + electricityEmissions + dietEmissions + purchaseEmissions

    if (user) {
      // Update user's impact metrics
      const currentImpact = user.totalImpact || { co2Reduced: 0 }
      const reduction = Math.max(0, 10000 - totalEmissions) // Assuming 10t as baseline
      
      if (reduction > currentImpact.co2Reduced) {
        sendNotification(
          'New Carbon Reduction Achievement!',
          `You've reduced your carbon footprint by ${Math.round(reduction - currentImpact.co2Reduced)}kg CO2!`,
          'success'
        )
      }
    }

    return totalEmissions
  }

  const handleCalculate = () => {
    const dist = parseFloat(distance)
    if (isNaN(dist) || dist < 0) return setResult(null)
    const emission = TRANSPORT_EMISSIONS[mode as keyof typeof TRANSPORT_EMISSIONS] * dist
    setResult(emission)
  }

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Your Carbon Footprint',
        data: [8000, 7800, 7600, 7200, 6900, calculateCarbonFootprint()],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Average',
        data: [10000, 10000, 10000, 10000, 10000, 10000],
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0.1,
      }
    ]
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Heading color="green.300">Carbon Footprint Calculator</Heading>
          <Text color="green.200" maxW="2xl" textAlign="center">
            Calculate your personal or order-related carbon footprint and get actionable tips to reduce your impact.
          </Text>
          <Box bg="black" borderRadius="lg" p={8} border="1px solid" borderColor="green.700" w="full" maxW="lg">
            <FormControl mb={4}>
              <FormLabel color="green.200">Distance (km)</FormLabel>
              <Input type="number" value={distance} onChange={e => setDistance(e.target.value)} bg="gray.900" color="green.100" />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel color="green.200">Transport Mode</FormLabel>
              <Select value={mode} onChange={e => setMode(e.target.value)} bg="gray.900" color="green.100">
                <option value="car">Car</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="bike">Bike</option>
                <option value="walk">Walk</option>
              </Select>
            </FormControl>
            <Button colorScheme="green" onClick={handleCalculate} w="full" mb={4}>Calculate</Button>
            {result !== null && (
              <Text color="green.300" fontWeight="bold">CO₂ Emitted: {result.toFixed(2)} kg</Text>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
