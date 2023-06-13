import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { Box } from '@mui/material';
import { setCanvas } from './canvasRecordIndex';

/* -------------------------------------------------------------------------- */
/*                        Visualiser-Specific Canvases                        */
/* -------------------------------------------------------------------------- */
export let canvasElement = null;
let svgElement = null;
let toggleGIF = false;

export const toggleCapture = (captureOn) => {
  toggleGIF = captureOn;
}

export const getCanvas = () => {
  return canvasElement.current;
}
// Draws the current state of the SVG to a canvas
export const drawOnCanvas = () => {
  let canvas = canvasElement.current;
  setCanvas(canvas);
  let svg = svgElement.current;

  if (!toggleGIF) return;
  if (svg !== null) {
    let canvasContext = canvas.getContext('2d');
    let img = new Image();

    img.onload = function() {
      console.log("drawing image onto canvas...");
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
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
    <canvas ref={canvasElement} id="canvas1" style={{'opacity': 1, 'position': 'absolute', 'zIndex': -1}} width={window.screen.width} height={window.screen.height}></canvas>
    <button style={{'position': 'relative', 'top': window.screen.height / 10, 'right': window.screen.height / 4}}>hello</button>
  </Box>);
};

export default VisualiserCanvas;
