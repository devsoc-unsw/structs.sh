/* eslint-disable */
// TODO: remove the eslint disable

import * as d3 from 'd3';
import { VISUALISER_CANVAS } from 'visualiser-src/common/constants';
import {
  ARROWHEAD_SIZE_FACTOR,
  EDGE_ATTRACTIVE_FORCE_MULTIPLIER,
  EDGE_WIDTH,
  INTER_VERTEX_FORCE,
  NODE_RADIUS,
  VERTEX_NUMBER_SIZE,
  WEIGHT_LABEL_SIZE,
} from './constants';

function getPrimitiveVal(value) {
  return value !== null && typeof value === 'object' ? value.valueOf() : value;
}

// Defining the arrowhead for directed edges.
// Sourced the attributes from here: http://bl.ocks.org/fancellu/2c782394602a93921faff74e594d1bb1.
// TODO: these could be defined declaratively elsewhere
function defineArrowheads() {
  const graph = d3.select(VISUALISER_CANVAS);

  graph
    .append('defs')
    .append('marker')
    .attr('id', 'end-arrowhead')
    .attr('viewBox', '-0 -10 20 20')
    .attr('refX', NODE_RADIUS) // The offset of the arrowhead.
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', ARROWHEAD_SIZE_FACTOR * 1.6)
    .attr('markerHeight', ARROWHEAD_SIZE_FACTOR * 1.6)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr(
      'd',
      `M 0,-${ARROWHEAD_SIZE_FACTOR} L ${ARROWHEAD_SIZE_FACTOR * 2} ,0 L 0,${ARROWHEAD_SIZE_FACTOR}`
    )
    .attr('fill', '#999')
    .style('stroke', 'none');

  graph
    .select('defs')
    .append('marker')
    .attr('id', 'start-arrowhead')
    .attr('viewBox', '-0 -10 20 20')
    .attr('refX', NODE_RADIUS) // The offset of the arrowhead.
    .attr('refY', 0)
    .attr('orient', 'auto-start-reverse') // Reverses the direction of 'end-arrowhead'. See: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/orient.
    .attr('markerWidth', ARROWHEAD_SIZE_FACTOR * 1.6)
    .attr('markerHeight', ARROWHEAD_SIZE_FACTOR * 1.6)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr(
      'd',
      `M 0,-${ARROWHEAD_SIZE_FACTOR} L ${ARROWHEAD_SIZE_FACTOR * 2} ,0 L 0,${ARROWHEAD_SIZE_FACTOR}`
    )
    .attr('fill', '#999')
    .style('stroke', 'none');

  // Unfortunately, there is no way for the <marker> element to inherit the
  // styling of the parent <line>. The workaround is to define these highlighted
  // variants of the arrowhead which get applied on highlighted edges.
  graph
    .select('defs')
    .append('marker')
    .attr('id', 'highlighted-start-arrowhead')
    .attr('viewBox', '-0 -10 20 20')
    .attr('refX', NODE_RADIUS) // The offset of the arrowhead.
    .attr('refY', 0)
    .attr('orient', 'auto-start-reverse')
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr(
      'd',
      `M 0,-${ARROWHEAD_SIZE_FACTOR} L ${ARROWHEAD_SIZE_FACTOR * 2} ,0 L 0,${ARROWHEAD_SIZE_FACTOR}`
    )
    .attr('fill', 'gold')
    .style('stroke', 'none');

  graph
    .select('defs')
    .append('marker')
    .attr('id', 'highlighted-end-arrowhead')
    .attr('viewBox', '-0 -10 20 20')
    .attr('refX', NODE_RADIUS) // The offset of the arrowhead.
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr(
      'd',
      `M 0,-${ARROWHEAD_SIZE_FACTOR} L ${ARROWHEAD_SIZE_FACTOR * 2} ,0 L 0,${ARROWHEAD_SIZE_FACTOR}`
    )
    .attr('fill', 'gold')
    .style('stroke', 'none');
}

