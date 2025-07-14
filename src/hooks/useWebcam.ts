import type { RefObject } from 'react';
import { useEffect } from 'react';

/**
 * A custom hook to manage the webcam stream. It handles starting the camera
 * and cleaning up the stream when the component unmounts.
 * @param videoRef - A React ref to the HTMLVideoElement that will display the stream.
 */
export function useWebcam(videoRef: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const startCamera = async () => {
      try {
        // Request access to the user's webcam.
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        // Log an error if the user denies access or if the webcam is unavailable.
        console.error('Error accessing webcam:', err);
      }
    };

    startCamera();

    // Cleanup function: This runs when the component using the hook unmounts.
    return () => {
      if (videoRef.current?.srcObject) {
        // Stop all tracks in the stream to turn off the webcam light.
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, [videoRef]);
}