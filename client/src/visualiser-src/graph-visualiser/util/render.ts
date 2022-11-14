import * as d3 from 'd3';
import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import {
  ARROWHEAD_FATNESS,
  ARROWHEAD_FILL,
  CONTAINER_DEFAULT_HEIGHT,
  CONTAINER_DEFAULT_WIDTH,
  EDGE_FILL,
  EDGE_PATH_D,
  EDGE_WIDTH,
  NODE_DIAMETER,
  STROKE_WIDTH,
  VERTEX_FONT_SIZE,
  VISUALISER_CANVAS,
  WEIGHT_LABEL_SIZE,
} from 'visualiser-src/common/constants';
import { GraphicalEdge } from '../data-structure/GraphicalEdge';
import { GraphicalVertex } from '../data-structure/GraphicalVertex';
import { getEdgeIdFragment } from './id';

type GraphContainer = d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
type EdgeGroup = d3.Selection<
  d3.BaseType | SVGLineElement,
  d3.SimulationLinkDatum<d3.SimulationNodeDatum>,
  SVGGElement,
  unknown
>;
type VertexGroup = d3.Selection<
  d3.BaseType | SVGCircleElement,
  d3.SimulationNodeDatum,
  SVGGElement,
  unknown
>;
type WeightLabelGroup = d3.Selection<
  d3.BaseType | SVGTextElement,
  d3.SimulationLinkDatum<d3.SimulationNodeDatum>,
  SVGGElement,
  unknown
>;
type VertexTextGroup = d3.Selection<
  d3.BaseType | SVGTextElement,
  d3.SimulationNodeDatum,
  SVGGElement,
  unknown
>;

/**
 * Extracts the primitive value from the given value.
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf.
 * @param value
 */
const getPrimitiveVal = (value) =>
  value !== null && typeof value === 'object' ? value.valueOf() : value;

/**
 * Determines the dimensions of the containing box around the graph visualiser.
 * These boundaries prevent nodes and edges from extending beyond the container.
 * The dimensions are determined based on the current viewport.
 */
const getGraphContainerDimensions = (): [number, number] => {
  const containerWidth =
    Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) ||
    CONTAINER_DEFAULT_WIDTH;
  const containerHeight =
    Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 600 ||
    CONTAINER_DEFAULT_HEIGHT;
  return [containerWidth, containerHeight];
};

/**
 * Creates a function that takes in a value and returns that value clamped
 * inside the boundary [minPosition, maxPosition].
 *
 * @param minPosition
 * @param maxPosition
 * @returns
 */
const getClamper = (minPosition: number, maxPosition: number) => (position: number) =>
  Math.max(minPosition, Math.min(maxPosition, position));

/**
 * Callback that gets run on each 'tick' of the force simulation. Think of this
 * as a function called for each frame in a video game.
 *
 * On each tick, the individual positions of the edges, vertices, labels, etc.
 * needs to be updated so reflect the effects of the changing forces.
 * E.g. two vertices that are very close together should repel. This happens
 * over time in the real world, and we use each 'tick' to simulate that passage
 * of time.
 *
 * @param edgeGroup
 * @param vertexGroup
 * @param weightLabelGroup
 * @param vertexTextGroup
 * @param containerWidth
 * @param containerHeight
 */
