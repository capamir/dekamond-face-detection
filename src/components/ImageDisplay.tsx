import React from 'react';

interface ImageDisplayProps {
  images: {
    front: string;
    right: string;
    left: string;
  };
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Captured Images</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <p>Front</p>
          <img src={images.front} alt="Front view" width={200} />
        </div>
        <div>
          <p>Right</p>
          <img src={images.right} alt="Right view" width={200} />
        </div>
        <div>
          <p>Left</p>
          <img src={images.left} alt="Left view" width={200} />
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;
