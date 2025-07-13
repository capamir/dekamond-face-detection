// src/components/WebcamCapture.tsx
import React, { useEffect, useRef, useState } from 'react';
import { loadModels } from '../services/faceApi';
import { useFaceOrientation } from '../hooks/useFaceOrientation';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  requiredOrientation: 'straight' | 'left' | 'right';
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, requiredOrientation }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [pendingTimeout, setPendingTimeout] = useState<number | null>(null);

  const { orientation } = useFaceOrientation(videoRef.current, modelsLoaded);

  // Load FaceAPI models
  useEffect(() => {
    loadModels().then(() => setModelsLoaded(true));
  }, []);

  // Start webcam
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setStreamError((err as Error).message);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Reset when orientation step changes
  useEffect(() => {
    setHasCaptured(false);
    if (pendingTimeout) {
      clearTimeout(pendingTimeout);
      setPendingTimeout(null);
    }
  }, [requiredOrientation]);

  // Trigger auto-capture with delay
  useEffect(() => {
    if (!hasCaptured && orientation === requiredOrientation) {
      // Start delayed capture
      const timeoutId = window.setTimeout(() => {
        handleCapture();
      }, 2000); // 2 second delay
      setPendingTimeout(timeoutId);
    } else {
      // Cancel delayed capture if orientation no longer matches
      if (pendingTimeout) {
        clearTimeout(pendingTimeout);
        setPendingTimeout(null);
      }
    }
  }, [orientation, requiredOrientation, hasCaptured]);

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
      setHasCaptured(true);
    }
  };

  return (
    <div>
      {streamError && <p style={{ color: 'red' }}>Webcam error: {streamError}</p>}

      <div
        style={{
          border: `4px solid ${orientation === requiredOrientation ? 'green' : 'red'}`,
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
        {streamError && <p style={{ color: 'red' }}>Webcam error: {streamError}</p>}

        {!modelsLoaded ? (
          <p style={{ color: 'gray' }}>🔄 Loading face detection models...</p>
        ) : orientation === 'unknown' ? (
          <p style={{ color: 'gray' }}>🧠 Waiting for face...</p>
        ) : (
          <>
            <p>Detected: <strong>{orientation}</strong></p>
            <p>Required: <strong>{requiredOrientation}</strong></p>
            {hasCaptured && <p style={{ color: 'green' }}>✅ Captured</p>}
            {!hasCaptured && orientation === requiredOrientation && (
              <p style={{ color: 'orange' }}>⏳ Capturing in 2 seconds...</p>
            )}
          </>
        )}
      </div>


      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WebcamCapture;
