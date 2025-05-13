import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import EditorLayout from './components/EditorLayout';
import { ThemeProvider } from './context/ThemeContext';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EditorLayout />} />
      <Route path="/doc/:id" element={<EditorLayout />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;