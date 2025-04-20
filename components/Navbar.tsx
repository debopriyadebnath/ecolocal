'use client'

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Select,
  Container,
  Collapse,
  Text,
  Stack,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useLanguage } from '../app/language-context'
import { useUser } from '../app/user-context'
import { motion } from 'framer-motion'
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const MotionFlex = motion(Flex)

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const { language, setLanguage, t } = useLanguage()
  const { user, setUser, isAuthenticated } = useUser()
  const router = useRouter()

  const navBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.100', 'gray.700')

  const handleSignOut = () => {
    setUser(null)
    router.push('/')
  }

  return (
    <Box 
      bg={navBg} 
      position="sticky" 
      top={0} 
      zIndex={1000}
      borderBottom="1px" 
      borderColor={borderColor}
      backdropFilter="blur(8px)"
      backgroundColor={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')}
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justify="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
          />
          
          <MotionFlex 
            align="center" 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            cursor="pointer"
            onClick={() => router.push('/')}
          >
            <Text 
              fontSize="2xl" 
              fontWeight="bold" 
              bgGradient="linear(to-r, green.400, teal.400, blue.500)"
              bgClip="text"
              letterSpacing="wider"
              position="relative"
              css={{
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  width: "100%",
                  height: "2px",
                  background: "linear-gradient(to right, #48BB78, #4299E1)",
                  transform: "scaleX(0)",
                  transformOrigin: "right",
                  transition: "transform 0.3s ease"
                },
                "&:hover::after": {
                  transform: "scaleX(1)",
                  transformOrigin: "left"
                }
              }}
            >
              সবুজহাট
            </Text>
          </MotionFlex>

          <HStack spacing={8} alignItems="center" display={{ base: 'none', md: 'flex' }}>
            <Button variant="ghost" _hover={{ color: 'eco.500' }} onClick={() => router.push('/vendors')}>
              {t('vendors')}
            </Button>
            <Button variant="ghost" _hover={{ color: 'eco.500' }} onClick={() => router.push('/chat')}>
              {t('chatTitle')}
            </Button>
            <Button variant="ghost" _hover={{ color: 'eco.500' }} onClick={() => router.push('/gesture')}>
              {t('gestureControl')}
            </Button>
            <Divider orientation="vertical" h="20px" />
            {isAuthenticated ? (
              <Menu>
                <MenuButton>
                  <Avatar
                    size="sm"
                    name={user?.name}
                    src={user?.avatarUrl}
                    bg="eco.500"
                    cursor="pointer"
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FaUser />}>Profile</MenuItem>
                  <MenuItem icon={<FaCog />}>Settings</MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<FaSignOutAlt />} onClick={handleSignOut}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button 
                variant="ghost" 
                _hover={{ color: 'eco.500' }} 
                onClick={() => router.push('/auth/signin')}
                leftIcon={<FaUser />}
              >
                {t('signIn')}
              </Button>
            )}
          </HStack>

          <HStack spacing={4}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              size="sm"
              width="auto"
              borderRadius="lg"
              bg={useColorModeValue('white', 'gray.700')}
            >
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
            </Select>

            <IconButton
              aria-label="Toggle Color Mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              _hover={{ color: 'eco.500' }}
            />
          </HStack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" spacing={2}>
              <Button variant="ghost" w="100%" _hover={{ bg: 'eco.50' }} onClick={() => router.push('/vendors')}>
                {t('vendors')}
              </Button>
              <Button variant="ghost" w="100%" _hover={{ bg: 'eco.50' }} onClick={() => router.push('/chat')}>
                {t('chatTitle')}
              </Button>
              <Button variant="ghost" w="100%" _hover={{ bg: 'eco.50' }} onClick={() => router.push('/gesture')}>
                {t('gestureControl')}
              </Button>
              <Divider />
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    w="100%" 
                    _hover={{ bg: 'eco.50' }} 
                    leftIcon={<FaUser />}
                  >
                    Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    w="100%" 
                    _hover={{ bg: 'eco.50' }} 
                    leftIcon={<FaSignOutAlt />}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  w="100%" 
                  _hover={{ bg: 'eco.50' }} 
                  onClick={() => router.push('/auth/signin')}
                  leftIcon={<FaUser />}
                >
                  {t('signIn')}
                </Button>
              )}
            </Stack>
          </Box>
        </Collapse>
      </Container>
    </Box>
  )
}