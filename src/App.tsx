import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';

const App: React.FC = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/review" element={<ReviewPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
