'use client'

import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  SimpleGrid, 
  Icon,
  useColorModeValue,
  Image as ChakraImage,
  Badge,
  useDisclosure,
  Fade,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Avatar,
  Card,
  CardBody,
  IconButton,
} from '@chakra-ui/react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link';

interface Benefit {
  icon: any;
  title: string;
  description: string;
}

import Navbar from '../components/Navbar'
import WebcamComponent from '../components/WebcamComponent'
import UserProfile from '../components/UserProfile'
import { FaLeaf, FaRecycle, FaHandshake, FaSearch, FaVideo, FaArrowRight, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStore, FaUsers, FaTree, FaSeedling, FaUser } from 'react-icons/fa'
import { useLanguage } from './language-context'
import { useUser } from './user-context'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)
const MotionContainer = motion(Container)
const MotionCard = motion(Card)
const MotionButton = motion(Button)

const Feature = ({ icon, title, description }: { icon: any; title: string; description: string }) => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [50, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  
  return (
    <MotionBox
      style={{ y, opacity }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      p={8}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="2xl"
      boxShadow="xl"
      border="2px solid"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
    >
      <VStack align="start" spacing={4}>
        <Icon as={icon} w={10} h={10} color="eco.500" />
        <Heading size="md">{title}</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.300')}>{description}</Text>
      </VStack>
    </MotionBox>
  )
}

const StatBox = ({ icon, label, value, helpText }: { icon: any; label: string; value: string; helpText: string }) => (
  <MotionBox
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <Stat
      px={8}
      py={6}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="2xl"
      boxShadow="xl"
      border="2px solid"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
    >
      <Icon as={icon} w={6} h={6} color="eco.500" mb={2} />
      <StatLabel fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>{label}</StatLabel>
      <StatNumber fontSize="4xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>{value}</StatNumber>
      <StatHelpText color={useColorModeValue('gray.500', 'gray.400')}>{helpText}</StatHelpText>
    </Stat>
  </MotionBox>
)

const testimonials = [
  {
    text: "সবুজহাট has transformed how I connect with eco-conscious customers. My sustainable business has grown tremendously!",
    author: "Sarah Chen",
    role: "Zero Waste Store Owner",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
  },
  {
    text: "Finding local, sustainable products has never been easier. I love supporting eco-friendly businesses in my community.",
    author: "Michael Roberts",
    role: "Conscious Consumer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  },
  {
    text: "The gesture control feature makes shopping hands-free and hygienic. It's the future of sustainable retail!",
    author: "Emily Thompson",
    role: "Tech Enthusiast",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
  }
]

const BackgroundVideo = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = [
    '/5072660-hd_1920_1080_25fps.mp4',
    '/8447058-hd_1920_1080_24fps.mp4',
    '/vendors/8541075-hd_1080_1920_30fps.mp4'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      zIndex={0}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1,
      }}
    >
      <video
        key={videos[currentVideo]}
        autoPlay
        muted
        loop
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
        }}
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>
    </Box>
  );
};

