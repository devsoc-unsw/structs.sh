// SVG Attributes
import { nodeDiameter, strokeWidth, actualNodeDiameter } from '../../common/constants';

export const pathLength = 50;
export const nodePathWidth = actualNodeDiameter + pathLength;
export const topOffset = 150;
export const insertedNodeTopOffset =
  topOffset + (actualNodeDiameter + pathLength) * Math.sin(Math.PI / 3);
export const CURRENT = '#current';
export const PREV = '#prev';
export const CANVAS = '#visualiser-canvas';
export const nodeAttributes = {
  class: 'node',
  stroke: 'black',
  opacity: 0,
};

export const shapeAttributes = {
  r: nodeDiameter / 2,
  'stroke-width': strokeWidth,
  stroke: 'black',
  fill: '#EBE8F4',
  opacity: 0,
};

export const textAttributes = {
  x: actualNodeDiameter / 2,
  y: topOffset,
  'dominant-baseline': 'middle',
  'text-anchor': 'middle',
  'stroke-width': 0,
  'font-family': 'CodeText',
  'font-size': '24',
  opacity: 0,
};

export const pathAttributes = {
  'stroke-width': strokeWidth,
  stroke: 'black',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  class: 'path',
  opacity: 0,
};
