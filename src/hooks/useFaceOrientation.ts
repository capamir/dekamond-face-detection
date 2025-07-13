import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

type Orientation = 'straight' | 'left' | 'right' | 'unknown';

/**
 * Estimate face orientation based on landmark positions.
 * @param landmarks FaceLandmarks68 from face-api.js
 */
function estimateOrientation(landmarks: faceapi.FaceLandmarks68): Orientation {
  const leftEye = landmarks.getLeftEye(); // points 36-41
  const rightEye = landmarks.getRightEye(); // points 42-47
  const nose = landmarks.getNose(); // points 27-35

  const leftEyeX = leftEye[0].x;
  const rightEyeX = rightEye[3].x;
  const noseX = nose[3].x;

  const eyeCenterX = (leftEyeX + rightEyeX) / 2;
  const offset = noseX - eyeCenterX;

  if (Math.abs(offset) < 10) return 'straight';
  if (offset > 15) return 'left';
  if (offset < -15) return 'right';

  return 'unknown';
}

export function useFaceOrientation(
  video: HTMLVideoElement | null,
  enabled: boolean
) {
  const [orientation, setOrientation] = useState<Orientation>('unknown');
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (!video || !enabled) return;

    let animationId: number;

    const detectLoop = async () => {
      if (!video || video.paused || video.ended) {
        animationId = requestAnimationFrame(detectLoop);
        return;
      }

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks();

      if (detection?.landmarks) {
        const dir = estimateOrientation(detection.landmarks);
        setOrientation(dir);
      } else {
        setOrientation('unknown');
      }

      animationId = requestAnimationFrame(detectLoop);
    };

    setIsDetecting(true);
    detectLoop();

    return () => {
      cancelAnimationFrame(animationId);
      setIsDetecting(false);
    };
  }, [video, enabled]);

  return { orientation, isDetecting };
}
