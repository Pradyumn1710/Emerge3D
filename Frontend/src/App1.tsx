'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios'; // Add Axios import for backend communication
import ThreeDRenderer from '@/components/ThreeDRenderer';

export default function Home() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const sendImageToServer = async (imageData: string) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/images',
        { image: imageData },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.message) {
        console.log('Backend response:', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error(`HTTP error! Status: ${error.response.status}`);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL('image/png');
        setCapturedImage(imageSrc);

        // Send image to backend
        sendImageToServer(imageSrc);
      }
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64String = reader.result as string;
        setUploadedImage(base64String);

        // Optionally send the uploaded image to the backend
        await sendImageToServer(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  const generate3DImage = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setGeneratedImage('/indoor_item.ply');
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex bg-black text-white">
      <div className="flex w-full h-screen">
        {/* Camera Card - 1/3 Width */}
        <div className="w-1/3 bg-gray-900 p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Camera</h2>
          <div className="flex-grow relative border border-gray-100 p-2">
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
              className=" text-white py-2 px-4 rounded-lg w-full bg-blue-300"
            >
              Capture Image
            </button>
          </div>
          {/* {capturedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Captured Image</h3>
              <img src={capturedImage} alt="Captured" className="w-32 h-32 object-cover rounded-md" />
            </div>
          )} */}

          <div className="mt-4">
            {/* <label
              htmlFor="image-upload"
              className=" text-white py-2 px-4 rounded-lg w-full"
            >
              Upload Image
            </label> */}
            {/* <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="text-white py-2 px-4 rounded-lg w-full bg-blue-300 "
              onChange={handleUpload}
            /> */}
            <button className='text-white py-2 px-4 rounded-lg w-full bg-blue-300'>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className=" hidden "
              onChange={handleUpload}
            />
            Upload Image
            </button>
          </div>
          {uploadedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Uploaded Image</h3>
              <img src={uploadedImage} alt="Uploaded" className="w-32 h-32 object-cover rounded-md" />
            </div>
          )}
        </div>

        {/* 3D Image Generator - 2/3 Width */}
        <div className="w-2/3  p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">3D Image Generator</h2>
          <div className="flex-grow  rounded-md mb-4 flex items-center justify-center">
            {loading ? (
              <div className="flex items-center justify-center h-full w-full">
                <div className="w-16 h-16 border-t-4 border-b-4 border-blue-300 rounded-full animate-spin"></div>
              </div>
            ) : generatedImage ? (
              <ThreeDRenderer plyFile={generatedImage} />
            ) : (
              <p className="border border-gray-100 p-72 text-gray-400">3D Model will appear here...</p>
            )}
          </div>
          <button
            onClick={generate3DImage}
            className="bg-blue-300 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50"
            disabled={loading}
          >
            Generate 3D Image
          </button>
        </div>
      </div>
    </main>
  );
}
