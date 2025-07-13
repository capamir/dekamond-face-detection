// src/pages/ResultsPage.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const captures: string[] = location.state?.captures || [];

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Captured Images</h2>

      {captures.length !== 3 ? (
        <div>
          <p style={{ color: 'red' }}>Missing image(s). Please try again.</p>
          <button onClick={() => navigate('/')}>Restart</button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          {captures.map((img, idx) => (
            <div key={idx}>
              <img
                src={img}
                alt={`Face ${idx + 1}`}
                style={{ width: 200, borderRadius: 8, border: '2px solid #ccc' }}
              />
              <p>
                {['Front', 'Left', 'Right'][idx]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
