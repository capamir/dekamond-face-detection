/**
 * App.tsx
 * Main app container with routing and Telegram SDK initialization.
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ReviewPage from './pages/ReviewPage';
import { useTelegram } from './hooks/useTelegram';

const App: React.FC = () => {
  const { tg } = useTelegram();

  React.useEffect(() => {
    tg?.ready();
  }, [tg]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
