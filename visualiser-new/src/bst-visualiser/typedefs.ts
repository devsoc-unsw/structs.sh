import { G, Line, SVG, Text } from '@svgdotjs/svg.js'

/**
 * Type definitions used by the visualiser
 */

export interface Node {
    // CSS selector for the node DOM element
    nodeTarget: G;

    // CSS selector for the arrow DOM element
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
