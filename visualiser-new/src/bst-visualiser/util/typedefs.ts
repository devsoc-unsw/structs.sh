import { Circle, Line, Text } from '@svgdotjs/svg.js'

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

    // reference to a left and right node
    left: Node;
    right: Node;
    parent: Node;

    // the value of the node which is useful for when we do bst operations
    value: number;

    // the x and y coordinate of the node (just used for basic drawing of a bst for now)
    x: number;
    y: number;
}
