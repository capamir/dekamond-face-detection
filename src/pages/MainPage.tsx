/**
 * MainPage.tsx
 * Guides the user through capturing three photos step-by-step.
 */

import React, { useEffect, useState } from 'react';
import CameraCapture from '../components/CameraCapture';
import StepGuide from '../components/StepGuide';
import { loadModels } from '../utils/faceApi';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadModels().then(() => setModelsLoaded(true));
  }, []);

  const handleCapture = (photo: string) => {
    setPhotos((prev) => [...prev, photo]);
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // All photos captured, navigate to review page
      navigate('/review', { state: { photos: [...photos, photo] } });
    }
  };

  if (!modelsLoaded) {
    return <p>Loading face detection models, please wait...</p>;
  }

  return (
    <div>
      <StepGuide step={currentStep} />
      <CameraCapture onCapture={handleCapture} instruction="Align your face as instructed and press Capture." />
    </div>
  );
};

export default MainPage;
