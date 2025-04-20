'use client'

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Grid,
  useColorModeValue,
  Card,
  CardBody,
  Icon,
  List,
  ListItem,
  ListIcon,
  Button,
  Fade,
  Badge,
  HStack,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useLanguage } from '../language-context'
import { useOrder } from '../order-context'
import Navbar from '../../components/Navbar'
import WebcamComponent from '../../components/WebcamComponent'
import { 
  FaHandPaper, 
  FaHandPointUp, 
  FaHandRock,
  FaThumbsUp,
  FaThumbsDown,
  FaCheck,
  FaVideo,
  FaInfoCircle,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa'

const MotionBox = motion(Box)
const MotionContainer = motion(Container)

const GestureCard = ({ icon, title, description, command, isActive }: { 
  icon: any; 
  title: string; 
  description: string;
  command: string;
  isActive?: boolean;
}) => {
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        bg={useColorModeValue('white', 'gray.800')}
        borderWidth={1}
        borderColor={isActive ? 'eco.500' : useColorModeValue('gray.200', 'gray.700')}
        borderRadius="xl"
        overflow="hidden"
        boxShadow={isActive ? 'lg' : 'base'}
        transition="all 0.2s"
      >
        <CardBody>
          <VStack spacing={4} align="start">
            <Icon 
              as={icon} 
              boxSize={6} 
              color={isActive ? 'eco.500' : 'gray.500'} 
            />
            <VStack align="start" spacing={2}>
              <Heading size="md">{title}</Heading>
              <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize="sm">
                {description}
              </Text>
              <Text 
                color={isActive ? 'eco.500' : 'gray.500'}
                fontWeight="bold" 
                fontFamily="monospace" 
                fontSize="sm"
              >
                {command}
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </MotionBox>
  )
}

