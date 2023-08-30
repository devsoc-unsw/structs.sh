import React, { useState } from 'react';
import { FC } from 'react';
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
const VisualiserCanvas: FC = () => (
  <Box id="visualiser-container" margin="auto" width={window.screen.width}>
    <svg id="visualiser-canvas" />
  </Box>
);

export default VisualiserCanvas;
