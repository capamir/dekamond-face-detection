import styles from './styles.module.scss';
import React from 'react';

interface ImageDisplayProps {
  images: {
    front: string;
    right: string;
    left: string;
  };
}

const imageData = (images: ImageDisplayProps['images']) => [
  { src: images.front, label: 'Front' },
  { src: images.right, label: 'Right' },
  { src: images.left, label: 'Left' },
];

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images }) => {
  return (
    <div className={styles.Wrapper}>
      <h2>Captured Images</h2>
      <div className={styles.Grid}>
        {imageData(images).map((image, index) => (
          <div key={index}>
            <p>{image.label}</p>
            <img
              src={image.src}
              alt={`${image.label} view`}
              className={styles.Image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDisplay;