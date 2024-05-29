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
import { WebSocket } from 'ws';

// For stompJs
Object.assign(global, { WebSocket });

const client = new Client({
  brokerURL: 'ws://localhost:15674/ws',
  onConnect: () => {
    client.subscribe('/topic/test01', (message) => console.log(`Received: ${message.body}`));
    client.publish({ destination: '/topic/test01', body: 'First Message' });
  },
});
client.activate();

const App = () => (
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
      </ThemeProvider>
    </AnimatePresence>
  </Box>
);

export default App;
