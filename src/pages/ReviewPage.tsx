/**
 * ReviewPage.tsx
 * Displays all captured photos after completion.
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PhotoReview from '../components/PhotoReview';

const ReviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const photos = (location.state as { photos: string[] } | undefined)?.photos || [];

  if (photos.length !== 3) {
    // If no photos or incomplete, redirect back to main
    navigate('/');
    return null;
  }

  return (
    <div>
      <PhotoReview photos={photos} />
      <button onClick={() => navigate('/')}>Retake Photos</button>
    </div>
  );
};

export default ReviewPage;
