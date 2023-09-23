import React, { useEffect, useRef, useState } from 'react';
import { VisualizerComponent } from './visualizer';
import SVG from 'svg.js';
import { BackendState, BackendVariableBaseInt } from '../types/backendType';
const ArrayVisualizer: VisualizerComponent = ({
  graphState,
  settings,
  setSettings,
  dimensions,
  backendState,
}) => {
  const svgRef = useRef(null);
  const [firstRender, setFirstRender] = useState(true);
  const [elements, setElements] = useState([]);
  useEffect(() => {
    console.log('Backend State', backendState);
    let arrays = [];
    const processArraysFromState = (location: 'heap' | 'stack') => {
      for (const [k, v] of Object.entries(backendState[location])) {
        if ((v as { type: string })['type'] === 'array') {
          arrays.push(v);
        }
      }
    };
    processArraysFromState('heap');
    processArraysFromState('stack');
    const svg = SVG(svgRef.current);
    let array = arrays[0];
    if (firstRender) {
      setFirstRender(false);
      let rectWidth = 50; // Width of each smaller rectangle
      let rectHeight = 50; // Height of each smaller rectangle
      let spacing = 0; // Spacing between rectangles
      let x = 10; // Initial x-coordinate
      for (let i = 0; i < array.size; i++) {
        console.log(i);
        let rect = svg.rect(rectWidth, rectHeight).move(x, 0);
        // rectangles.push(rect);
        rect.attr({ fill: 'white', stroke: 'black', 'stroke-width': 3 });
        let text = svg.text(i < array.data.length ? String(array.data[i].data) : '?');

        const textWidth = text.bbox().width;
        const textHeight = text.bbox().height;
        text.x(10 + rectWidth * i + rectWidth / 2 + textWidth / -2);
        text.y(-4 + rectHeight / 2 + textHeight / -2);
        text.attr({
          'font-size': 20,
          // 'text-anchor': 'middle',
          // 'dominant-baseline': 'middle',
        });
        setElements((prevElements) => [...prevElements, { rectangle: rect, text: text }]);
        x += rectWidth + spacing;
      }
    } else {
      for (let i = 0; i < array.size; i++) {
        elements[i].text.text(i < array.data.length ? String(array.data[i].data) : '?');
      }
    }
  }, [backendState]);
  return (
    <div className="array-visualizer">
      <h2>Array Visualizer</h2>
      <div ref={svgRef}></div>
    </div>
  );
};
export default ArrayVisualizer;
