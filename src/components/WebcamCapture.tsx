import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadModels, detectFace } from '../services/faceApi';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);

  // Load models once
  useEffect(() => {
    loadModels().then(() => {
      setLoadingModels(false);
    });
  }, []);

  // Setup webcam feed
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    startCamera();
    return () => {
      // Stop webcam on unmount
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  // Face detection loop
  const detectLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused || video.ended) {
      requestAnimationFrame(detectLoop);
      return;
    }

    detectFace(video).then(detection => {
      setIsFaceDetected(!!detection);
    });

    requestAnimationFrame(detectLoop);
  }, []);

  useEffect(() => {
    if (!loadingModels) {
      detectLoop();
    }
  }, [loadingModels, detectLoop]);

  // Capture photo to base64
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
          display: 'inline-block'
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
        <button
          onClick={handleCapture}
          disabled={!isFaceDetected}
        >
          {isFaceDetected ? 'Capture' : 'Face Not Detected'}
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WebcamCapture;
