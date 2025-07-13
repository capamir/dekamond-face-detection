import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Instructions from '../components/Instructions';
import WebcamCapture from '../components/WebcamCapture';

const MainPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleCapture = (imageDataUrl: string) => {
    const updatedImages = [...capturedImages, imageDataUrl];
    setCapturedImages(updatedImages);

    if (step < 2) {
      setStep(step + 1); // move to next instruction
    } else {
      // All 3 images captured → go to results
      navigate('/results', {
        state: {
          front: updatedImages[0],
          right: updatedImages[1],
          left: imageDataUrl // the final capture
        }
      });
    }
  };

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h1>Face Capture</h1>
      <Instructions currentStep={step} />
      <WebcamCapture onCapture={handleCapture} />
    </div>
  );
};

export default MainPage;
