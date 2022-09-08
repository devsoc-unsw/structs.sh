import { Circle, Path, SVG } from '@svgdotjs/svg.js';
import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { injectIds } from 'visualiser-src/common/helpers';
import { Documentation } from 'visualiser-src/common/typedefs';
import GraphAddVertexAnimationProducer from '../animation-producer/GraphAddVertexAnimationProducer';
import GraphDfsAnimationProducer from '../animation-producer/GraphDfsAnimationProducer';
import { Edge, Vertex } from '../util/typedefs';
import { renderForceGraph } from '../util/util';

/**
 * Exposes animation-producing graph algorithms that are stateful, meaning that
 * this class also manages the underlying data structures for representing a
 * graph.
 *
 * Note to developers: This class relies on using D3 and D3-force to simulate
 * forces between vertices and edges to produce an aesthetic graph layout.
 * See force-directed graph drawing: https://en.wikipedia.org/wiki/Force-directed_graph_drawing.
 *
 * @remarks
 * Expects that the visualiser canvas is already mounted on the DOM in order
 * to initialise the graph.
 */
export default class GraphicalGraph extends GraphicalDataStructure {
  // Commands to be shown on the client menu.
  private static documentation: Documentation = injectIds({
    dfs: {
      args: ['src'],
      description: 'Performs depth-first search starting from src.',
    },
    addVertex: {
      args: [],
      description: 'Add a new vertex to the graph.',
    },
    addEdge: {
      args: ['from', 'to'],
      description: 'Add a new edge to the graph.',
    },
  });

  private vertices: Vertex[] = [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
  ];

  private edges: Edge[] = [
    { source: 0, target: 1, weight: 5, isBidirectional: true },
    { source: 0, target: 2, weight: 3, isBidirectional: false },
    { source: 2, target: 5, weight: 5, isBidirectional: false },
    { source: 3, target: 5, weight: 3, isBidirectional: false },
    { source: 3, target: 2, weight: 2, isBidirectional: false },
    { source: 1, target: 4, weight: 1, isBidirectional: true },
    { source: 3, target: 4, weight: 8, isBidirectional: false },
    { source: 5, target: 6, weight: 2, isBidirectional: false },
    { source: 7, target: 2, weight: 4, isBidirectional: true },
  ];

  constructor() {
    super();
    this.loadGraph();

    // TODO: initialise the graph with randomly generated vertices and edges, sparsely.
  }

  /**
   * Renders or re-renders the graph SVG elements into the visualiser canvas.
   */
  loadGraph() {
    renderForceGraph(
      { vertices: this.vertices, edges: this.edges },
      {
        nodeId: (d) => d.id,
        linkStrokeWidth: (l) => Math.sqrt(l.value),
        // TODO: on page dimensions change (from zooming in or out, for example), refresh the width and height so that the graph is positioned correctly.
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 600,
      }
    );
  }

  /**
   * Increases the number of vertices in the graph by 1.
   * TODO: currently unanimated. Does this need an animation?
   */
  addVertex(): AnimationProducer {
    this.vertices = [...this.vertices, { id: `${this.vertices.length}` }];

    // Reload the graph to sync the change in `this.edges` with what's shown
    // in the visualiser canvas.
    this.loadGraph();
    return new GraphAddVertexAnimationProducer();
  }

  /**
   * Inserts the edge from `from` to `to`.
   * Assumes that `from` and `to` are valid vertex numbers.
   * TODO: currently unanimated. Does this need an animation?
   * @param from
   * @param to
   * @returns
   */
  addEdge(from: number, to: number): AnimationProducer {
    this.edges = [...this.edges, { source: from, target: to, weight: 5, isBidirectional: false }];

    // Reload the graph to sync the change in `this.edges` with what's shown
    // in the visualiser canvas.
    this.loadGraph();
    return new GraphAddVertexAnimationProducer();
  }

  /**
   * Produces a sequence of animations for visualising DFS.
   * @remarks
   * This method wraps around the recursive helper, `dfsRecurse`.
   * @param src The vertex to start DFS from.
   * @returns Animation producer with the steps necessary for visualising DFS.
   */
  public dfs(src: number): AnimationProducer {
    const producer = new GraphDfsAnimationProducer();
    producer.renderDfsCode();

    const visited = new Set<number>();
    this.dfsRecurse(producer, src, visited);

    return producer;
  }

  /**
   * Tells the animation producer to produce the sequence of vertex and edge
   * highlighting necessary to animate a DFS traversal of the current graph.
   * @remarks
   * Assumes that `visited` does not contain `src`.
   * @param animationProducer
   * @param src
   * @param visited A set of all vertices that have been visited through DFS.
   */
  private dfsRecurse(
    animationProducer: GraphDfsAnimationProducer,
    src: number,
    visited: Set<number>
  ): void {
    // Mark the current vertex as visited.
    visited.add(src);
    const vertexElem = this.getDomVertex(src);
    animationProducer.doAnimationAndHighlight(2, animationProducer.highlightVertex, vertexElem);

    // For each unvisited neighbour, highlight the edge to that neighbour and
    // launch DFS on them.
    for (let neighbour = 0; neighbour < this.vertices.length; neighbour += 1) {
      if (this.isAdjacent(src, neighbour) && !visited.has(neighbour)) {
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.highlightEdge,
          this.getDomEdge(src, neighbour)
        );
        this.dfsRecurse(animationProducer, neighbour, visited);
      }
    }
  }

  /**
   * Determines whether the edge from `v` to `w` exists.
   * @param v Source vertex.
   * @param w Destination vertex.
   * @returns existence of edge v-w.
   */
  private isAdjacent(v: number, w: number): boolean {
    return this.edges.some(
      (edge) =>
        (edge.source === v && edge.target === w) ||
        (edge.source === w && edge.target === v && edge.isBidirectional)
    );
  }

  public generate(): void {
    // TODO: IMPLEMENT ME
    alert('NOT IMPLEMENTED');
  }

  public reset(): void {
    // Reset state.
    // TODO: IMPLEMENT ME
    alert('NOT IMPLEMENTED');
  }

  public get documentation() {
    return GraphicalGraph.documentation;
  }

  private getDomVertex(vertex: number): Circle {
    return SVG(`#vertex-${vertex}`) as Circle;
  }

  private getDomEdge(from: number, to: number): Path {
    return SVG(`.edge-${from}-${to}`) as Path;
  }
}
