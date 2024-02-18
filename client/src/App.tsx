import { ThemeProvider, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import Feedback from 'visual-debugger/Feedback';
import HomePage from 'visual-debugger/HomePage';
import Page404 from 'visual-debugger/Page404';
import VisualiserPage from 'visual-debugger/VisualiserPage';
import { structsTheme } from 'structsThemes';
import './App.scss';
import DevelopmentMode from 'visual-debugger/DevelopmentMode';

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
