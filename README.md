frontend/
├── src/
│   ├── assets/                  # Static assets (e.g., face-api.js model files)
│   │   ├── models/              # face-api.js model files (SSD MobileNet V1)
│   ├── components/              # Reusable React components
│   │   ├── WebcamCapture.tsx    # Handles webcam feed and photo capture
│   │   ├── Instructions.tsx     # Displays step-by-step instructions
│   │   ├── ImageDisplay.tsx     # Displays captured images on results page
│   ├── pages/                   # Page components
│   │   ├── MainPage.tsx         # Main page for photo capture
│   │   ├── ResultsPage.tsx      # Results page for displaying images
│   ├── hooks/                   # Custom hooks for logic
│   │   ├── useFaceDetection.ts  # Face detection logic with face-api.js
│   │   ├── useWebcam.ts         # Webcam handling logic
│   ├── services/                # Utility functions
│   │   ├── faceApi.ts           # Face-api.js model loading and detection
│   │   ├── storage.ts           # Optional localStorage helpers
│   ├── types/                   # TypeScript interfaces
│   │   ├── index.ts             # Types for images, face detection, etc.
│   ├── App.tsx                  # Main app component with routing
│   ├── index.tsx                # Entry point
│   ├── main.css                 # Minimal styling
├── public/                      # Public assets (e.g., index.html)
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── package.json