const handleTick = (
  edgeGroup: EdgeGroup,
  vertexGroup: VertexGroup,
  weightLabelGroup: WeightLabelGroup,
  vertexTextGroup: VertexTextGroup,
  containerWidth: number,
  containerHeight: number
) => {
  // Determine the x and y boundaries that a vertex can be positioned at.
  // Clamping is necessary to prevent the vertex from flying out of the
  // container's dimensions.
  const clampX = getClamper(
    -containerWidth / 2 + NODE_DIAMETER / 2,
    containerWidth / 2 - NODE_DIAMETER / 2
  );
  const clampY = getClamper(
    -containerHeight / 2 + NODE_DIAMETER / 2,
    containerHeight / 2 - NODE_DIAMETER / 2
  );

  // On each tick of the simulation, update the coordinates of everything.
  edgeGroup
    .attr('x1', (d: SimulationLinkDatum<SimulationNodeDatum>) =>
      clampX((d.source as SimulationNodeDatum).x)
    )
    .attr('y1', (d: SimulationLinkDatum<SimulationNodeDatum>) =>
      clampY((d.source as SimulationNodeDatum).y)
    )
    .attr('x2', (d: SimulationLinkDatum<SimulationNodeDatum>) =>
      clampX((d.target as SimulationNodeDatum).x)
    )
    .attr('y2', (d: SimulationLinkDatum<SimulationNodeDatum>) =>
      clampY((d.target as SimulationNodeDatum).y)
    );
  vertexGroup.attr('cx', (d) => clampX(d.x)).attr('cy', (d) => clampY(d.y));
  weightLabelGroup
    .attr(
      'x',
      (d: SimulationLinkDatum<SimulationNodeDatum>) =>
        (clampX((d.source as SimulationNodeDatum).x) +
          clampX((d.target as SimulationNodeDatum).x)) /
        2
    )
    .attr(
      'y',
      (d: SimulationLinkDatum<SimulationNodeDatum>) =>
        (clampY((d.source as SimulationNodeDatum).y) +
          clampY((d.target as SimulationNodeDatum).y)) /
        2
    );
  vertexTextGroup.attr('x', (d) => clampX(d.x)).attr('y', (d) => clampY(d.y));
};

const instantiateEdges = (
  graph: GraphContainer,
  simulationEdges: SimulationLinkDatum<SimulationNodeDatum>[]
) =>
  graph
    .append('g')
    .attr('stroke', EDGE_FILL)
    .attr('stroke-width', EDGE_WIDTH)
    .attr('stroke-linecap', 'round')
    .attr('id', 'edges')
    .selectAll('line')
    .data(simulationEdges)
    .join('line')
    .attr(
      'id',
      (edge: SimulationLinkDatum<SimulationNodeDatum>) => `edge-${getEdgeIdFragment(edge)}`
    )
    .attr(
      'marker-end',
      (edge: SimulationLinkDatum<SimulationNodeDatum>) =>
        `url(#arrowhead-end-${getEdgeIdFragment(edge)})`
    )
    .attr('marker-start', (edge: SimulationLinkDatum<SimulationNodeDatum>) => {
      // Attach the arrow pointing to the source if the edge is bidirectional.
      if ((edge as GraphicalEdge).isBidirectional) {
        return `url(#arrowhead-start-${getEdgeIdFragment(edge)})`;
      }
      return '';
    });

const instantiateVertices = (graph: GraphContainer, simulationVertices: SimulationNodeDatum[]) =>
  graph
    .append('g')
    .attr('fill', '#FFFFFF')
    .attr('stroke', '#0000FF')
    .attr('stroke-opacity', 1)
    .attr('stroke-width', STROKE_WIDTH)
    .attr('id', 'vertices')
    .selectAll('circle')
    .data(simulationVertices)
    .join('circle')
    .attr('r', NODE_DIAMETER / 2)
    .attr('id', (node) => `vertex-${(node as GraphicalVertex).id}`)
    .attr('stroke', '#000000');

const instantiateEdgeArrowheads = (
  graph: GraphContainer,
  simulationEdges: SimulationLinkDatum<SimulationNodeDatum>[]
) => {
  graph
    .append('g')
    .attr('id', 'end-arrowheads')
    .selectAll('marker')
    .data(simulationEdges)
    .join('marker')
    .attr(
      'id',
      (edge: SimulationLinkDatum<SimulationNodeDatum>) => `arrowhead-end-${getEdgeIdFragment(edge)}`
    )
    .attr('viewBox', '-0 -10 20 20')
    // The offset of the arrowhead.
    .attr('refX', NODE_DIAMETER / 2 - 5)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', ARROWHEAD_FATNESS)
    .attr('markerHeight', ARROWHEAD_FATNESS)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', EDGE_PATH_D)
    .attr('fill', ARROWHEAD_FILL);
  graph
    .append('g')
    .attr('id', 'start-arrowheads')
    .selectAll('marker')
    .data(simulationEdges)
    .join('marker')
    .attr('id', (edge) => `arrowhead-start-${getEdgeIdFragment(edge)}`)
    .attr('viewBox', '-0 -10 20 20')
    // The offset of the arrowhead.
    .attr('refX', NODE_DIAMETER / 2 - 5)
    .attr('refY', 0)
    // Reverses the direction of 'end-arrowhead'. See: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/orient.
    .attr('orient', 'auto-start-reverse')
    .attr('markerWidth', ARROWHEAD_FATNESS)
    .attr('markerHeight', ARROWHEAD_FATNESS)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', EDGE_PATH_D)
    .attr('fill', ARROWHEAD_FILL);
};

