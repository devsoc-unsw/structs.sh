// we need a function to evenly space out the vertices

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
