import React, { useState } from 'react';
import { Box } from '@mui/material';

/* -------------------------------------------------------------------------- */
/*                        Visualiser-Specific Canvases                        */
/* -------------------------------------------------------------------------- */

/**
 * The React component that renders the DOM elements that the visualiser
 * attaches itself to.
 */
const VisualiserCanvas: React.FC = () => {
  const [scale, setScale] = useState(1);
  const ZOOM_SPEED = 0.1;
  const onScroll = (e: React.WheelEvent) => {
    console.log(`scale: ${scale}`);
    e.deltaY > 0 ? setScale(scale + ZOOM_SPEED) : setScale(scale - ZOOM_SPEED);
  };

  return (
    <Box id="visualiser-container" margin="auto" width={window.screen.width}>
      <svg transform={`scale(${scale})`} onWheel={onScroll} id="visualiser-canvas" />
    </Box>
  );
};

export default VisualiserCanvas;
