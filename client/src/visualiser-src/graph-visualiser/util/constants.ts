// SVG Attributes

// * these are imported from the LLV constants
// todo: should I put those constants into the common directory?
import {
  shapeAttributes,
  textAttributes,
  pathAttributes,
} from '@/visualiser-src/linked-list-visualiser/util/constants';
import { actualNodeDiameter } from '../../common/constants';

export const CENTRE_X = 400;
export const CENTRE_Y = 300;
export const NODE_GAP = 50;
export const MIN_NODE_SPACING = actualNodeDiameter + NODE_GAP;

// todo: maybe move these into the common later
export const NODE_FILL = '#EBE8F4';
export const EDGE_STROKE = 'black';
export const INSERT_COLOUR = '#39AF8E';
export const DELETE_COLOUR = '#F84F79';

export { shapeAttributes, textAttributes, pathAttributes };
