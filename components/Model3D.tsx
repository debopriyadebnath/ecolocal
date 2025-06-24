'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Stage } from '@react-three/drei'
import {
  Box,
  Spinner,
  useColorModeValue,
  Text,
  Center,
  VStack,
} from '@chakra-ui/react'
import type { GLTF } from 'three-stdlib'
import { Group } from 'three'

export interface ModelProps {
  modelPath: string
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  autoRotate?: boolean
}

function Model({ 
  modelPath, 
  scale = 1, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  autoRotate = false 
}: ModelProps) {
  const gltf = useGLTF(modelPath) as GLTF
  const scene = gltf.scene
  const groupRef = useRef<Group>(null)

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        useGLTF.preload(modelPath)
      }
    }
  }, [modelPath])

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
    >
      <primitive 
        object={scene} 
        scale={scale}
      />
    </group>
  )
}

export default function Model3D({ 
  modelPath, 
  scale = 1, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  autoRotate = false 
}: ModelProps) {
  const [isLoading, setIsLoading] = useState(true)
  const bgColor = useColorModeValue('gray.50', 'gray.800')

  useEffect(() => {
    const loadModel = async () => {
      try {
        await useGLTF.preload(modelPath)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading model:', error)
        setIsLoading(false)
      }
    }
    loadModel()
  }, [modelPath])

  return (
    <Box 
      w="100%" 
      h="100%" 
      position="relative" 
      bg={bgColor}
      borderRadius="xl"
      overflow="hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        shadows
      >
        <Suspense fallback={null}>
          <Stage>
            <Model 
              modelPath={modelPath} 
              scale={scale} 
              position={position} 
              rotation={rotation}
              autoRotate={autoRotate}
            />
          </Stage>
          <Environment preset="city" />
        </Suspense>
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {isLoading && (
        <Center 
          position="absolute" 
          top="0" 
          left="0" 
          w="full" 
          h="full" 
          bg={bgColor}
        >
          <VStack spacing={4}>
            <Spinner size="xl" color="eco.500" />
            <Text>Loading 3D Model...</Text>
          </VStack>
        </Center>
      )}
    </Box>
  )
}
