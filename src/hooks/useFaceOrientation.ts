import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

/**
 * The possible orientations of the user's face.
 */
export type Orientation = 'straight' | 'left' | 'right' | 'unknown';

function estimateOrientation(landmarks: faceapi.FaceLandmarks68): Orientation {
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const nose = landmarks.getNose();

  const leftEyeX = leftEye[0].x;
  const rightEyeX = rightEye[3].x;
  const noseX = nose[3].x;

  const eyeCenterX = (leftEyeX + rightEyeX) / 2;
  const offset = noseX - eyeCenterX;

  // These thresholds might need tweaking for different cameras or lighting.
  if (Math.abs(offset) < 10) {
    return 'straight';
  }
  if (offset > 15) {
    return 'left'; // User's head is turned to their left (appears on the right side of the screen)
  }
  if (offset < -15) {
    return 'right'; // User's head is turned to their right (appears on the left side of the screen)
  }

  return 'unknown';
}

/**
 * A custom hook to detect the orientation of a face from a video feed.
 * @param video - A React ref to the HTMLVideoElement.
 * @param enabled - A boolean to enable or disable the detection loop.
 * @returns An object containing the current `orientation` and an `isDetecting` flag.
 */
export function useFaceOrientation(
  video: HTMLVideoElement | null,
  enabled: boolean
) {
  const [orientation, setOrientation] = useState<Orientation>('unknown');
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (!video || !enabled) {
      setIsDetecting(false);
      return;
    }

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