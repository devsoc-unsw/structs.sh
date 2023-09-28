import React, { useEffect, useRef, useState } from 'react';
import { VisualizerComponent } from './visualizer';
import SVG from 'svg.js';
import { BackendState, BackendVariableBaseInt } from '../types/backendType';
import { group } from 'console';
const ArrayVisualizer: VisualizerComponent = ({
  graphState,
  settings,
  setSettings,
  dimensions,
  backendState,
}) => {
  let rectWidth = 50; // Width of each smaller rectangle
  let rectHeight = 50; // Height of each smaller rectangle
  let spacing = 0; // Spacing between rectangles
  let x = 10; // Initial x-coordinate

  const svgRef = useRef(null);
  const [firstRender, setFirstRender] = useState(true);
  const [arrayElementSVGs, setArrayElementSVGs] = useState([]);
  const [pointerSVGs, setPointerSVGs] = useState({});
  const [previousPointers, setPreviousPointers] = useState([]);
  useEffect(() => {
    console.log('Backend State', JSON.stringify(backendState.stack));
    let arrays = [];
    let pointers = [];
    // map of pointer name to triangle
    const processArraysFromState = (location: 'heap' | 'stack') => {
      for (const [k, v] of Object.entries(backendState[location])) {
        if ((v as { type: string })['type'] === 'array') {
          arrays.push(v);
        } else if ((v as { type: string })['type'] === 'pointer') {
          pointers.push({
            ...v,
            prevValue: previousPointers.some((pointer) => pointer.name === (v as any).name)
              ? previousPointers.find((pointer) => pointer.name === (v as any).name).value
              : null,
          });
        }
      }
    };
    processArraysFromState('heap');
    processArraysFromState('stack');
    console.log('pointers', JSON.stringify(pointers));
    console.log('prevPointers', JSON.stringify(previousPointers));
    // console.log('prevPointers', previousPointers, 'pointers', pointers);
    const svg = SVG(svgRef.current);
    let array = arrays[0];
    if (firstRender) {
      setFirstRender(false);
      for (let i = 0; i < array.size; i++) {
        // console.log(i);
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
        setArrayElementSVGs((prevElements) => [...prevElements, { rectangle: rect, text: text }]);
        x += rectWidth + spacing;
      }
      for (const pointer of pointers) {
        const arrowhead = svg.polygon('0,0 15,-20 30,0').fill('black');
        arrowhead.center(10 + (0.5 + pointer.value) * rectWidth, rectHeight + 10);
        const text = svg
          .text(pointer.name)
          .move(10 + (0.5 + pointer.value) * rectWidth, rectHeight + 20)
          .attr({ 'text-anchor': 'middle' });
        let pointerGroup = svg.group();
        pointerGroup.add(arrowhead);
        pointerGroup.add(text);
        setPointerSVGs((prevElements) => ({ ...prevElements, [pointer.name]: pointerGroup }));
      }
    } else {
      for (let i = 0; i < array.size; i++) {
        console.log(arrayElementSVGs[i].text.text());
        const currText = arrayElementSVGs[i].text.text();
        const newText = i < array.data.length ? String(array.data[i].data) : '?';
        if (currText !== newText) {
          // Trying to fade out old text and fade in new text but broken rn
          // const textX = arrayElementSVGs[i].text.attr('x');
          // const textY = arrayElementSVGs[i].text.attr('y');
          // const newTextSVG = svg.text(newText).attr({ x: textX, y: textY });
          // arrayElementSVGs[i].text = newTextSVG;

          // Temporary - change text instantly w/o animation
          arrayElementSVGs[i].text.text(i < array.data.length ? String(array.data[i].data) : '?');
        }
      }
      for (const pointer of pointers) {
        if (pointer.name in pointerSVGs) {
          const pointerSVG = pointerSVGs[pointer.name];
          console.log(`pointer value is ${pointer.value} and prev value is ${pointer.prevValue}`);
          pointerSVG.animate(100).x(pointer.value * rectWidth);
        }
      }
    }
    setPreviousPointers(pointers);
  }, [backendState]);
  return (
    <div className="array-visualizer">
      <h2>Array Visualizer</h2>
      <div ref={svgRef}></div>
    </div>
  );
};
export default ArrayVisualizer;
