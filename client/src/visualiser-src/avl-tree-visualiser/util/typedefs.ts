import {
  Circle, Line, Marker, Text,
} from '@svgdotjs/svg.js';

/**
 * Type definitions used by the visualiser
 */

export interface Node {
  // selector for the node svg element
  nodeTarget: Circle;

  // selector for the text svg element
  textTarget: Text;

  // selector for the left line svg element
  leftLineTarget: Line;

  // selector for the right line svg element
  rightLineTarget: Line;

  // selector for the left arrow svg element
  leftArrowTarget: Marker;

  // selector for the right arrow svg element
  rightArrowTarget: Marker;

  // reference to a left, right and parent node
  left: Node;
  right: Node;

  // the value of the node which is useful for when we do bst operations
  value: number;

  // the x and y coordinate of the node (just used for basic drawing of a bst for now)
  x: number;
  y: number;
}