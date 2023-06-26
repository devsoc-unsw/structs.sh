import React, { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ZoomableSvg = styled('svg')(({ scale }) => ({
  transition: 'transform 0.2s linear',
  transformOrigin: 'center',
  transform: `scale(${scale})`,
  width: '100%',
}));

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
  const MAX_SCALE = 2;
  const MIN_SCALE = 0.5;
  const onScroll = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setScale(Math.min(scale + ZOOM_SPEED, MAX_SCALE));
    } else {
      setScale(Math.max(scale - ZOOM_SPEED, MIN_SCALE));
    }
  };

  return (
    <Box
      onWheel={onScroll}
      id="visualiser-container"
      margin="auto"
      height="100vh"
      width={window.screen.width}
    >
      <ZoomableSvg onWheel={onScroll} id="visualiser-canvas" scale={scale} />
    </Box>
  );
};

export default VisualiserCanvas;
