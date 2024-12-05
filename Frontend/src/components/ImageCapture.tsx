import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const ImageCapture = ({ onCapture, capturedImages }) => {
  const webcamRef = useRef(null);

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  return (
    <Card className="w-full bg-gray-800">
      <CardContent className="p-6">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full rounded-lg shadow-lg mb-4"
        />
        <Button onClick={captureImage} className="w-full">
          Capture Image
        </Button>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {capturedImages.map((img, index) => (
            <img key={index} src={img} alt={`Captured ${index}`} className="w-full h-24 object-cover rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCapture;

