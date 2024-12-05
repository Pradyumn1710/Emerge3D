'use client'

import { useEffect, useRef, useState } from 'react'
import ThreeDRenderer from '@/components/ThreeDRenderer'

export default function Home() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    }

    initCamera()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageSrc = canvas.toDataURL('image/png')
        setCapturedImage(imageSrc)
      }
    }
  }

  const generate3DImage = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setGeneratedImage('/indoor_item.ply')
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex bg-black text-white">
      <div className="flex w-full h-screen">
        {/* Camera Card - 1/3 Width */}
        <div className="w-1/3 bg-gray-800 p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Camera</h2>
          <div className="flex-grow relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-md"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="mt-4">
            <button
              onClick={captureImage}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full"
            >
              Capture Image
            </button>
          </div>
          {capturedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Captured Image</h3>
              <img src={capturedImage} alt="Captured" className="w-32 h-32 object-cover rounded-md" />
            </div>
          )}
        </div>

        {/* 3D Image Generator - 2/3 Width */}
        <div className="w-2/3 bg-gray-900 p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">3D Image Generator</h2>
          <div className="flex-grow bg-gray-700 rounded-md mb-4 flex items-center justify-center">
            {loading ? (
              <div className="flex items-center justify-center h-full w-full">
                <div className="w-16 h-16 border-t-4 border-b-4 border-green-500 rounded-full animate-spin"></div>
              </div>
            ) : generatedImage ? (
              <ThreeDRenderer plyFile={generatedImage} />
            ) : (
              <p className="text-gray-400">3D Model will appear here...</p>
            )}
          </div>
          <button
            onClick={generate3DImage}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50"
            disabled={loading}
          >
            Generate 3D Image
          </button>
        </div>
      </div>
    </main>
  )
}

