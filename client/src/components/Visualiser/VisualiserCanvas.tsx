import React from 'react';
import { Box } from '@mui/material';

/**
 * The React component that renders the DOM elements that the visualiser
 * attaches itself to.
 */
const VisualiserCanvas: React.FC = () => (
  // 64px is reserved for the top navbar, 48+ is reserved for the controller
  <Box
    id="visualiser-container"
    style={{
      backgroundColor: '#EBE8F4',
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
    }}
  >
    <svg id="visualiser-canvas" />
  </Box>
);

export default VisualiserCanvas;
