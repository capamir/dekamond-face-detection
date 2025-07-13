import React from 'react';

interface InstructionsProps {
  currentStep: number; // 0 = front, 1 = right, 2 = left
}

const stepMessages = [
  'Please look straight at the camera.',
  'Now, turn your head to the right.',
  'Finally, turn your head to the left.'
];

const Instructions: React.FC<InstructionsProps> = ({ currentStep }) => {
  const message = stepMessages[currentStep] || 'All steps completed.';

  return (
    <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
      <h2>Step {currentStep + 1} of 3</h2>
      <p>{message}</p>
    </div>
  );
};

export default Instructions;
