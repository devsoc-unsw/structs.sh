import { Theme, ThemeProvider } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { darkTheme } from 'structsThemes';
// import ContentManagementDashboard from 'views/ContentManagementDashboard';
import Feedback from 'views/Feedback';
import HomePage from 'views/HomePage';
import Page404 from 'views/Page404';
import VisualiserDashboard from 'views/VisualiserDashboard';
import './App.scss';

const App = () => {
  // removed light/dark mode hooks for now
  const [currTheme, setCurrTheme] = useState<Theme>(darkTheme);
  return (
    <AnimatePresence>
      <ThemeProvider theme={currTheme}>
        {/* <ThemeMutationContext.Provider value={themeMutationContextProviderValue}> */}
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<HomePage />} />
          {/* Visualiser routes */}
          <Route path="/visualiser/:topic" element={<VisualiserDashboard />} />

          {/* Feedback and feature request page */}
          <Route path="/feedback" element={<Feedback />} />

          {/* Content management dashboard */}
          {/* <Route path="/content" element={<ContentManagementDashboard />} /> */}
          {/* 404 page */}
          <Route path="*" element={<Page404 />} />
        </Routes>
        {/* </ThemeMutationContext.Provider> */}
      </ThemeProvider>
    </AnimatePresence>
  );
};

export default App;
