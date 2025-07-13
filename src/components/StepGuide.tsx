/**
 * StepGuide.tsx
 * Displays instructions for the current photo capture step.
 */

import React from 'react';

interface StepGuideProps {
  step: number;
}

const instructions = [
  'Please take a front-facing photo.',
  'Please take a photo looking to your right.',
  'Please take a photo looking to your left.',
];

const StepGuide: React.FC<StepGuideProps> = ({ step }) => {
  return <h2>{instructions[step]}</h2>;
};

export default StepGuide;