export default function GestureControl() {
  const [showWebcam, setShowWebcam] = useState(true)
  const [activeGesture, setActiveGesture] = useState<string | null>(null)
  const { t } = useLanguage()
  const { orders, activeOrder, setActiveOrder, updateOrderStatus, addOrder } = useOrder()
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0)
  const [gestureAnimation, setGestureAnimation] = useState<string | null>(null)

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  // Add sample orders if none exist
  useEffect(() => {
    if (orders.length === 0) {
      // Add sample eco-friendly orders
      const sampleOrders = [
        {
          vendorId: 'v1',
          items: [
            { id: '1', name: 'Bamboo Cutlery Set', quantity: 2 },
            { id: '2', name: 'Organic Cotton Bag', quantity: 1 }
          ]
        },
        {
          vendorId: 'v2',
          items: [
            { id: '3', name: 'Solar-Powered Light', quantity: 1 },
            { id: '4', name: 'Recycled Paper Notebook', quantity: 3 }
          ]
        },
        {
          vendorId: 'v3',
          items: [
            { id: '5', name: 'Reusable Water Bottle', quantity: 2 },
            { id: '6', name: 'Eco-friendly Soap', quantity: 4 }
          ]
        }
      ]
      
      sampleOrders.forEach(order => addOrder(order))
    }
  }, [])

  // Handle gesture detection with visual feedback
  const handleGestureDetected = (gesture: string | null) => {
    setActiveGesture(gesture)
    
    if (!gesture || !activeOrder) return

    setGestureAnimation(gesture)
    setTimeout(() => setGestureAnimation(null), 1000)

    switch (gesture) {
      case 'acceptOrder':
        updateOrderStatus(activeOrder.id, 'accepted')
        break
      case 'cancelOrder':
        updateOrderStatus(activeOrder.id, 'cancelled')
        break
      case 'completeOrder':
        updateOrderStatus(activeOrder.id, 'completed')
        break
      case 'previousOrder':
        if (currentOrderIndex > 0) {
          setCurrentOrderIndex(prev => prev - 1)
          setActiveOrder(orders[currentOrderIndex - 1])
        }
        break
      case 'nextOrder':
        if (currentOrderIndex < orders.length - 1) {
          setCurrentOrderIndex(prev => prev + 1)
          setActiveOrder(orders[currentOrderIndex + 1])
        }
        break
    }
  }

  // Set initial active order
  useEffect(() => {
    if (orders.length > 0 && !activeOrder) {
      setActiveOrder(orders[0])
    }
  }, [orders])

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar />
      <MotionContainer
        maxW="container.xl"
        py={8}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading mb={4}>{t('gestureControlTitle')}</Heading>
            <Text color={textColor} fontSize="lg" maxW="2xl" mx="auto">
              {t('gestureControlDescription')}
            </Text>
          </Box>

          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gap={8}
            alignItems="start"
          >
            <VStack spacing={6} align="stretch">
              <Alert
                status="info"
                borderRadius="lg"
                bg={useColorModeValue('blue.50', 'blue.900')}
              >
                <AlertIcon />
                {t('gestureControlInstructions')}
              </Alert>

              <Box>
                <Heading size="md" mb={4}>
                  {t('availableGestures')}
                </Heading>
                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={4}>
                  <GestureCard
                    icon={FaThumbsUp}
                    title={t('acceptOrder')}
                    description={t('acceptOrderDesc')}
                    command={t('acceptOrderCommand')}
                    isActive={activeGesture === 'acceptOrder'}
                  />
                  <GestureCard
                    icon={FaThumbsDown}
                    title={t('cancelOrder')}
                    description={t('cancelOrderDesc')}
                    command={t('cancelOrderCommand')}
                    isActive={activeGesture === 'cancelOrder'}
                  />
                  <GestureCard
                    icon={FaCheck}
                    title={t('completeOrder')}
                    description={t('completeOrderDesc')}
                    command={t('completeOrderCommand')}
                    isActive={activeGesture === 'completeOrder'}
                  />
                  <GestureCard
                    icon={FaArrowLeft}
                    title={t('previousOrder')}
                    description={t('previousOrderDesc')}
                    command={t('previousOrderCommand')}
                    isActive={activeGesture === 'previousOrder'}
                  />
                  <GestureCard
                    icon={FaArrowRight}
                    title={t('nextOrder')}
                    description={t('nextOrderDesc')}
                    command={t('nextOrderCommand')}
                    isActive={activeGesture === 'nextOrder'}
                  />
                </Grid>
              </Box>

              {activeOrder && (
                <Box position="relative">
                  <Heading size="md" mb={4}>
                    {t('currentOrder')}
                  </Heading>
                  <MotionBox
                    initial={{ scale: 1 }}
                    animate={{
                      scale: gestureAnimation ? 1.05 : 1,
                      borderColor: 
                        gestureAnimation === 'acceptOrder' ? 'green.500' :
                        gestureAnimation === 'cancelOrder' ? 'red.500' :
                        gestureAnimation === 'completeOrder' ? 'blue.500' :
                        'transparent'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardBody>
                        <VStack align="start" spacing={4}>
                          <HStack spacing={4} width="full" justify="space-between">
                            <Badge colorScheme={
                              activeOrder.status === 'accepted' ? 'green' :
                              activeOrder.status === 'cancelled' ? 'red' :
                              activeOrder.status === 'completed' ? 'blue' :
                              'yellow'
                            } fontSize="md" px={3} py={1}>
                              {activeOrder.status.toUpperCase()}
                            </Badge>
                            <HStack>
                              <Badge colorScheme="gray">
                                Order #{activeOrder.id}
                              </Badge>
                              <Text fontSize="sm" color={textColor}>
                                {currentOrderIndex + 1} of {orders.length}
                              </Text>
                            </HStack>
                          </HStack>
                          <Box width="full">
                            <Text fontWeight="bold" mb={2}>{t('items')}:</Text>
                            <List spacing={2}>
                              {activeOrder.items.map((item, index) => (
                                <ListItem key={index}>
                                  <HStack justify="space-between">
                                    <Text>{item.name}</Text>
                                    <Badge colorScheme="eco">x{item.quantity}</Badge>
                                  </HStack>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                          <Box width="full" pt={2}>
                            <Text fontSize="sm" color={textColor}>
                              {t('gestureHint')}
                            </Text>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  </MotionBox>
                </Box>
              )}

              <Box>
                <Heading size="md" mb={4}>
                  {t('tips')}
                </Heading>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={FaCheck} color="eco.500" />
                    {t('gestureTip1')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="eco.500" />
                    {t('gestureTip2')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="eco.500" />
                    {t('gestureTip3')}
                  </ListItem>
                </List>
              </Box>
            </VStack>

            <VStack spacing={4} align="stretch">
              <Box
                position="relative"
                bg={useColorModeValue('white', 'gray.800')}
                p={4}
                borderRadius="2xl"
                borderWidth={1}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                boxShadow="xl"
                overflow="hidden"
                minH="500px"
              >
                <AnimatePresence mode="wait">
                  {showWebcam ? (
                    <MotionBox
                      key="webcam"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <WebcamComponent
                        loadingText={t('loading')}
                        permissionText={t('cameraPermission')}
                        allowCameraText={t('allowCamera')}
                        noGestureText={t('noGesture')}
                        gestureDetectedText={t('gestureDetected')}
                        onGestureDetected={handleGestureDetected}
                      />
                    </MotionBox>
                  ) : (
                    <MotionBox
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <VStack
                        justify="center"
                        align="center"
                        h="full"
                        spacing={4}
                        color={textColor}
                      >
                        <Icon as={FaInfoCircle} boxSize={12} />
                        <Text textAlign="center">
                          {t('enableCameraText')}
                        </Text>
                      </VStack>
                    </MotionBox>
                  )}
                </AnimatePresence>

                <Button
                  position="absolute"
                  bottom={4}
                  right={4}
                  leftIcon={<FaVideo />}
                  onClick={() => setShowWebcam(!showWebcam)}
                  colorScheme="eco"
                  size="lg"
                  shadow="lg"
                >
                  {showWebcam ? t('disableCamera') : t('enableCamera')}
                </Button>
              </Box>

              <Alert
                status="warning"
                borderRadius="lg"
                variant="left-accent"
              >
                <AlertIcon />
                {t('gesturePrivacyNotice')}
              </Alert>
            </VStack>
          </Grid>
        </VStack>
      </MotionContainer>
    </Box>
  )
}