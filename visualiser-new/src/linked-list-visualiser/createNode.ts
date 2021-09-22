import { Node } from './typedefs';
import { setAttributes, genId } from './utils';
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
    const canvas = document.querySelector("#canvas");
    const id = genId();

    // Create SVG node
    const newNode = document.createElementNS(SVG, "svg")
    // Box for node
    const nodeShape = document.createElementNS(SVG, 'rect')
    // Text inside node
    const nodeValue = document.createElementNS(SVG, 'text')
    // Pointer for node
    const newPath = document.createElementNS(SVG, 'path')

    setAttributes(newNode, nodeAttributes)
    setAttributes(nodeShape, shapeAttributes);
    setAttributes(nodeValue, textAttributes)
    nodeValue.innerHTML = input.toString(); 
    setAttributes(newPath, pathAttributes)

    // Attach all the elements together
    newNode.appendChild(nodeShape);
    newNode.appendChild(nodeValue);
    newNode.appendChild(newPath)
    canvas.appendChild(newNode);

    return {
        nodeTarget: newNode,
        pathTarget: newPath 
    }
}

export default createNode;