const instantiateVertexLabels = (
  graph: GraphContainer,
  simulationVertices: SimulationNodeDatum[]
) =>
  graph
    .append('g')
    .attr('fill', '#000000')
    .style('user-select', 'none')
    .attr('id', 'vertex-labels')
    .selectAll('text')
    .data(simulationVertices)
    .join('text')
    .style('pointer-events', 'none')
    .attr('id', (node) => `text-${(node as GraphicalVertex).id}`)
    .attr('font-size', VERTEX_FONT_SIZE)
    // Centering text inside a circle: https://stackoverflow.com/questions/28128491/svg-center-text-in-circle.
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .text((_, i) => i);

const instantiateWeightLabels = (
  graph: GraphContainer,
  simulationEdges: SimulationLinkDatum<SimulationNodeDatum>[]
) =>
  graph
    .append('g')
    .attr('id', 'weight-labels')
    .style('user-select', 'none')
    .selectAll('text')
    .data(simulationEdges)
    .join('text')
    .attr(
      'id',
      (edge: SimulationLinkDatum<SimulationNodeDatum>) => `weight-${getEdgeIdFragment(edge)}`
    )
    .text((edge) => `${(edge as GraphicalEdge).weight}`)
    .style('font-size', WEIGHT_LABEL_SIZE)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle');

/**
 * Settle every single thing in the graph into the right position. All vertices,
 * edges, etc. start by default in the origin of the canvas and then the forces
 * drive everything into the right position where all forces are balanced on the
 * vertices.
 * @param edgeGroup
 * @param vertexGroup
 * @param weightLabelGroup
 * @param vertexTextGroup
 * @param containerWidth
 * @param containerHeight
 */
const reachEquilibriumPosition = (
  edgeGroup: EdgeGroup,
  vertexGroup: VertexGroup,
  weightLabelGroup: WeightLabelGroup,
  vertexTextGroup: VertexTextGroup,
  containerWidth: number,
  containerHeight: number
) => {
  const clampX = (x) =>
    Math.max(
      -containerWidth / 2 + NODE_DIAMETER / 2,
      Math.min(containerWidth / 2 - NODE_DIAMETER / 2, x)
    );
  const clampY = (y) =>
    Math.max(
      -containerHeight / 2 + NODE_DIAMETER / 2,
      Math.min(containerHeight / 2 - NODE_DIAMETER / 2, y)
    );

  edgeGroup
    .attr('x1', (d: SimulationLinkDatum<SimulationNodeDatum>) =>
      clampX((d.source as SimulationNodeDatum).x)
    )
    .attr('y1', (d: SimulationLinkDatum<SimulationNodeDatum>) =>
      clampY((d.source as SimulationNodeDatum).y)
    )
    .attr('x2', (d: SimulationLinkDatum<SimulationNodeDatum>) =>
      clampX((d.target as SimulationNodeDatum).x)
    )
    .attr('y2', (d: SimulationLinkDatum<SimulationNodeDatum>) =>
      clampY((d.target as SimulationNodeDatum).y)
    );
  vertexGroup
    .attr('cx', (d: SimulationNodeDatum) => clampX(d.x))
    .attr('cy', (d: SimulationNodeDatum) => clampY(d.y));
  weightLabelGroup
    .attr(
      'x',
      (d: SimulationLinkDatum<SimulationNodeDatum>) =>
        (clampX((d.source as SimulationNodeDatum).x) +
          clampX((d.target as SimulationNodeDatum).x)) /
        2
    )
    .attr(
      'y',
      (d: SimulationLinkDatum<SimulationNodeDatum>) =>
        (clampY((d.source as SimulationNodeDatum).y) +
          clampY((d.target as SimulationNodeDatum).y)) /
        2
    );

  vertexTextGroup.attr('x', (d: any) => clampX(d.x)).attr('y', (d: any) => clampY(d.y));
};

