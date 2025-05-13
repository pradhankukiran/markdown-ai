import React, { useState, useEffect } from 'react';
import EditorLayout from './components/EditorLayout';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <EditorLayout />
      </div>
    </ThemeProvider>
  );
}

export default App;