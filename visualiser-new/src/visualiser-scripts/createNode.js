import { v4 as getUuid } from 'uuid';

// Given an input value, returns a node structure and places a 
// HTML node element into the DOM
const SVG = "http://www.w3.org/2000/svg"

const PATH = "M53 74.6504C75.05 74.6504 76.4 74.6504 98 74.6504M98 74.6504L87.5 64M98 74.6504L87.5 87"

function genid() {
    return getUuid();
}

/**
 * Helper function which sets multiple attributes at once
 */
function setAttributes(elements, attributes) {
    for (const key in attributes) {
        elements.setAttribute(key, attributes[key])
    }
}

/**
 * Spawns a new node with the given value onto the visualiser canvas.
 * Returns an object containing the ID for the node, as well as the CSS
 * selectors for quickly fetching a DOM reference to the node and arrow.
 * TODO: each step of node creation could be taken out into a separate helper function
 */
function createNode(input) {
    const canvas = document.querySelector("#canvas")
    const id = genid();

    // Create SVG node
    const newNode = document.createElementNS(SVG, "svg")
    const nodeTarget = `node-${id}`
    const nodeAttributes = {
        "width": "200",
        "height": "100",
        "viewBox": "0 0 200 100",
        "id": nodeTarget,
        "class": "node"
    }
    setAttributes(newNode, nodeAttributes)

    // Drawing the node SVG
    const nodeShape = document.createElementNS(SVG, 'rect')
    const shapeAttributes = {
        "x": "1.5",
        "y": "51.5",
        "width": "47",
        "height": "47",
        "rx": "13.5",
        "stroke": "black",
        "stroke-width": "3",
        "fill": "white"
    }
    setAttributes(nodeShape, shapeAttributes)

    // Attached the text svg element to the drawn node
    const nodeValue = document.createElementNS(SVG, 'text')
    // TODO: Some issues relating to centering the text in the nodes, should find a better...
    const textAttributes = {
        "font-size": "16",
        "x": "25",
        "y": "75",
        "dominant-baseline": "middle",
        "text-anchor": "middle"
    }
    setAttributes(nodeValue, textAttributes)
    nodeValue.innerHTML = input

    // Create Arrow Path that will go into SVG
    const newPath = document.createElementNS(SVG, 'path')
    const pathTarget = `path-${id}`
    const pathAttributes = {
        "d": PATH,
        "id": pathTarget,
        "stroke-width": "3",
        "stroke": "black",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "class": "path"
    }
    setAttributes(newPath, pathAttributes)

    // Attach all the elements together
    newNode.appendChild(nodeShape);
    newNode.appendChild(nodeValue);
    newNode.appendChild(newPath)
    canvas.appendChild(newNode);

    return {
        id,
        nodeTarget: "#" + nodeTarget,
        pathTarget: "#" + pathTarget
    }
}

export default createNode;