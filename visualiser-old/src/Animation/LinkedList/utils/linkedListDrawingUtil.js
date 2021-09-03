// svg manipulation functions
// positions and appends a pointer to the visualiser
export function appendPointerSVG(list, visible) {
    const { nodes, pointers, pointersGroup } = list;
    const newPointer = createPointer(nodes);
    const { width, height } = getNodeDimensions(nodes);
    newPointer.setAttribute('transform', `translate(${5 / 6 * width + getOffsetDistance(nodes) * pointers.length}, ${height / 2 - 1 / 2 * getPointerTipBaseLength(nodes) + 1 / 2 * getStrokeWidth(nodes)})`)
    newPointer.setAttribute('opacity', visible ? 1 : 0);
    pointersGroup.appendChild(newPointer);
    pointers.push(1);
}

// positions and appends a node to the visualiser
export function appendNodeSVG(list, data, visible) {
    const { nodes, nodesGroup } = list;
    const newNode = createNode(data, nodes);
    newNode.setAttribute('transform', `translate(${getOffsetDistance(nodes) * nodes.length + getStrokeWidth(nodes) / 2}, ${getStrokeWidth(nodes) / 2})`);
    newNode.setAttribute('opacity', visible ? 1 : 0);
    nodesGroup.appendChild(newNode);
    nodes.push(data);
}

// creates an SVG node
//  ________________
// |          |     |
// |  <data>  |  .  |   
// |          |     |
//  ----------------
export function createNode(data, nodes) {
    // group for node
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    // outer rectangle
    const container = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    // separator for data and pointer
    const separator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    // data value
    const dataText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    // pointer representing null value 
    const pointer = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    // key attribute values
    const { height, width } = getNodeDimensions(nodes);
    const strokeWidth = getStrokeWidth(nodes);
    // style node components
    container.setAttribute('fill', 'transparent');
    container.setAttribute('width', width);
    container.setAttribute('height', height);
    container.setAttribute('stroke-width', strokeWidth);
    container.setAttribute('rx', strokeWidth / 2);
    dataText.setAttribute('x', width / 3);
    dataText.setAttribute('y', height / 2);
    dataText.setAttribute('dominant-baseline', 'middle');
    dataText.setAttribute('text-anchor', 'middle');
    dataText.setAttribute('font-family', 'Georgia');
    dataText.setAttribute('font-size', '1.5rem');
    dataText.textContent = data;
    separator.setAttribute('x1', height);
    separator.setAttribute('x2', height);
    separator.setAttribute('y1', 0);
    separator.setAttribute('y2', height);
    separator.setAttribute('stroke-width', strokeWidth / 2);
    pointer.setAttribute('r', strokeWidth / 2);
    pointer.setAttribute('cx', 5 / 6 * width);
    pointer.setAttribute('cy', height / 2);
    node.setAttribute('fill', 'black');
    node.setAttribute('stroke', 'black');
    // gather together node components
    node.appendChild(container);
    node.appendChild(dataText);
    node.appendChild(separator);
    node.appendChild(pointer);
    node.classList.add("node");
    return node;
}

// creates an SVG arrow that points to the left, representing a pointer
export function createPointer(nodes) {
    // container group 
    const pointer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    // each pointer will have a curved tail and a straight tail, with only one displayed
    // at any given time. the default is the straight tail
    const curvedTail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const straightTail = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    // pointer tip
    const tip = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    // key attribute values
    const strokeWidth = getStrokeWidth(nodes);
    const pointerLength = getShortPointerLength(nodes);
    const tipBaseLength = getPointerTipBaseLength(nodes);
    const tipHeight = pointerLength / 10;
    const lineLength = pointerLength - tipHeight;
    tip.setAttribute('points', `${lineLength}, 0 ${lineLength}, ${tipBaseLength} ${pointerLength}, ${tipBaseLength / 2}`);
    curvedTail.setAttribute('d', getArcD(nodes));
    curvedTail.setAttribute('fill', 'transparent');
    curvedTail.setAttribute('stroke-width', getStrokeWidth(nodes));
    curvedTail.setAttribute('opacity', 0);
    straightTail.setAttribute('x1', 0);
    straightTail.setAttribute('x2', lineLength);
    straightTail.setAttribute('y1', tipBaseLength / 2);
    straightTail.setAttribute('y2', tipBaseLength / 2);
    straightTail.setAttribute('fill', 'transparent');
    straightTail.setAttribute('stroke-width', strokeWidth);
    pointer.setAttribute('stroke', 'black');
    pointer.setAttribute('fill', 'black');
    pointer.appendChild(curvedTail);
    pointer.appendChild(straightTail);
    pointer.appendChild(tip);
    pointer.classList.add("pointer");
    return pointer;
}

