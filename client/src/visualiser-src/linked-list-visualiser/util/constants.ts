// SVG Attributes
const svgHeight = 120;
const strokeWidth = 3;
const nodeWidth = 47;
const nodeHeight = 47;
const pathLength = 50;
const diagonalPathLength = 40;
const diagonalPathAngle = 70 * (Math.PI / 180);
export const actualNodeWidth = nodeWidth + strokeWidth;
export const actualNodeHeight = nodeHeight + strokeWidth;
export const nodePathWidth = actualNodeWidth + pathLength;
export const topOffset = (svgHeight + strokeWidth + nodeHeight) / 2;
export const insertedNodeTopOffset = nodeHeight + diagonalPathLength * Math.sin(diagonalPathAngle);
export const RIGHT_ARROW_PATH = 'M52 59.9399C74.54 59.9398 75.92 59.9398 98 59.9398M98 59.9398L93 54M98 59.9398L93 66';
export const UP_ARROW_PATH = 'M24.4349 33C24.4348 17.81 24.4348 16.88 24.4348 2M24.4348 2L18 5.36957M24.4348 2L31 5.36957';
export const DOWN_RIGHT_ARROW_PATH = 'M45.9319 84.1162C51.9652 100.692 52.3346 101.707 58.2447 117.945M58.2447 117.945L62.7205 112.152M58.2447 117.945L50.9744 116.427';
export const UP_RIGHT_ARROW_PATH = 'M45.8142 35.9452C51.8474 19.369 52.2168 18.3541 58.1269 2.11623M58.1269 2.11623L50.9744 3.67711M58.1269 2.11623L62.7205 7.95236';
export const BENT_ARROW_PATH = 'M47 38.4949C93.5 0.619413 150 -1.90563 198 37.485M198 37.485L197.5 28.8998M198 37.485L189 39';
export const CURRENT = '#current';
export const PREV = '#prev';
export const CANVAS = '#canvas';
export const nodeAttributes = {
  class: 'node',
  stroke: 'black',
  opacity: 0,
};

export const shapeAttributes = {
  x: strokeWidth / 2,
  y: svgHeight / 2 - nodeWidth / 2 - strokeWidth / 2,
  width: nodeWidth,
  height: nodeHeight,
  rx: nodeHeight / 4,
  'stroke-width': strokeWidth,
  fill: 'white',
};

export const textAttributes = {
  'font-size': '25',
  'font-family': 'Courier',
  'font-weight': 'bold',
  x: nodeWidth / 2 + strokeWidth / 2,
  y: svgHeight / 2,
  'dominant-baseline': 'middle',
  'text-anchor': 'middle',
  'stroke-width': 0,
};

export const pathAttributes = {
  'stroke-width': strokeWidth,
  stroke: 'black',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  class: 'path',
  opacity: 0,
};
