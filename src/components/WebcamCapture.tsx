import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadModels, detectFace } from '../services/faceApi';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State to track if face-api.js models are loaded
  const [loadingModels, setLoadingModels] = useState(true);
  // State to track if a face is detected in the current video frame
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  // Load the face-api.js models once on component mount
  useEffect(() => {
    loadModels()
      .then(() => {
        setLoadingModels(false);
      })
      .catch((err) => {
        console.error('Failed to load face-api models:', err);
      });
  }, []);

  // Start the webcam stream on mount and clean up on unmount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    startCamera();

    return () => {
      // Stop all video tracks when component unmounts
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // Face detection loop function wrapped with useCallback for stable reference
  const detectLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused || video.ended) {
      requestAnimationFrame(detectLoop);
      return;
    }

    // Only run detection if models have finished loading
    if (!loadingModels) {
      detectFace(video)
        .then((detection) => {
          setIsFaceDetected(!!detection);
        })
        .catch((err) => {
          console.error('Face detection error:', err);
          setIsFaceDetected(false);
        });
    }

    requestAnimationFrame(detectLoop);
  }, [loadingModels]);

  // Start detection loop after models are loaded
  useEffect(() => {
    if (!loadingModels) {
      detectLoop();
    }
  }, [loadingModels, detectLoop]);

  // Capture the current frame as a base64 image
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      onCapture(dataUrl);
    }
  };

  return (
    <div>
      <div
        style={{
          border: `4px solid ${isFaceDetected ? 'green' : 'red'}`,
          width: 'fit-content',
          display: 'inline-block',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: 400, height: 300, objectFit: 'cover' }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={handleCapture} disabled={!isFaceDetected || loadingModels}>
          {loadingModels ? 'Loading Models...' : isFaceDetected ? 'Capture' : 'Face Not Detected'}
        </button>
      </div>

      {/* Hidden canvas to draw captured image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WebcamCapture;