export default function Home() {
  const [showWebcam, setShowWebcam] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { scrollY } = useScroll()
  const { t } = useLanguage()
  const { user, isAuthenticated } = useUser()

  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <Box minH="100vh">
      <Navbar />
      
      {/* Hero Section */}
      <MotionBox
        as="section"
        style={{ opacity: heroOpacity, scale: heroScale }}
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <BackgroundVideo />
        <MotionBox
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)"
          style={{
            y: useTransform(scrollY, [0, 300], [0, 150]),
          }}
          zIndex={1}
        />
        <Container maxW="container.xl" position="relative" zIndex={2}>
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            justify="space-between"
            gap={12}
          >
            <MotionFlex
              direction="column"
              align={{ base: 'center', lg: 'start' }}
              spacing={8}
              maxW="2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                mb={6}
              >
                <Image
                  src="/সবুজহাট.png"
                  alt="সবুজহাট Logo"
                  width={200}
                  height={80}
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
                  }}
                />
              </MotionBox>

              {isAuthenticated && user ? (
                <UserProfile user={user} />
              ) : (
                <>
                  <Heading
                    as="h1"
                    size="3xl"
                    lineHeight="shorter"
                    textAlign={{ base: 'center', lg: 'left' }}
                  >
                    {t('welcome')} <br />
                    <Text as="span" bgGradient="linear(to-r, eco.200, white)" bgClip="text">
                      {t('tagline')}
                    </Text>
                  </Heading>
                  <Text 
                    fontSize="xl" 
                    textAlign={{ base: 'center', lg: 'left' }}
                    color="whiteAlpha.900"
                  >
                    {t('description')}
                  </Text>
                  <HStack spacing={6}>
                    <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        colorScheme="white"
                        variant="solid"
                        bg="white"
                        color="eco.600"
                        rounded="full"
                        px={8}
                        rightIcon={<FaArrowRight />}
                        onClick={() => window.location.href = '/vendors'}
                      >
                        {t('exploreMarketplace')}
                      </Button>
                    </MotionBox>
                    <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        variant="outline"
                        colorScheme="white"
                        rounded="full"
                        px={8}
                        onClick={() => window.location.href = '/auth/signup'}
                        leftIcon={<FaUser />}
                      >
                        {t('getStarted')}
                      </Button>
                    </MotionBox>
                  </HStack>
                </>
              )}
              
              <HStack spacing={4}>
                <Badge colorScheme="green" p={2} borderRadius="full">
                  {t('ecofriendly')}
                </Badge>
                <Badge colorScheme="purple" p={2} borderRadius="full">
                  {t('sustainable')}
                </Badge>
                <Badge colorScheme="blue" p={2} borderRadius="full">
                  {t('local')}
                </Badge>
              </HStack>
            </MotionFlex>
            
            <MotionBox
              w={{ base: 'full', lg: '50%' }}
              h="500px"
              position="relative"
              borderRadius="3xl"
              overflow="hidden"
              boxShadow="2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {showWebcam ? (
                <WebcamComponent
                  loadingText={t('loading')}
                  permissionText={t('cameraPermission')}
                  allowCameraText={t('allowCamera')}
                  noGestureText={t('noGesture')}
                  gestureDetectedText={t('gestureDetected')}
                />
              ) : (
                <ChakraImage
                  src="https://images.unsplash.com/photo-1511795409834-432f7b72bcf4"
                  alt="Eco-friendly market"
                  objectFit="cover"
                  w="full"
                  h="full"
                  transition="transform 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                />
              )}
              <Button
                position="absolute"
                bottom={4}
                right={4}
                leftIcon={<FaVideo />}
                onClick={() => setShowWebcam(!showWebcam)}
                colorScheme="blackAlpha"
                variant="solid"
                backdropFilter="blur(8px)"
              >
                {showWebcam ? t('hideCamera') : t('showCamera')}
              </Button>
            </MotionBox>
          </Flex>
        </Container>
      </MotionBox>

      {/* Stats Section */}
      <Container maxW="container.xl" position="relative" mt="-80px" zIndex={1}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <StatBox
            icon={FaStore}
            label="Eco Vendors"
            value="500+"
            helpText="Active sustainable businesses"
          />
          <StatBox
            icon={FaUsers}
            label="Happy Users"
            value="10K+"
            helpText="Conscious consumers"
          />
          <StatBox
            icon={FaTree}
            label="CO₂ Reduced"
            value="50t"
            helpText="Monthly carbon impact"
          />
          <StatBox
            icon={FaRecycle}
            label="Waste Saved"
            value="2000kg"
            helpText="Monthly plastic reduction"
          />
        </SimpleGrid>
      </Container>

      {/* Features Section */}
      <MotionContainer 
        maxW="container.xl" 
        py={24}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={16}>
          <VStack spacing={6} textAlign="center" maxW="3xl">
            <Heading size="2xl">{t('featuresTitle')}</Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize="xl">
              {t('featuresDescription')}
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            <Feature
              icon={FaLeaf}
              title={t('features.marketplace')}
              description={t('featureDescriptions.marketplace')}
            />
            <Feature
              icon={FaRecycle}
              title={t('features.chat')}
              description={t('featureDescriptions.chat')}
            />
            <Feature
              icon={FaHandshake}
              title={t('features.gesture')}
              description={t('featureDescriptions.gesture')}
            />
            <Feature
              icon={FaSearch}
              title={t('features.local')}
              description={t('featureDescriptions.local')}
            />
          </SimpleGrid>
        </VStack>
      </MotionContainer>

      {/* Benefits Grid */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading 
                size="2xl" 
                position="relative"
                display="inline-block"
                _after={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: '60%',
                  height: '4px',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(to right, #48BB78, #4299E1)',
                  borderRadius: 'full',
                }}
              >
                <MotionBox
                  display="inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Text
                    as="span"
                    bgGradient="linear(to-r, green.400, teal.400, blue.500)"
                    bgClip="text"
                    fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                    fontWeight="extrabold"
                    letterSpacing="wider"
                    _hover={{
                      bgGradient: "linear(to-r, purple.400, pink.400, orange.400)",
                    }}
                    transition="all 0.3s ease"
                    textShadow="0 0 20px rgba(72, 187, 120, 0.2)"
                  >
                    সবুজহাট
                  </Text>
                </MotionBox>
              </Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="xl" maxW="2xl">
                {t('joinCommunity')}
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {([
                {
                  icon: FaSeedling,
                  title: "Verified Sustainable",
                  description: "All vendors are vetted for their eco-friendly practices"
                },
                {
                  icon: FaHandshake,
                  title: "Direct Connection",
                  description: "Chat directly with local eco-friendly vendors"
                },
                {
                  icon: FaLeaf,
                  title: "Impact Tracking",
                  description: "See your environmental impact with every purchase"
                }
              ] as Benefit[]).map((benefit, index) => (
                <MotionCard
                  key={index}
                  whileHover={{ y: -10, boxShadow: '2xl' }}
                  transition={{ duration: 0.2 }}
                  bg={useColorModeValue('white', 'gray.800')}
                  borderRadius="2xl"
                  overflow="hidden"
                >
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Icon as={benefit.icon} w={8} h={8} color="eco.500" />
                      <Heading size="md">{benefit.title}</Heading>
                      <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        {benefit.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading size="2xl" textAlign="center">What Our Users Say</Heading>
            
            <Flex position="relative" w="full" align="center">
              <IconButton
                aria-label="Previous testimonial"
                icon={<FaChevronLeft />}
                onClick={prevTestimonial}
                position="absolute"
                left={-4}
                zIndex={2}
                rounded="full"
                colorScheme="eco"
                variant="ghost"
              />
              
              <AnimatePresence mode="wait">
                <MotionBox
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  w="full"
                  px={12}
                >
                  <VStack spacing={6} maxW="3xl" mx="auto" textAlign="center">
                    <Icon as={FaQuoteLeft} w={8} h={8} color="eco.500" />
                    <Text fontSize="xl" fontStyle="italic" color={useColorModeValue('gray.600', 'gray.300')}>
                      {testimonials[currentTestimonial].text.split('সবুজহাট').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {i > 0 && (
                            <MotionBox
                              as="span"
                              display="inline-block"
                              whileHover={{ scale: 1.1 }}
                              bgGradient="linear(to-r, green.400, teal.400)"
                              bgClip="text"
                              fontWeight="bold"
                            >
                              সবুজহাট
                            </MotionBox>
                          )}
                          {part}
                        </React.Fragment>
                      ))}
                    </Text>
                    <VStack>
                      <Avatar size="lg" src={testimonials[currentTestimonial].image} />
                      <Box textAlign="center">
                        <Text fontWeight="bold" fontSize="lg">
                          {testimonials[currentTestimonial].author}
                        </Text>
                        <Text color={useColorModeValue('gray.600', 'gray.400')}>
                          {testimonials[currentTestimonial].role}
                        </Text>
                      </Box>
                    </VStack>
                  </VStack>
                </MotionBox>
              </AnimatePresence>

              <IconButton
                aria-label="Next testimonial"
                icon={<FaChevronRight />}
                onClick={nextTestimonial}
                position="absolute"
                right={-4}
                zIndex={2}
                rounded="full"
                colorScheme="eco"
                variant="ghost"
              />
            </Flex>
          </VStack>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <MotionBox 
        bg={useColorModeValue('eco.50', 'eco.900')} 
        py={24}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl">{t('ctaTitle')}</Heading>
            <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')} maxW="2xl">
              {t('ctaDescription')}
            </Text>
            <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                colorScheme="eco"
                rounded="full"
                px={8}
                onClick={() => window.location.href = '/vendors'}
                rightIcon={<FaArrowRight />}
              >
                {t('ctaButton')}
              </Button>
            </MotionBox>
          </VStack>
        </Container>
      </MotionBox>

      {/* New Feature Section - EcoLocal */}
      <VStack spacing={10} align="center" py={10}>
        <Heading size="2xl" color="green.300">EcoLocal: Sustainable Marketplace</Heading>
        <Text fontSize="xl" color="green.200" maxW="2xl" textAlign="center">
          Empower your eco-friendly lifestyle with carbon tracking, green delivery, and sustainable shopping.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full" maxW="6xl">
          <FeatureCard
            title="Carbon Footprint Calculator"
            description="Calculate your impact and discover ways to reduce your carbon footprint."
            href="/carbon"
          />
          <FeatureCard
            title="Green Route Delivery"
            description="Choose the most eco-friendly delivery routes for your orders."
            href="/routes"
          />
          <FeatureCard
            title="EcoTips Lifestyle Tracker"
            description="Track your daily eco habits and get personalized tips."
            href="/ecotips"
          />
          <FeatureCard
            title="Green Tag Products"
            description="Shop products with verified green tags for sustainability."
            href="/greentag"
          />
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

function FeatureCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Box bg="black" borderRadius="lg" boxShadow="lg" p={6} border="1px solid" borderColor="green.700" _hover={{ borderColor: 'green.400', boxShadow: '0 0 0 2px #00cc00' }} transition="all 0.2s">
      <Heading size="md" color="green.300" mb={2}>{title}</Heading>
      <Text color="green.100" mb={4}>{description}</Text>
      <Button as={Link} href={href} colorScheme="green" variant="solid" w="full">
        Explore
      </Button>
    </Box>
  );
}