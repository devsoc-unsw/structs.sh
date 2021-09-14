/**
 * Type definitions used by the visualiser
 */

export interface Node {
    // The base ID used to form the nodeTarget and pathTarget
    id: Number;
    // The ID of the node DOM element
    nodeTarget: String;
    // The ID of the arrow element attached to this node
    pathTarget: String;
}
