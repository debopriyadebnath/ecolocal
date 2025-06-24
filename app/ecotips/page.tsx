'use client'
import { Box, Heading, Text, VStack, Checkbox, Progress, Button, useToast, SimpleGrid } from '@chakra-ui/react'
import { useState } from 'react'

const tips = [
  'Switch to bamboo toothbrushes to reduce plastic waste.',
  'Bring your own reusable bag when shopping.',
  'Take public transport or carpool to lower your carbon footprint.',
  'Compost your kitchen waste for a greener planet.',
  'Choose local and seasonal produce to support farmers.'
]

const habits = [
  'Used reusable bag',
  'Took public transport',
  'Composted waste',
  'Ate plant-based meal',
]

export default function EcoTipsPage() {
  const [habitChecks, setHabitChecks] = useState(Array(habits.length).fill(false))
  const [streak, setStreak] = useState(3)
  const [checked, setChecked] = useState(Array(habits.length).fill(false))
  const toast = useToast()

  const handleCheck = (idx: number) => {
    const updated = [...habitChecks]
    updated[idx] = !updated[idx]
    setHabitChecks(updated)
    if (updated[idx]) {
      setStreak(streak + 1)
      toast({ title: 'Great job!', description: `You tracked: ${habits[idx]}`, status: 'success', duration: 1500 })
    } else {
      setStreak(Math.max(0, streak - 1))
    }
  }

  const progress = (checked.filter(Boolean).length / habits.length) * 100

  return (
    <Box maxW="lg" mx="auto" py={12}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg" color="green.300">🌱 Daily Eco Tip</Heading>
        <Text fontSize="xl" color="green.200" bg="green.50" p={4} borderRadius="md">
          {tips[Math.floor(Math.random() * tips.length)]}
        </Text>
        <Heading size="md">Track Your Green Habits</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {habits.map((habit, idx) => (
            <Button
              key={habit}
              colorScheme={habitChecks[idx] ? 'green' : 'gray'}
              variant={habitChecks[idx] ? 'solid' : 'outline'}
              onClick={() => handleCheck(idx)}
            >
              {habit} {habitChecks[idx] ? '✅' : ''}
            </Button>
          ))}
        </SimpleGrid>
        <Box>
          <Text fontWeight="bold">Streak: {streak} days</Text>
          <Progress value={Math.min(streak, 10) * 10} colorScheme="green" borderRadius="md" />
        </Box>
        <Box bg="black" borderRadius="lg" p={8} border="1px solid" borderColor="green.700" w="full" maxW="lg">
          <VStack align="start" spacing={3} mb={4}>
            {habits.map((tip, idx) => (
              <Checkbox key={tip} colorScheme="green" isChecked={checked[idx]} onChange={() => handleCheck(idx)} color="green.200">
                {tip}
              </Checkbox>
            ))}
          </VStack>
          <Progress value={progress} colorScheme="green" size="lg" borderRadius="md" mb={2} />
          <Text color="green.200">{Math.round(progress)}% complete</Text>
          <Button mt={4} colorScheme="green" variant="outline" onClick={() => setChecked(Array(habits.length).fill(false))}>Reset</Button>
        </Box>
      </VStack>
    </Box>
  )
}
