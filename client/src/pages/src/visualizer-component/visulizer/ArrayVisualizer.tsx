import React, { useEffect, useRef } from 'react';
import { VisualizerComponent } from './visualizer';
import SVG from 'svg.js';

const ArrayVisualizer: VisualizerComponent = ({
  graphState,
  settings,
  setSettings,
  dimensions,
  backendState,
}) => {
  const svgRef = useRef(null);
  const rectRef = useRef(null); // Reference to the rectangle

  useEffect(() => {
    console.log('Backend State', backendState);

    const svg = SVG(svgRef.current);

    // Remove the previous rectangle if it exists
    if (rectRef.current) {
      rectRef.current.remove();
    }

    const rect = svg.rect(100, 50).fill('blue').stroke('black');
    rect.animate().move(100, 100);

    // Update the reference to the new rectangle
    rectRef.current = rect;

    return () => {
      // Cleanup code if needed
    };
  }, []);

  return (
    <div className="array-visualizer">
      <h2>Array Visualizer</h2>
      <div ref={svgRef}></div>
    </div>
  );
};

export default ArrayVisualizer;
