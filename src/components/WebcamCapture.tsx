import React, { useRef } from 'react';
import { useWebcam } from '../hooks/useWebcam';
import { useFaceDetection } from '../hooks/useFaceDetection';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useWebcam(videoRef);
  const isFaceDetected = useFaceDetection(videoRef);

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
        <button onClick={handleCapture} disabled={!isFaceDetected}>
          {isFaceDetected ? 'Capture' : 'Face Not Detected'}
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WebcamCapture;
