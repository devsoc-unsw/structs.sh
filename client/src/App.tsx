import { Theme, ThemeProvider, Box } from '@mui/material';
import TopNavbar from 'components/Navbars/TopNavbar';
import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { structsTheme } from 'structsThemes';
import Feedback from 'pages/Feedback';
import HomePage from 'pages/HomePage';
import Page404 from 'pages/Page404';
import VisualiserPage from 'pages/VisualiserPage';
import './App.scss';

const App = () => (
  <Box color={structsTheme.palette.text.primary}>
    <AnimatePresence>
      <ThemeProvider theme={structsTheme}>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<HomePage />} />
          {/* Visualiser routes */}
          <Route path="/visualiser/:topic" element={<VisualiserPage />} />

          {/* Feedback and feature request page */}
          <Route path="/feedback" element={<Feedback />} />

          {/* 404 page */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </ThemeProvider>
    </AnimatePresence>
  </Box>
);

export default App;
