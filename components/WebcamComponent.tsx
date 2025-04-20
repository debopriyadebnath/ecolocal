'use client'

import React, { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Box, Text, VStack, Spinner, useColorModeValue } from '@chakra-ui/react'
import * as handpose from '@tensorflow-models/handpose'
import '@tensorflow/tfjs'

interface WebcamComponentProps {
  loadingText: string
  permissionText: string
  allowCameraText: string
  noGestureText: string
  gestureDetectedText: string
  onGestureDetected?: (gesture: string | null) => void
}

export default function WebcamComponent({
  loadingText,
  permissionText,
  allowCameraText,
  noGestureText,
  gestureDetectedText,
  onGestureDetected,
}: WebcamComponentProps) {
  const webcamRef = useRef<Webcam>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(true)
  const [model, setModel] = useState<handpose.HandPose | null>(null)
  const [lastGesture, setLastGesture] = useState<string | null>(null)
  const [gestureTimeout, setGestureTimeout] = useState<NodeJS.Timeout | null>(null)

  const textColor = useColorModeValue('gray.600', 'gray.300')
  const overlayBg = useColorModeValue('whiteAlpha.800', 'blackAlpha.800')

  useEffect(() => {
    const loadModel = async () => {
      try {
        const handModel = await handpose.load()
        setModel(handModel)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading handpose model:', error)
        setIsLoading(false)
      }
    }
    loadModel()
    return () => {
      if (gestureTimeout) clearTimeout(gestureTimeout)
    }
  }, [])

  const detectGestures = async (predictions: handpose.AnnotatedPrediction[]) => {
    if (predictions.length === 0) {
      setLastGesture(null)
      onGestureDetected?.(null)
      return
    }

    const fingers = predictions[0].annotations
    const thumb = fingers.thumb
    const indexFinger = fingers.indexFinger
    const middleFinger = fingers.middleFinger
    const ringFinger = fingers.ringFinger
    const pinky = fingers.pinky

    // Helper function to calculate finger angles
    const calculateAngle = (finger: number[][]) => {
      const [x1, y1] = finger[1]
      const [x2, y2] = finger[2]
      const [x3, y3] = finger[3]
      return Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2)
    }

    // Detect thumbs up (Accept order)
    const isThumbsUp = thumb[3][1] < thumb[0][1] && 
      indexFinger[3][1] > indexFinger[0][1] &&
      middleFinger[3][1] > middleFinger[0][1] &&
      ringFinger[3][1] > ringFinger[0][1] &&
      pinky[3][1] > pinky[0][1]

    // Detect thumbs down (Cancel order)
    const isThumbsDown = thumb[3][1] > thumb[0][1] && 
      indexFinger[3][1] > indexFinger[0][1] &&
      middleFinger[3][1] > middleFinger[0][1] &&
      ringFinger[3][1] > ringFinger[0][1] &&
      pinky[3][1] > pinky[0][1]

    // Detect OK sign (Complete order)
    const isOkSign = 
      Math.abs(thumb[3][0] - indexFinger[3][0]) < 30 &&
      Math.abs(thumb[3][1] - indexFinger[3][1]) < 30 &&
      middleFinger[3][1] < middleFinger[0][1] &&
      ringFinger[3][1] < ringFinger[0][1] &&
      pinky[3][1] < pinky[0][1]

    // Detect swipe left (Previous order)
    const isSwipeLeft = 
      indexFinger[3][0] < indexFinger[0][0] - 100 &&
      middleFinger[3][1] > middleFinger[0][1] &&
      ringFinger[3][1] > ringFinger[0][1] &&
      pinky[3][1] > pinky[0][1]

    // Detect swipe right (Next order)
    const isSwipeRight = 
      indexFinger[3][0] > indexFinger[0][0] + 100 &&
      middleFinger[3][1] > middleFinger[0][1] &&
      ringFinger[3][1] > ringFinger[0][1] &&
      pinky[3][1] > pinky[0][1]

    // Original gestures
    const isOpenHand = thumb[3][1] < indexFinger[3][1] &&
      Math.abs(indexFinger[3][1] - middleFinger[3][1]) < 20 &&
      Math.abs(middleFinger[3][1] - ringFinger[3][1]) < 20 &&
      Math.abs(ringFinger[3][1] - pinky[3][1]) < 20

    const isPointingHand = indexFinger[3][1] < middleFinger[0][1] &&
      middleFinger[3][1] > middleFinger[0][1] &&
      ringFinger[3][1] > ringFinger[0][1] &&
      pinky[3][1] > pinky[0][1]

    const isClosedHand = thumb[3][1] > indexFinger[0][1] &&
      indexFinger[3][1] > indexFinger[0][1] &&
      middleFinger[3][1] > middleFinger[0][1] &&
      ringFinger[3][1] > ringFinger[0][1] &&
      pinky[3][1] > pinky[0][1]

    let detectedGesture = null
    if (isThumbsUp) detectedGesture = 'acceptOrder'
    else if (isThumbsDown) detectedGesture = 'cancelOrder'
    else if (isOkSign) detectedGesture = 'completeOrder'
    else if (isSwipeLeft) detectedGesture = 'previousOrder'
    else if (isSwipeRight) detectedGesture = 'nextOrder'
    else if (isOpenHand) detectedGesture = 'openHand'
    else if (isPointingHand) detectedGesture = 'pointingHand'
    else if (isClosedHand) detectedGesture = 'closedHand'

    // Debounce gesture detection
    if (detectedGesture !== lastGesture) {
      if (gestureTimeout) clearTimeout(gestureTimeout)
      const timeout = setTimeout(() => {
        setLastGesture(detectedGesture)
        onGestureDetected?.(detectedGesture)
      }, 500) // Delay to prevent rapid gesture switching
      setGestureTimeout(timeout)
    }
  }

  const capture = async () => {
    if (webcamRef.current && model) {
      try {
        const predictions = await model.estimateHands(
          webcamRef.current.video as HTMLVideoElement
        )
        await detectGestures(predictions)
      } catch (error) {
        console.error('Error during hand detection:', error)
      }
    }
  }

  useEffect(() => {
    if (!isLoading && model) {
      const interval = setInterval(capture, 100)
      return () => clearInterval(interval)
    }
  }, [isLoading, model])

  if (!hasPermission) {
    return (
      <VStack justify="center" align="center" h="full" spacing={4}>
        <Text color={textColor}>{permissionText}</Text>
        <Text color={textColor} fontSize="sm">
          {allowCameraText}
        </Text>
      </VStack>
    )
  }

  return (
    <Box position="relative" width="100%" height="100%">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: 'user',
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '1rem',
        }}
        onUserMedia={() => setHasPermission(true)}
        onUserMediaError={() => setHasPermission(false)}
      />

      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        p={4}
        bg={overlayBg}
        borderBottomRadius="1rem"
      >
        <Text color={textColor} fontWeight="medium" textAlign="center">
          {isLoading ? (
            <VStack spacing={2}>
              <Spinner size="sm" color="eco.500" />
              <Text>{loadingText}</Text>
            </VStack>
          ) : lastGesture ? (
            `${gestureDetectedText}: ${lastGesture}`
          ) : (
            noGestureText
          )}
        </Text>
      </Box>
    </Box>
  )
}