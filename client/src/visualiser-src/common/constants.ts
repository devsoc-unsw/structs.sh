/** How thick the stroke is when drawing shapes */
export const strokeWidth = 2;

/** The diameter of the node */
export const nodeDiameter = 50;

/** The real diameter of a node, because the stroke width inflates it
 *
 * To put it into layman's terms, the outer edge = diameter + strokeWidth/2 + strokeWidth/2
 * */
export const actualNodeDiameter = nodeDiameter + strokeWidth;

/**
 * The size of the arrowhead on linked list pointers
 */
export const markerLength = 15;

/**
 * A string in SVG path's mini language
 *
 * For more further reading, go here: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/d
 */
export const pathD = `M 0 0 L ${markerLength} ${markerLength / 2} L 0 ${markerLength} z`;

/** just a constant used for developer with matching lines to code */
export const showLineNumbers = false;

// Animation attributes
export const defaultSpeed = 0.5;

// just some HTML classes and IDs
export const VISUALISER_CANVAS = '#visualiser-canvas';
export const CODE_CANVAS = '#code-canvas';
export const CODE_CONTAINER = 'code-container';