export function renderForceGraph(
  {
    vertices, // an iterable of node objects (typically [{id}, …])
    edges, // an iterable of link objects (typically [{source, target}, …])
  },
  {
    nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
    nodeStroke = '#fff', // node stroke color
    nodeStrokeWidth = 1.5, // node stroke width, in pixels
    nodeStrokeOpacity = 1, // node stroke opacity
    nodeRadius = NODE_RADIUS, // node radius, in pixels
    getEdgeSource = ({ source }) => source, // given d in links, returns a node identifier string
    getEdgeDest = ({ target }) => target, // given d in links, returns a node identifier string
    linkStroke = '#111111', // link stroke color
    linkStrokeOpacity = 0.4, // link stroke opacity
    linkStrokeWidth = (d) => d.weight, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = 'round', // link stroke linecap
    width = 400, // outer width, in pixels
    height = 400, // outer height, in pixels
  } = {}
) {
  // Generating the node & links dataset that D3 uses for simulating the graph.
  const verticesMap = d3.map(vertices, nodeId).map(getPrimitiveVal);
  const edgesSourceMap = d3.map(edges, getEdgeSource).map(getPrimitiveVal);
  const edgesDestMap = d3.map(edges, getEdgeDest).map(getPrimitiveVal);

  // Replace the input nodes and links with mutable objects for the simulation.
  // Here, we build the vertex and edge maps that are used to render the graph.
  const simVertices = d3.map(vertices, (_, i) => ({ id: verticesMap[i] }));
  const simEdges = d3.map(edges, (edge, i) => ({
    source: edgesSourceMap[i],
    target: edgesDestMap[i],
    weight: edge.weight,
    isBidirectional: edge.isBidirectional,
  }));

  // Generating styling maps that we use to apply styles. We can do things
  // like make every edge's width scale proportionally to its weight, ie.
  // make higher weight edges wider than lower weight edges.
  const edgeWidths = typeof linkStrokeWidth !== 'function' ? null : d3.map(edges, linkStrokeWidth);
  const edgeColour = typeof linkStroke !== 'function' ? null : d3.map(edges, linkStroke);

  // Clear the graph's existing <g> children, which are the containers for
  // the graph's vertices, edges, weight labels, etc.
  d3.select(VISUALISER_CANVAS).selectAll('g').remove();

  function ticked(edgeGroup: any, vertexGroup: any, weightLabelGroup: any, vertexTextGroup: any) {
    const clampX = (x) => Math.max(-width / 2 + nodeRadius, Math.min(width / 2 - nodeRadius, x));
    const clampY = (y) => Math.max(-height / 2 + nodeRadius, Math.min(height / 2 - nodeRadius, y));

    // On each tick of the simulation, update the coordinates of everything.
    edgeGroup
      .attr('x1', (d) => clampX(d.source.x))
      .attr('y1', (d) => clampY(d.source.y))
      .attr('x2', (d) => clampX(d.target.x))
      .attr('y2', (d) => clampY(d.target.y));
    vertexGroup.attr('cx', (d) => clampX(d.x)).attr('cy', (d) => clampY(d.y));
    weightLabelGroup
      .attr('x', (d) => (clampX(d.source.x) + clampX(d.target.x)) / 2)
      .attr('y', (d) => (clampY(d.source.y) + clampY(d.target.y)) / 2);
    vertexTextGroup.attr('x', (d) => clampX(d.x)).attr('y', (d) => clampY(d.y));
  }

  // Setting the dimensions of the graph SVG container.
  // Expects the visualiser canvas to be mounted on the DOM already.
  const graph = d3
    .select(VISUALISER_CANVAS)
    .attr('width', width)
    .attr('height', height)
    .attr('width', width)
    .attr('height', height)
    .style('border', '1px solid black')
    .style('overflow', 'hidden')
    .attr('viewBox', [-width / 2, -height / 2, width, height]); // Setting the origin to be at the center of the SVG container.
  defineArrowheads();

  // Drag callback.
  function handleDrag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
  }

  // Construct the forces. Nodes must strongly repel each other and links must
  // attract them together.
  const forceNode = d3.forceManyBody().strength(INTER_VERTEX_FORCE).distanceMax(400);
  const forceLink = d3
    .forceLink(simEdges)
    .id(({ index: i }) => verticesMap[i])
    .strength(EDGE_ATTRACTIVE_FORCE_MULTIPLIER);
  const centralForce = d3.forceCenter().strength(1);

  // Set the force directed layout simulation parameters.
  const simulation = d3
    .forceSimulation(simVertices)
    .force('link', forceLink)
    .force('charge', forceNode)
    .force('center', centralForce)
    .force(
      'manyBody',
      d3
        .forceManyBody()
        .strength(1000) // A really negative force tends to space out nodes better.
        .distanceMax(200)
    ); // This prevents forces from pushing out isolated subgraphs/vertices to the far edge.

  // Add the edges to the graph and set their properties.
  const edgeGroup = graph
    .append('g')
    .attr('stroke', typeof linkStroke !== 'function' ? linkStroke : null)
    .attr('stroke-opacity', linkStrokeOpacity)
    .attr('stroke-width', typeof linkStrokeWidth !== 'function' ? linkStrokeWidth : EDGE_WIDTH)
    .attr('stroke-linecap', linkStrokeLinecap)
    .attr('id', 'edges')
    .selectAll('line')
    .data(simEdges)
    .join('line')
    .attr(
      'class',
      (link) => `edge-${link.source.id}-${link.target.id} edge-${link.target.id}-${link.source.id}`
    )
    .attr('marker-end', 'url(#end-arrowhead)') // Attach the arrowhead defined in <defs> earlier.
    .attr('marker-start', (link) => (link.isBidirectional ? 'url(#start-arrowhead)' : '')); // Add the start arrow IFF the link is bidirectional.

  // Add the weight labels to the graph and set their properties.
  const weightLabelGroup = graph
    .append('g')
    .attr('id', 'weight-labels')
    .style('user-select', 'none')
    .selectAll('text')
    .data(simEdges)
    .join('text')
    .attr(
      'id',
      (edge) =>
        `weight-${edge.source.id}-${edge.target.id} weight-${edge.target.id}-${edge.source.id}`
    )
    .text((edge) => `${edge.weight}`)
    .style('font-size', WEIGHT_LABEL_SIZE)
    .attr('fill', 'black')
    // .attr('stroke', 'brown')
    .attr('x', (link) => link.x1)
    .attr('y', (link) => link.y1)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle');

  // Add the vertices to the graph and set their properties.
  const vertexGroup = graph
    .append('g')
    .attr('fill', '#FFFFFF')
    .attr('stroke', nodeStroke)
    .attr('stroke-opacity', nodeStrokeOpacity)
    .attr('stroke-width', nodeStrokeWidth)
    .attr('id', 'vertices')
    .selectAll('circle')
    .data(simVertices)
    .join('circle')
    .attr('r', nodeRadius)
    .attr('id', (node) => `vertex-${node.id}`)
    .attr('stroke', '#000000')
    .call(handleDrag(simulation));

  // Add the vertex text labels to the graph and set their properties.
  const vertexTextGroup = graph
    .append('g')
    .attr('fill', '#000000')
    .style('user-select', 'none')
    .attr('id', 'vertex-labels')
    .selectAll('text')
    .data(simVertices)
    .join('text')
    .style('pointer-events', 'none')
    .attr('id', (node) => `text-${node.id}`)
    .attr('font-size', VERTEX_NUMBER_SIZE)
    .attr('alignment-baseline', 'middle') // Centering text inside a circle: https://stackoverflow.com/questions/28128491/svg-center-text-in-circle.
    .attr('text-anchor', 'middle')
    .text((_, i) => i);

  // Applying styling maps to the edges.
  if (edgeWidths) edgeGroup.attr('stroke-width', ({ index: i }) => edgeWidths[i]);
  if (edgeColour) edgeGroup.attr('stroke', ({ index: i }) => edgeColour[i]);

  simulation.on('tick', () => ticked(edgeGroup, vertexGroup, weightLabelGroup, vertexTextGroup));

  return Object.assign(graph.node());
}
