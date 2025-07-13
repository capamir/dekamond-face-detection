import * as faceapi from 'face-api.js';

// Track whether models have been loaded
let modelsLoaded = false;

/**
 * Load face-api.js models from the public/models directory.
 */
export async function loadModels(): Promise<void> {
  if (modelsLoaded) return;

  const MODEL_URL = '/models';

  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
  ]);

  modelsLoaded = true;
}

/**
 * Detect a single face in the given video element using SSD MobileNet.
 * @param video - HTML video element from webcam
 * @returns The detection result with landmarks or null if no face is found
 */
export async function detectFace(
  video: HTMLVideoElement
): Promise<faceapi.WithFaceLandmarks<
  { detection: faceapi.FaceDetection },
  faceapi.FaceLandmarks68
> | null> {
  if (!modelsLoaded) {
    throw new Error('FaceAPI models not loaded. Call loadModels() first.');
  }

  const detection = await faceapi
    .detectSingleFace(video, new faceapi.SsdMobilenetv1Options())
    .withFaceLandmarks();

  return detection || null;
}

/**
 * Draws a detection box on a canvas overlay.
 * @param canvas - Canvas element used for drawing
 * @param video - The video element used for face detection (to get dimensions)
 * @param result - Face detection result with landmarks
 */
export function drawBox(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  result: faceapi.WithFaceLandmarks<
    { detection: faceapi.FaceDetection },
    faceapi.FaceLandmarks68
  >
): void {
  const dims = faceapi.matchDimensions(canvas, {
    width: video.videoWidth,
    height: video.videoHeight
  });

  const resizedResult = faceapi.resizeResults(result, dims);

  // Draw detection bounding box
  faceapi.draw.drawDetections(canvas, resizedResult);
}
