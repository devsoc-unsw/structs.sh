import { Node } from './typedefs';
import { setAttributes } from './utils';
import { nodeAttributes, shapeAttributes, textAttributes, pathAttributes } from './svgAttributes';

// Given an input value, returns a node structure and places a
// HTML node element into the DOM
const SVG = 'http://www.w3.org/2000/svg';

/**
 * Spawns a new node with the given value onto the visualiser canvas.
 * Returns an object containing the ID for the node, as well as the CSS
 * selectors for quickly fetching a DOM reference to the node and arrow.
 * TODO: each step of node creation could be taken out into a separate helper function
 */
const createNode = (input: number): Node => {
    // Create SVG node
    const newNode = document.createElementNS(SVG, "svg")
    // Node Box + Value group
    const nodeBox = document.createElementNS(SVG, "g");
    // Box for node
    const nodeShape = document.createElementNS(SVG, 'rect')
    // Text inside node
    const nodeValue = document.createElementNS(SVG, 'text')
    // Pointer for node
    const newPointer = document.createElementNS(SVG, 'path')

    setAttributes(newNode, nodeAttributes)
    setAttributes(nodeShape, shapeAttributes);
    setAttributes(nodeValue, textAttributes);
    nodeValue.innerHTML = input.toString(); 
    setAttributes(newPointer, pathAttributes)

    // Attach all the elements together
    nodeBox.appendChild(nodeShape);
    nodeBox.appendChild(nodeValue);
    newNode.appendChild(nodeBox);
    newNode.appendChild(newPointer);

    return {
        value: input,
        nodeBoxTarget: nodeBox,
        nodeTarget: newNode,
        pointerTarget: newPointer 
    }
}

export default createNode;
