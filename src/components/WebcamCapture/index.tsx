import styles from './styles.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { loadModels } from '@/api/faceApi';
import { useFaceOrientation, type Orientation } from '@/hooks/useFaceOrientation';

// --- Props Interfaces ---
interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  requiredOrientation: 'straight' | 'left' | 'right';
}

interface StatusDisplayProps {
  modelsLoaded: boolean;
  orientation: Orientation;
  requiredOrientation: 'straight' | 'left' | 'right';
  hasCaptured: boolean;
  streamError: string | null;
}

// --- Status Display Sub-Component ---
const StatusDisplay: React.FC<StatusDisplayProps> = ({
  modelsLoaded,
  orientation,
  requiredOrientation,
  hasCaptured,
  streamError,
}) => {
  if (streamError) {
    return <p className={styles.ErrorText}>Webcam error: {streamError}</p>;
  }
  if (!modelsLoaded) {
    return <p className={styles.StatusText}>🔄 Loading face detection models...</p>;
  }
  if (orientation === 'unknown') {
    return <p className={styles.StatusText}>🧠 Waiting for face...</p>;
  }
  return (
    <>
      <p>Detected: <strong>{orientation}</strong></p>
      <p>Required: <strong>{requiredOrientation}</strong></p>
      {hasCaptured && <p className={styles.SuccessText}>✅ Captured</p>}
      {!hasCaptured && orientation === requiredOrientation && (
        <p className={styles.WarningText}>⏳ Capturing in 2 seconds...</p>
      )}
    </>
  );
};

// --- Main Component ---
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
      const timeoutId = window.setTimeout(() => {
        handleCapture();
      }, 2000); // 2 second delay
      setPendingTimeout(timeoutId);
    } else {
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

  const isOrientedCorrectly = orientation === requiredOrientation;

  return (
    <div className={styles.Wrapper}>
      <div className={`${styles.VideoContainer} ${isOrientedCorrectly ? styles.BorderGreen : styles.BorderRed}`}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={styles.Video}
        />
      </div>

      <div className={styles.StatusContainer}>
        <StatusDisplay
          modelsLoaded={modelsLoaded}
          orientation={orientation}
          requiredOrientation={requiredOrientation}
          hasCaptured={hasCaptured}
          streamError={streamError}
        />
      </div>

      <canvas ref={canvasRef} className={styles.CanvasHidden} />
    </div>
  );
};

export default WebcamCapture;