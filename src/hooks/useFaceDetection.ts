import { useEffect, useState, useCallback, type RefObject } from 'react';
import { detectFace } from '@/api/faceApi';

export function useFaceDetection(videoRef: RefObject<HTMLVideoElement | null>): boolean {
  const [isFaceDetected, setIsFaceDetected] = useState(false);

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
  }, [videoRef]);

  useEffect(() => {
    detectLoop();
  }, [detectLoop]);

  return isFaceDetected;
}