import {
  Box,
  Container,
  VStack,
  Input,
  Button,
  Text,
  Flex,
  Avatar,
} from '@chakra-ui/react'
import Navbar from '../../components/Navbar'

export default function Chat() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Container maxW="container.md" py={8}>
        <VStack spacing={4} align="stretch" h="calc(100vh - 200px)">
          <Box
            flex="1"
            bg="white"
            borderRadius="lg"
            p={4}
            overflowY="auto"
            boxShadow="sm"
          >
            <VStack spacing={4} align="stretch">
              {/* Bot Message */}
              <Flex gap={3}>
                <Avatar
                  name="EcoBot"
                  src="https://bit.ly/broken-link"
                  bg="eco.500"
                />
                <Box
                  bg="gray.100"
                  p={3}
                  borderRadius="lg"
                  maxW="80%"
                >
                  <Text>Hello! I'm your eco-friendly shopping assistant. How can I help you today?</Text>
                </Box>
              </Flex>

              {/* User Message */}
              <Flex gap={3} justify="flex-end">
                <Box
                  bg="eco.100"
                  p={3}
                  borderRadius="lg"
                  maxW="80%"
                >
                  <Text>What are some sustainable products I can buy locally?</Text>
                </Box>
                <Avatar
                  name="User"
                  src="https://bit.ly/broken-link"
                  bg="gray.500"
                />
              </Flex>
            </VStack>
          </Box>

          <Flex gap={2}>
            <Input
              placeholder="Type your message..."
              bg="white"
              flex="1"
            />
            <Button colorScheme="green">Send</Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  )
} 