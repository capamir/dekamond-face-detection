import React, { useState } from 'react';
import WebcamCapture from '../components/WebcamCapture';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  // 👇 Define required orientations for each step
  const steps: ('straight' | 'left' | 'right')[] = ['straight', 'left', 'right'];

  const [currentStep, setCurrentStep] = useState(0);
  const [captures, setCaptures] = useState<string[]>([]);

  const handleCapture = (imageDataUrl: string) => {
    const newCaptures = [...captures, imageDataUrl];
    setCaptures(newCaptures);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps complete, go to results page
      navigate('/results', { state: { captures: newCaptures } });
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Step {currentStep + 1} of {steps.length}</h2>
      <p>Please turn your face: <strong>{steps[currentStep]}</strong></p>

      <WebcamCapture
        onCapture={handleCapture}
        requiredOrientation={steps[currentStep]}
      />
    </div>
  );
};

export default MainPage;
