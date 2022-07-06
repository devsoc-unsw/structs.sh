import React from 'react';
import { Box } from '@mui/material';

/* -------------------------------------------------------------------------- */
/*                        Visualiser-Specific Canvases                        */
/* -------------------------------------------------------------------------- */

/**
 * The React component that renders the DOM elements that the visualiser
 * attaches itself to.
 */
const VisualiserCanvas: React.FC = () => (
  // 64px is reserved for the top navbar, 48+ is reserved for the controller
  <Box id="visualiser-container" height="calc(100vh - 64px)" bgcolor="#EBE8F4">
    <svg id="visualiser-canvas" />
  </Box>
);

export default VisualiserCanvas;
