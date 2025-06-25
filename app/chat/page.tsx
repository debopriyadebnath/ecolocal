'use client'

import {
  Box,
  Container,
  VStack,
  Input,
  Button,
  Text,
  Flex,
  Avatar,
  useToast,
  HStack,
  Heading,
  List,
  ListItem,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Badge,
  Tooltip,
  Fade,
  Icon,
  Image,
  IconButton,
} from '@chakra-ui/react'
import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar'
import { useLanguage } from '../language-context'
import { FaPaperPlane, FaUsers, FaStore, FaImage, FaBox, FaTimes } from 'react-icons/fa'

const MotionBox = motion(Box)
// @ts-expect-error: Type is too complex for TS to infer
const MotionFlex = motion(Flex)

interface Message {
  user: User
  message: string
  timestamp: number
  image?: string
  productDetails?: {
    type: string
    quantity: number
    description: string
  }
}

interface User {
  id: string
  name: string
  type: 'buyer' | 'seller'
  acceptedWasteTypes?: string[]
}

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [productDetails, setProductDetails] = useState({
    type: '',
    quantity: 0,
    description: ''
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toast = useToast()
  const { t } = useLanguage()
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  useEffect(() => {
    const newSocket = io('http://localhost:3001')

    newSocket.on('connect', () => {
      toast({
        title: t('connected'),
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right',
      })
    })

    newSocket.on('message', (newMessage: Message) => {
      setMessages(prev => [...prev, newMessage])
    })

    newSocket.on('userList', (updatedUsers: User[]) => {
      setUsers(updatedUsers)
    })

    newSocket.on('typing', (user: User) => {
      setIsTyping(true)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const sendMessage = () => {
    if ((message.trim() || uploadedImage || (isAddingProduct && productDetails.type)) && socket) {
      socket.emit('sendMessage', {
        roomId: 'general',
        message: message.trim(),
        image: uploadedImage,
        productDetails: isAddingProduct ? productDetails : undefined
      })
      setMessage('')
      setUploadedImage(null)
      setIsAddingProduct(false)
      setProductDetails({ type: '', quantity: 0, description: '' })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing')
    }
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box p={4} mb={8}>
            <Heading mb={4}>{t('chatTitle')}</Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')}>
              {t('chatDescription')}
            </Text>
          </Box>

          <Flex gap={6} h="calc(100vh - 300px)">
            {/* Users List Sidebar */}
            <MotionBox
              w="250px"
              bg={bgColor}
              p={4}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth={1}
              borderColor={borderColor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <HStack mb={4} align="center">
                <Icon as={FaUsers} />
                <Heading size="md">{t('onlineUsers')}</Heading>
              </HStack>
              <List spacing={2}>
                <AnimatePresence>
                  {users.map(user => (
                    <MotionFlex
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem 
                        p={2} 
                        bg={useColorModeValue('gray.50', 'gray.700')} 
                        borderRadius="md"
                        _hover={{ bg: hoverBg }}
                        transition="all 0.2s"
                        cursor="pointer"
                        w="full"
                      >
                        <Flex align="center" gap={2}>
                          <Avatar 
                            size="sm" 
                            name={user.name}
                            bg={user.type === 'seller' ? 'eco.500' : 'gray.500'}
                          />
                          <Box flex={1}>
                            <Text fontSize="sm" fontWeight="medium">
                              {user.name}
                            </Text>
                            <Badge 
                              size="sm" 
                              colorScheme={user.type === 'seller' ? 'eco' : 'gray'}
                            >
                              {t(user.type)}
                            </Badge>
                          </Box>
                        </Flex>
                      </ListItem>
                    </MotionFlex>
                  ))}
                </AnimatePresence>
              </List>
            </MotionBox>

            {/* Chat Area */}
            <VStack flex={1} spacing={4} align="stretch">
              <Box
                flex={1}
                bg={bgColor}
                borderRadius="lg"
                p={4}
                overflowY="auto"
                boxShadow="sm"
                borderWidth={1}
                borderColor={borderColor}
              >
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <MotionFlex
                      key={index}
                      gap={3}
                      justify={msg.user.id === socket?.id ? 'flex-end' : 'flex-start'}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      mb={4}
                    >
                      {msg.user.id !== socket?.id && (
                        <Avatar
                          name={msg.user.name}
                          bg={msg.user.type === 'seller' ? 'eco.500' : 'gray.500'}
                        />
                      )}
                      <VStack align={msg.user.id === socket?.id ? 'flex-end' : 'flex-start'} spacing={2}>
                        <Box
                          bg={msg.user.id === socket?.id ? 'eco.100' : 'gray.100'}
                          p={3}
                          borderRadius="lg"
                          maxW="80%"
                        >
                          <HStack mb={1} spacing={2}>
                            <Text fontSize="sm" color="gray.500">
                              {msg.user.name}
                            </Text>
                            <Badge 
                              size="sm" 
                              colorScheme={msg.user.type === 'seller' ? 'eco' : 'gray'}
                            >
                              {t(msg.user.type)}
                            </Badge>
                            <Text fontSize="xs" color="gray.500">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </Text>
                          </HStack>
                          {msg.message && <Text>{msg.message}</Text>}
                          {msg.image && (
                            <Image
                              src={msg.image}
                              alt="Uploaded content"
                              maxH="200px"
                              borderRadius="md"
                              mt={2}
                            />
                          )}
                          {msg.productDetails && (
                            <Box mt={2} p={2} bg="white" borderRadius="md">
                              <Text fontWeight="bold">Waste Product Details:</Text>
                              <Text>Type: {msg.productDetails.type}</Text>
                              <Text>Quantity: {msg.productDetails.quantity}</Text>
                              <Text>Description: {msg.productDetails.description}</Text>
                            </Box>
                          )}
                        </Box>
                      </VStack>
                    </MotionFlex>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </Box>

              {isAddingProduct && (
                <Box p={4} bg={bgColor} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                  <VStack spacing={3}>
                    <Input
                      placeholder="Waste Product Type"
                      value={productDetails.type}
                      onChange={(e) => setProductDetails(prev => ({ ...prev, type: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={productDetails.quantity || ''}
                      onChange={(e) => setProductDetails(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    />
                    <Input
                      placeholder="Description"
                      value={productDetails.description}
                      onChange={(e) => setProductDetails(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </VStack>
                </Box>
              )}

              <HStack>
                <Button
                  as="label"
                  size="sm"
                  leftIcon={<Icon as={FaImage} />}
                  colorScheme="eco"
                  variant="outline"
                >
                  {t('addImage')}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
                <Button
                  size="sm"
                  leftIcon={<Icon as={FaBox} />}
                  colorScheme="eco"
                  variant="outline"
                  onClick={() => setIsAddingProduct(!isAddingProduct)}
                >
                  {isAddingProduct ? t('cancelProduct') : t('addProduct')}
                </Button>
              </HStack>

              <InputGroup size="lg">
                <Input
                  placeholder={t('typeMessage')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onInput={handleTyping}
                  bg={bgColor}
                  borderWidth={1}
                  borderColor={borderColor}
                  _focus={{
                    borderColor: 'eco.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-eco-500)',
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="eco"
                    onClick={sendMessage}
                    isDisabled={!message.trim() && !uploadedImage && !isAddingProduct}
                  >
                    {t('send')}
                  </Button>
                </InputRightElement>
              </InputGroup>

              {uploadedImage && (
                <Box position="relative" mt={2}>
                  <Image
                    src={uploadedImage}
                    alt="Upload preview"
                    maxH="200px"
                    borderRadius="md"
                  />
                  <IconButton
                    aria-label="Remove image"
                    icon={<FaTimes />}
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => setUploadedImage(null)}
                  />
                </Box>
              )}
            </VStack>
          </Flex>
        </MotionBox>
      </Container>
    </Box>
  )
}