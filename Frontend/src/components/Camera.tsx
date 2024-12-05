'use client'

import { useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface CameraProps {
  onCapture: (imageSrc: string) => void
}

export default function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
      }
    } catch (err) {
      console.error("Error accessing the camera:", err)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
      const imageSrc = canvas.toDataURL('image/jpeg')
      onCapture(imageSrc)
    }
  }, [onCapture])

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      {!isStreaming ? (
        <Button onClick={startCamera} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Start Camera
        </Button>
      ) : (
        <>
          <video ref={videoRef} autoPlay className="w-full rounded-lg mb-4" />
          <Button onClick={capturePhoto} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Capture Photo
          </Button>
        </>
      )}
    </div>
  )
}

