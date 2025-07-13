/**
 * CameraCapture.tsx
 * Component to capture a photo from the user's webcam and validate face detection.
 */

import React, { useEffect, useRef, useState } from 'react';
import { detectFaces } from '../utils/faceApi';

interface CameraCaptureProps {
  onCapture: (photoDataUrl: string) => void;
  instruction: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, instruction }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraReady(true);
        }
      } catch (err) {
        setError('Unable to access camera. Please allow camera permissions.');
      }
    }
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Validate face detection
    const faceCount = await detectFaces(canvas);
    if (faceCount !== 1) {
      setError('Please ensure exactly one face is visible in the frame.');
      return;
    }

    const photoDataUrl = canvas.toDataURL('image/png');
    setError(null);
    onCapture(photoDataUrl);
  };

  return (
    <div>
      <p>{instruction}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <video ref={videoRef} style={{ width: '100%', maxWidth: 400 }} />
      <button onClick={handleCapture} disabled={!isCameraReady} style={{ marginTop: 10 }}>
        Capture Photo
      </button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;