// toggle pointer from straight to curved tail
export function convertToArc(pointer, nodes) {
    pointer.childNodes[0].setAttribute('opacity', '1');
    pointer.childNodes[0].setAttribute('d', getArcD(nodes));
    pointer.childNodes[1].setAttribute('opacity', '0');
    pointer.childNodes[2].setAttribute('transform', getArcTipTransform(nodes));
}

// toggle pointer from arc to long tail
export function convertToLongPointer(pointer, nodes) {
    pointer.childNodes[1].setAttribute('x2', getLongPointerTailLength(nodes));
    pointer.childNodes[1].setAttribute('opacity', 1);
    pointer.childNodes[0].setAttribute('opacity', 0);
    pointer.childNodes[2].setAttribute('transform', getLongPointerTipTransform(nodes));
}

// svg attribute functions
// returns d attribute of the first frame of curved tail
export function getArcD(nodes) {
    const radius = getNodeDimensions(nodes).height * 3
    return `M ${1 / 2 * getPointerTipHeight(nodes)} ${getPointerTipBaseLength(nodes) / 2} `
        + `a ${radius} ${radius} 0 0 1 ${getLongPointerTailLength(nodes)} 0`;
}

// returns d attribute of the target frame when flattening curved tail 
export function getFlatArcD(nodes) {
    return `M ${1 / 2 * getPointerTipHeight(nodes)} ${getPointerTipBaseLength(nodes) / 2} `
        + `a 5000 5000 0 0 1 ${getLongPointerTailLength(nodes)} 0`;
}

// returns transform attribute of the tip of a curved pointer
export function getArcTipTransform(nodes) {
    return `translate(${getOffsetDistance(nodes)}, 0) `
        + `rotate(35, ${getShortPointerLength(nodes)}, ${1 / 2 * getPointerTipBaseLength(nodes)})`;
}

// returns transform attribute of the tip of a long pointer
export function getLongPointerTipTransform(nodes) {
    return `translate(${getOffsetDistance(nodes)}, 0) `
        + `rotate(0, ${getShortPointerLength(nodes)}, ${1 / 2 * getPointerTipBaseLength(nodes)})`;
}

// svg sizing functions
// returns the dimensions of the node rectangle
export function getNodeDimensions(nodes) {
    const height = 2 * parseInt(getComputedStyle(document.documentElement).fontSize);
    const width = 3 / 2 * height;
    return { width, height };
}

// returns full horizontal length of a short pointer, including the tip
export function getShortPointerLength(nodes) {
    return getNodeDimensions(nodes.length).width;
}

// returns total length of a node and pointer pair
export function getOffsetDistance(nodes) {
    return 5 / 6 * getNodeDimensions(nodes.length).width + getShortPointerLength(nodes);
}

// returns thickness of a node's outline and pointer tail
export function getStrokeWidth(nodes) {
    return getNodeDimensions(nodes).width / 15;
}

// returns the length of the base (vertical side) of the pointer's triangular tip 
export function getPointerTipBaseLength(nodes) {
    return 3 * getStrokeWidth(nodes);
}

// returns the height of the pointer's triangular tip
export function getPointerTipHeight(nodes) {
    return getShortPointerLength(nodes) / 10;
}

// returns the length of a short pointer's tail
export function getShortPointerTailLength(nodes) {
    return getShortPointerLength(nodes) - getPointerTipHeight(nodes);
}

// returns the length of a long pointer's tail
export function getLongPointerTailLength(nodes) {
    return getOffsetDistance(nodes) + getShortPointerTailLength(nodes);
}

// miscellaneous utility functions
// extracts transform values from a transform attribute
export function getTransformValue(target) {
    const transform = target.getAttribute('transform');
    return [...transform.matchAll(/[\d]+\.?(?:[\d]+)?/g)].map((el) => parseFloat(el[0]));
}