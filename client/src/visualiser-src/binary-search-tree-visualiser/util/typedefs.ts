import {
  Circle, Line, Text, Container,
} from '@svgdotjs/svg.js';

/**
 * Type definitions used by the visualiser
 */

export interface Node {
  // selector for the node svg element
  nodeTarget: Circle;

  // selector for the text svg element
  textTarget: Text;

  // selector for the line svg element
  lineTarget: Line;

  // reference to a left, right and parent node
  left: Node;
  right: Node;
  parent: Node;

  // the value of the node which is useful for when we do bst operations
  value: number;

  // the x and y coordinate of the node (just used for basic drawing of a bst for now)
  x: number;
  y: number;
}

export interface Animation {
  // by having a targets attribute we can animate multiple
  // svgs at the same time if needed
  targets: (Circle | Line | Text)[];

  // related to when an animation occurs in the timeline
  duration: number;
  delay: number;
  simultaneous: boolean;

  attrs: {
    // any other attributes that svg.js will use
    [key: string]: any;
  }
}