export function renderForceGraph(vertices: GraphicalVertex[], edges: GraphicalEdge[]) {
  const [containerWidth, containerHeight] = getGraphContainerDimensions();

  // Clear the graph's existing <g> children, which are the containers for
  // the graph's vertices, edges, weight labels, etc.
  d3.select(VISUALISER_CANVAS).selectAll('g').remove();

  // Generating the node & links dataset that D3 uses for simulating the graph.
  const verticesMap = d3.map(vertices, (vertex) => vertex.id).map(getPrimitiveVal);
  const edgesSourceMap = d3.map(edges, (edge) => edge.source.id).map(getPrimitiveVal);
  const edgesDestMap = d3.map(edges, (edge) => edge.target.id).map(getPrimitiveVal);

  // Replace the input nodes and links with mutable objects for the simulation.
  // Here, we build the vertex and edge maps that are used to render the graph.
  const simVertices: SimulationNodeDatum[] = d3.map(
    vertices,
    (_, i) => ({ id: verticesMap[i] } as SimulationNodeDatum)
  );
  const simEdges: SimulationLinkDatum<SimulationNodeDatum>[] = d3.map(
    edges,
    (edge, i) =>
      ({
        source: edgesSourceMap[i],
        target: edgesDestMap[i],
        weight: edge.weight,
        isBidirectional: edge.isBidirectional,
      } as SimulationLinkDatum<SimulationNodeDatum>)
  );

  // Setting the dimensions of the graph SVG container.
  // Expects the visualiser canvas to be mounted on the DOM already.
  const graph = d3
    .select(VISUALISER_CANVAS)
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    // Setting the origin to be at the center of the SVG container.
    .attr('viewBox', [-containerWidth / 2, -containerHeight / 2, containerWidth, containerHeight]);

  // Construct the forces. Nodes must strongly repel each other and links must
  // attract them together.
  const forceNode = d3.forceManyBody().strength(-2800).distanceMax(500);
  const forceLink = d3
    .forceLink(simEdges)
    .id(({ index: i }) => verticesMap[i])
    .strength(0.08);
  const centralForce = d3.forceCenter();

  // Set the force directed layout simulation parameters.
  const simulation = d3
    .forceSimulation(simVertices)
    .force('link', forceLink)
    .force('charge', forceNode)
    .force('center', centralForce);

  // The simulation should avoid playing out the full 'big bang' animation that
  // happens at the start where all vertices move into the right positions until
  // all forces are balanced.
  // See: https://stackoverflow.com/questions/47510853/how-to-disable-animation-in-a-force-directed-graph
  simulation.stop();
  simulation.tick(300);

  // Add the edges to the graph and set their properties.
  const edgeGroup = instantiateEdges(graph, simEdges);
  instantiateEdgeArrowheads(graph, simEdges);

  // Add the weight labels to the graph and set their properties.
  const weightLabelGroup = instantiateWeightLabels(graph, simEdges);

  // Add the vertices to the graph and set their properties.
  const vertexGroup = instantiateVertices(graph, simVertices);

  // Add the vertex text labels to the graph and set their properties.
  const vertexTextGroup = instantiateVertexLabels(graph, simVertices);

  // Settle every node in the right place.
  reachEquilibriumPosition(
    edgeGroup,
    vertexGroup,
    weightLabelGroup,
    vertexTextGroup,
    containerWidth,
    containerHeight
  );

  // Registering a tick event handler so that whenever a node's position
  // updates (due to user drag, for example), the rest of the nodes re-update
  // their position.
  simulation.on('tick', () =>
    handleTick(
      edgeGroup,
      vertexGroup,
      weightLabelGroup,
      vertexTextGroup,
      containerWidth,
      containerHeight
    )
  );

  return Object.assign(graph.node());
}
