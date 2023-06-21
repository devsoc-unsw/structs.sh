import { useRef } from 'react';
import React from 'react';
import { Box } from '@mui/material';

/* -------------------------------------------------------------------------- */
/*                        Visualiser-Specific Canvases                        */
/* -------------------------------------------------------------------------- */
export let canvasElement = null;
let svgElement = null;
let toggleGIF = false;

export const toggleCapture = (captureOn) => {
  toggleGIF = captureOn;
}

export const stopCapture = () => { 
  
}

export const getCanvas = () => {
  return canvasElement.current.getContext('2d');
}
// Draws the current state of the SVG to a canvas
export const drawOnCanvas = () => {
  let canvas = canvasElement.current;
  let svg = svgElement.current;

  if (!toggleGIF) return;
  if (svg !== null) {
    let canvasContext = canvas.getContext('2d');
    let img = new Image();

    img.onload = function() {
      console.log("drawing image onto canvas...");
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.fillStyle = "#eae8f5";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      canvasContext.drawImage(img, 0, 0);
    }

    let svgXML = (new XMLSerializer).serializeToString(svg);
    img.src = "data:image/svg+xml;base64," + btoa(svgXML);
  }
}

/**
 * The React component that renders the DOM elements that the visualiser
 * attaches itself to.
 */
const VisualiserCanvas: React.FC = () => {
  canvasElement = useRef(null);
  svgElement = useRef(null);

  return (
  <Box id="visualiser-container" margin="auto" width={window.screen.width}>
    <svg ref={svgElement} id="visualiser-canvas" />
    <canvas ref={canvasElement} id="gifCanvas" width={window.screen.width} height={window.screen.height} style={{'opacity': 1, 'display': 'none', 'zIndex': -1, 'left': window.screen.width * 2}}></canvas>
  </Box>);
};

export default VisualiserCanvas;
