// we need a function to evenly space out the vertices

import { actualNodeDiameter } from '@/visualiser-src/common/constants';
import { CENTRE_X, CENTRE_Y, MIN_NODE_SPACING } from './constants';

/**
 * An interface to represent the x and y coords of a graph node
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Evenly spaces vertices on a circle
 * @param indices
 * @returns a map containing indices
 */
export const circularPositions = (indices: number[]): Map<number, Point> => {
  // if there are no indices, return an empty map

  /** Map each index to its position */
  const map = new Map<number, Point>();

  if (!indices.length) {
    return map;
  }

  // if its length of 1, just return that thing.
  if (indices.length === 1) {
    const P: Point = {
      x: CENTRE_X,
      y: CENTRE_Y,
    };
    map.set(indices[0], P);
    return map;
  }

  /** Radius of a circle */
  const radius = MIN_NODE_SPACING / (2 * Math.sin(Math.PI / indices.length));

  for (let i = 0; i < indices.length; i++) {
    const angle = (2 * Math.PI * i) / indices.length - Math.PI / 2;

    const xCoord = CENTRE_X + radius * Math.cos(angle);
    const yCoord = CENTRE_Y + radius * Math.sin(angle);

    const P: Point = {
      x: xCoord,
      y: yCoord,
    };

    map.set(indices[i], P);
  }

  return map;
};

/** Returns the SVG path string to connect two nodes */
export const getEdgePath = (from: Point, to: Point) => {
  const radius = actualNodeDiameter / 2;

  // distance between from and to
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  /** The length of the line between from and to */
  const length = Math.hypot(dx, dy) || 1;

  // the vector or smth
  const ux = dx / length;
  const uy = dy / length;

  // The first edge's rim (i.e. on the circumference)
  const startX = from.x + ux * radius;
  const startY = from.y + uy * radius;

  // The same, but for the 2nd node
  const endX = to.x - ux * radius;
  const endY = to.y - uy * radius;

  return `M ${startX},${startY} L ${endX},${endY}`;
};
