import { ThemeProvider, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import Feedback from 'visualiser-debugger/Feedback';
import HomePage from 'visualiser-debugger/HomePage';
import Page404 from 'visualiser-debugger/Page404';
import VisualiserPage from 'visualiser-debugger/VisualiserPage';
import { structsTheme } from 'structsThemes';
import './App.scss';
import DevelopmentMode from 'visualiser-debugger/DevelopmentMode';

const App = () => (
  <Box color={structsTheme.palette.text.primary}>
    <AnimatePresence>
      <ThemeProvider theme={structsTheme}>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<DevelopmentMode />} />

          {/* Visualiser routes */}
          <Route path="/visualiser/:topic/:data?" element={<VisualiserPage />} />

          {/* Feedback and feature request page */}
          <Route path="/feedback" element={<Feedback />} />

          {/* Development mode */}
          <Route path="/dev" element={<DevelopmentMode />} />

          {/* 404 page */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </ThemeProvider>
    </AnimatePresence>
  </Box>
);

export default App;
