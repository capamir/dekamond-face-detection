import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage, ResultsPage } from '@/pages';
import WebApp from '@twa-dev/sdk';

const App: React.FC = () => {
  useEffect(() => {
    WebApp.ready();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
