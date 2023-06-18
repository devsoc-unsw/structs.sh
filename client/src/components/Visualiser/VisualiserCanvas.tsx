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
  const ZOOM_SPEED = 0.05;
  const onScroll = (e: React.WheelEvent) => {
    e.deltaY < 0
      ? setScale(Math.min(scale + ZOOM_SPEED, 2))
      : setScale(Math.max(scale - ZOOM_SPEED, 0.5));
  };

  return (
    <Box
      onWheel={onScroll}
      id="visualiser-container"
      margin="auto"
      height="100vh"
      width={window.screen.width}
    >
      <svg
        style={{ transition: 'transform 0.2s linear' }}
        transform={`scale(${scale})`}
        transform-origin="center"
        onWheel={onScroll}
        id="visualiser-canvas"
        width="100%"
      />
    </Box>
  );
};

export default VisualiserCanvas;
