import * as faceapi from 'face-api.js';

const MODEL_URL = '/models'; // You need to host models in public/models

export async function loadModels() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);
}

/**
 * Detect faces in an HTMLImageElement or HTMLVideoElement.
 * @param input HTMLImageElement or HTMLVideoElement
 * @returns number of detected faces
 */
export async function detectFaces(input: HTMLImageElement | HTMLVideoElement): Promise<number> {
  const detections = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions());
  return detections.length;
}
