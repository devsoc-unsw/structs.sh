// SVG Attributes
import { nodeDiameter, strokeWidth, actualNodeDiameter } from '../../common/constants';

/** The length of the arrow between 2 nodes */
export const pathLength = 50;

/** this constant is for calculating the offset of a new node's position */
export const nodePathWidth = actualNodeDiameter + pathLength;

/**
 * top offset from SVG canvas
 */
export const topOffset = 150;

/**
 * offset for like reshuggling nodes
 */
export const insertedNodeTopOffset =
  topOffset + (actualNodeDiameter + pathLength) * Math.sin(Math.PI / 3);


// HTML ids
export const CURRENT = '#current';
export const PREV = '#prev';
export const CANVAS = '#visualiser-canvas';

/**
 * todo: dead code remove?
 */
export const nodeAttributes = {
  class: 'node',
  stroke: 'black',
  opacity: 0,
};

/**
 * Bundle of SVG attributes into a node's circle the moment it's created
 */
export const shapeAttributes = {
  r: nodeDiameter / 2,
  'stroke-width': strokeWidth,
  stroke: 'black',
  fill: '#EBE8F4',
  opacity: 0,
};

/**
 * The text attribute of the node circle
 */
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

/**
 * SVG attributes of the arrow between 2 nodes.
 */
export const pathAttributes = {
  'stroke-width': strokeWidth,
  stroke: 'black',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  class: 'path',
  opacity: 0,
};
