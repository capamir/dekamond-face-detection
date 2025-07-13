import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageDisplay from '../components/ImageDisplay';

interface LocationState {
  front: string;
  right: string;
  left: string;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;

  // Redirect if no images were passed
  useEffect(() => {
    if (!state || !state.front || !state.right || !state.left) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div style={{ padding: '1rem' }}>
      <ImageDisplay images={state} />
    </div>
  );
};

export default ResultsPage;
