'use client'

import { Box } from '@chakra-ui/react'
import { useRef } from 'react'
import Webcam from 'react-webcam'

const WebcamComponent = () => {
  const webcamRef = useRef<Webcam>(null)

  const videoConstraints = {
    width: 720,
    height: 480,
    facingMode: "user"
  }

  return (
    <Box width="100%" maxWidth="720px" margin="0 auto">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{ width: '100%', height: 'auto' }}
      />
    </Box>
  )
}

export default WebcamComponent