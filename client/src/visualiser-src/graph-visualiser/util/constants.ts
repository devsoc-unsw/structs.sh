// SVG Attributes

// * these are imported from the LLV constants
// todo: should I put those constants into the common directory?
import {
  shapeAttributes,
  textAttributes,
  pathAttributes,
} from '@/visualiser-src/linked-list-visualiser/util/constants';
import { actualNodeDiameter } from '../../common/constants';

// constants for our imaginary circle, nodes will "land" on the circumference of the circle.
/** Height of the navbar, which covers the top of the canvas. */
const NAVBAR_HEIGHT = 64;

/** Height of the play controls, which cover the bottom of the window. */
const CONTROL_BAR_HEIGHT = 51;

/**
 * Centre of the circle. The canvas is as big as the window,
 * so this is the middle of what the navbar and controls leave free.
 * Read once on load, so resize the window and refresh to re-centre.
 */
export const CENTRE_X = window.innerWidth / 2;
export const CENTRE_Y = (window.innerHeight - NAVBAR_HEIGHT - CONTROL_BAR_HEIGHT) / 2;
export const NODE_GAP = 50;
export const MIN_NODE_SPACING = actualNodeDiameter + NODE_GAP;

// todo: maybe move these into the common later
export const NODE_FILL = '#EBE8F4';
// hex on purpose: svg.js can't animate a named colour like 'black', the edge goes invisible
export const EDGE_STROKE = '#000000';
export const INSERT_COLOUR = '#39AF8E';
export const DELETE_COLOUR = '#F84F79';

export { shapeAttributes, textAttributes, pathAttributes };
