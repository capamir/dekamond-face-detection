/**
 * PhotoReview.tsx
 * Displays the three captured photos.
 */

import React from 'react';

interface PhotoReviewProps {
  photos: string[];
}

const PhotoReview: React.FC<PhotoReviewProps> = ({ photos }) => {
  return (
    <div>
      <h2>Captured Photos</h2>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {photos.map((photo, idx) => (
          <img key={idx} src={photo} alt={`Captured face ${idx + 1}`} style={{ maxWidth: 200 }} />
        ))}
      </div>
    </div>
  );
};

export default PhotoReview;
