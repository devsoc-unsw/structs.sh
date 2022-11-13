export const STROKE_WIDTH = 2;
export const NODE_DIAMETER = 50;
export const ACTUAL_NODE_DIAMETER = NODE_DIAMETER + STROKE_WIDTH;

export const MARKER_LENGTH = 15;
export const PATH_D = `M 0 0 L ${MARKER_LENGTH} ${MARKER_LENGTH / 2} L 0 ${MARKER_LENGTH} z`;

// just a constant used for developer with matching lines to code
export const SHOW_LINE_NUMBERS = false;

// Animation attributes
export const DEFAULT_SPEED = 0.6;

export const VISUALISER_CANVAS = '#visualiser-canvas';
export const CODE_CANVAS = '#code-canvas';
export const CODE_CONTAINER = 'code-container';

/* -------------------------------------------------------------------------- */
/*                               Graph Constants                              */
/* -------------------------------------------------------------------------- */
/* ----------------------- Randomised Graph Generation ---------------------- */
export const MAX_RANDOM_VERTICES = 7;
export const MIN_RANDOM_VERTICES = 4;

// A multiplier on the number of vertices.
// E.g. A factor of 1.2 results in 1.2*num_vertices edges being generated.
export const MAX_EDGES_FACTOR = 1.5;

/* ------------------------- Graph Drawing Constants ------------------------ */
export const CONTAINER_DEFAULT_WIDTH = 400;
export const CONTAINER_DEFAULT_HEIGHT = 400;

// Force parameters.
export const INTER_VERTEX_FORCE = -2000;
export const EDGE_ATTRACTIVE_FORCE_MULTIPLIER = 0.1;

// Size parameters.
export const EDGE_WIDTH = '6px';
export const WEIGHT_LABEL_SIZE = '22px';
export const VERTEX_FONT_SIZE = '28px';
export const NODE_RADIUS = 24;

export const ARROWHEAD_SIZE_FACTOR = 4.5;
