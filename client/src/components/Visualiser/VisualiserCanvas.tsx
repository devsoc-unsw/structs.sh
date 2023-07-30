import { useRef } from 'react';
import { stopRecording } from './VisualiserRecorder/canvasRecordIndex';
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
export let canvasElement = null;
let svgElement = null;
let toggleGIF = false;

export const toggleCapture = () => {
  toggleGIF = !toggleGIF;
  if (!toggleGIF) stopRecording();
}

export const getCanvas = () => {
  return canvasElement.current.getContext('2d');
}

export const clearCanvas = () => {
  let canvas = canvasElement.current;
  let canvasContext = canvas.getContext('2d');
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = "#eae8f5";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

// Draws the current state of the SVG to a canvas
export const drawOnCanvas = () => {
  let canvas = canvasElement.current;
  let svg = svgElement.current;

  if (svg !== null) {
    let canvasContext = canvas.getContext('2d');
    let img = new Image();
    let svgXML = (new XMLSerializer).serializeToString(svg);
    img.src = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgXML);

    img.onload = function() {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.fillStyle = "#eae8f5";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      canvasContext.drawImage(img, 0, 0);
    }
  }
}

/**
 * The React component that renders the DOM elements that the visualiser
 * attaches itself to.
 */
const VisualiserCanvas: React.FC = () => {
  canvasElement = useRef(null);
  svgElement = useRef(null);

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
      <ZoomableSvg onWheel={onScroll} id="visualiser-canvas" ref={svgElement} scale={scale} />
      <canvas ref={canvasElement} id="gifCanvas" width={window.screen.width} height={window.screen.height} style={{'display': 'none'}}></canvas>
    </Box>
  );
};

export default VisualiserCanvas;
