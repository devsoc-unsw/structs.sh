// SVG Attributes
import { NODE_DIAMETER, STROKE_WIDTH, ACTUAL_NODE_DIAMETER } from '../../common/constants';

export const pathLength = 50;
export const nodePathWidth = ACTUAL_NODE_DIAMETER + pathLength;
export const topOffset = 150;
export const insertedNodeTopOffset =
  topOffset + (ACTUAL_NODE_DIAMETER + pathLength) * Math.sin(Math.PI / 3);
export const CURRENT = '#current';
export const PREV = '#prev';
export const CANVAS = '#visualiser-canvas';
export const nodeAttributes = {
  class: 'node',
  stroke: 'black',
  opacity: 0,
};

export const shapeAttributes = {
  r: NODE_DIAMETER / 2,
  'stroke-width': STROKE_WIDTH,
  stroke: 'black',
  fill: '#EBE8F4',
  opacity: 0,
};

export const textAttributes = {
  x: ACTUAL_NODE_DIAMETER / 2,
  y: topOffset,
  'dominant-baseline': 'middle',
  'text-anchor': 'middle',
  'stroke-width': 0,
  'font-family': 'CodeText',
  'font-size': '24',
  opacity: 0,
};

export const pathAttributes = {
  'stroke-width': STROKE_WIDTH,
  stroke: 'black',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  class: 'path',
  opacity: 0,
};
