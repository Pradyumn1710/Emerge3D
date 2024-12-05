import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}
const CaptureImage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [text, setText] = useState("");
  const startCamera = async () => {
    const constraints = { video: { facingMode: "user" } };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const imageData = canvasRef.current.toDataURL("image/jpeg");
    sendImageToServer(imageData);
  };

  const sendImageToServer = async (imageData) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/images",
        { image: imageData },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.headers["content-type"].includes("application/json")) {
        if (response.data.message) {
          setText((prevText) => prevText + response.data.message);
          console.log(response.data.message);
        } else {
          console.log("Received JSON response without message");
        }
      } else {
        console.log("Received non-JSON response");
      }
    } catch (error) {
      if (error.response) {
        console.error(`HTTP error! status: ${error.response.status}`);
      } else {
        console.error("Error: ", error.message);
      }
    }
  };

  useEffect(() => {
    const handleSpacebarPress = (event) => {
      if (event.keyCode === 32) {
        captureImage();
      }
    };

    const handleBackspacePress = (event) => {
      if (event.keyCode === 8) {
        setText((prevText) => prevText.slice(0, -1));
      }
    };

    window.addEventListener("keydown", handleSpacebarPress);
    window.addEventListener("keydown", handleBackspacePress);

    return () => {
      window.removeEventListener("keydown", handleSpacebarPress);
      window.removeEventListener("keydown", handleBackspacePress);
    };
  }, []);
  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div>
      <div>
        <video ref={videoRef} autoPlay></video>
        <canvas ref={canvasRef} width="320" height="240"></canvas>
      </div>
      <div>
        <div>{text}</div>
        <button onClick={captureImage}>Capture Image</button>
      </div>
    </div>
  );
}

export default CaptureImage;