# Dekamond Face Capture Mini-App

This is a web application designed to run inside Telegram as a Mini App. It guides a user to capture three photos of their face—front, left, and right—using their device's webcam. The app uses `face-api.js` to detect the user's face and orientation in real-time to ensure the captures are correct before proceeding.

## Key Technologies

-   **Framework**: React
-   **Language**: TypeScript
-   **Bundler**: Vite
-   **Styling**: SCSS Modules
-   **Face Detection**: `face-api.js`
-   **Platform**: Telegram Mini App

## Project Structure

The project follows a clean, feature-oriented structure. All source code resides in the `src/` directory.
/
├── public/
│   └── models/              # Contains the pre-trained models for face-api.js
├── src/
│   ├── api/                 # Handles interactions with external services (like face-api)
│   │   └── faceApi.ts
│   ├── components/          # Reusable, self-contained React components
│   │   ├── ImageDisplay/
│   │   │   ├── index.tsx
│   │   │   └── styles.module.scss
│   │   ├── Instructions/
│   │   │   ├── index.tsx
│   │   │   └── styles.module.scss
│   │   └── WebcamCapture/
│   │       ├── index.tsx
│   │       └── styles.module.scss
│   ├── hooks/               # Custom React hooks for shared logic
│   │   ├── useFaceDetection.ts
│   │   ├── useFaceOrientation.ts
│   │   └── useWebcam.ts
│   ├── pages/               # Components that represent application pages or views
│   │   ├── main-page/
│   │   │   └── index.tsx
│   │   └── results-page/
│   │       └── index.tsx
│   ├── styles/              # Global styles
│   │   └── index.scss
│   ├── App.tsx              # Main application component with routing
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite TypeScript environment types
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository**

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

This will start the Vite development server, and you can access the application in your browser, typically at `http://localhost:5173`.