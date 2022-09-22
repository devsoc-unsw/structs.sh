import { Theme, ThemeProvider, Box } from '@mui/material';
import TopNavbar from 'components/Navbars/TopNavbar';
import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { structsTheme } from 'structsThemes';
import Feedback from 'views/Feedback';
import HomePage from 'views/HomePage';
import Page404 from 'views/Page404';
import VisualiserDashboard from 'views/VisualiserDashboard';
import './App.scss';

const App = () => {
  // Storing the theme in a state in case we want more themes in future
  const [currTheme, setCurrTheme] = useState<Theme>(structsTheme);
  return (
    <Box color={structsTheme.palette.text.primary}>
      <AnimatePresence>
        <ThemeProvider theme={currTheme}>
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<HomePage />} />
            {/* Visualiser routes */}
            <Route path="/visualiser/:topic" element={<VisualiserDashboard />} />

            {/* Feedback and feature request page */}
            <Route path="/feedback" element={<Feedback />} />

            {/* 404 page */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </ThemeProvider>
      </AnimatePresence>
    </Box>
  );
};

export default App;
