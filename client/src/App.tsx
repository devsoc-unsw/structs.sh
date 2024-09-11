import { ThemeProvider, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import Feedback from 'Feedback';
import HomePage from 'HomePage';
import Page404 from 'Page404';
import VisualiserPage from 'VisualiserPage';
import { structsTheme } from 'structsThemes';
import './App.scss';
import DevelopmentMode from 'visualiser-debugger/DevelopmentMode';
import { useGlobalStore } from 'visualiser-debugger/Store/globalStateStore';
import { useEffect } from 'react';
import { useFrontendStateStore } from 'visualiser-debugger/Store/frontendStateStore';
import Toast from './visualiser-debugger/Component/Toast/Toast';

const App = () => {
  useEffect(() => {
    // @ts-ignore
    window.globalStore = useGlobalStore;
    // @ts-ignore
    window.frontendStore = useFrontendStateStore;
  }, [useGlobalStore]);

  return (
    <Box color={structsTheme.palette.text.primary}>
      <AnimatePresence>
        <ThemeProvider theme={structsTheme}>
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<HomePage />} />

            {/* Visualiser routes */}
            <Route path="/visualiser/:topic/:data?" element={<VisualiserPage />} />

            {/* Feedback and feature request page */}
            <Route path="/feedback" element={<Feedback />} />

            {/* Development mode */}
            <Route path="/dev" element={<DevelopmentMode />} />

            {/* 404 page */}
            <Route path="*" element={<Page404 />} />
          </Routes>
          {/** For Providing warning/info/context of the app at anytime */}
          <Toast />
        </ThemeProvider>
      </AnimatePresence>
    </Box>
  );
};

export default App;
