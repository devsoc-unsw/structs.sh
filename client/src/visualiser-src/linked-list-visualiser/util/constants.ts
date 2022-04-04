// SVG Attributes
import { nodeDiameter, strokeWidth, actualNodeDiameter } from '../../common/constants';

export const pathLength = 50;
export const nodePathWidth = actualNodeDiameter + pathLength;
export const topOffset = 60;
export const insertedNodeTopOffset =
  topOffset + (actualNodeDiameter + pathLength) * Math.sin(Math.PI / 3);
export const CURRENT = '#current';
export const PREV = '#prev';
export const CANVAS = '#canvas';
export const nodeAttributes = {
  class: 'node',
  stroke: 'black',
  opacity: 0,
};

export const shapeAttributes = {
  cx: actualNodeDiameter / 2,
  cy: topOffset,
  r: nodeDiameter / 2,
  'stroke-width': strokeWidth,
  fill: 'white',
};

export const textAttributes = {
  'font-size': 25,
  'font-family': 'Courier',
  'font-weight': 'bold',
  x: actualNodeDiameter / 2,
  y: topOffset,
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

// Animation attributes
export const defaultSpeed = 0.6;
