import { Circle, Path, SVG } from '@svgdotjs/svg.js';
import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { injectIds } from 'visualiser-src/common/helpers';
import { Documentation } from 'visualiser-src/common/typedefs';
import GraphAddVertexAnimationProducer from '../animation-producer/GraphAddVertexAnimationProducer';
import GraphDfsAnimationProducer from '../animation-producer/GraphDfsAnimationProducer';
import { renderForceGraph } from '../util/util';
import { Vertex } from './Vertex';
import { Edge } from './Edge';

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
    Vertex.from(0),
    Vertex.from(1),
    Vertex.from(2),
    Vertex.from(3),
    Vertex.from(4),
    Vertex.from(5),
    Vertex.from(6),
    Vertex.from(7),
  ];

  private edges: Edge[] = [
    Edge.from('0', '1', 5, true),
    Edge.from('0', '2', 3, false),
    Edge.from('2', '5', 5, false),
    Edge.from('3', '5', 3, false),
    Edge.from('3', '2', 2, false),
    Edge.from('1', '4', 1, true),
    Edge.from('3', '4', 8, false),
    Edge.from('5', '6', 2, false),
    Edge.from('7', '2', 4, true),
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
    this.vertices = [...this.vertices, Vertex.from(this.vertices.length)];

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
    this.edges = [
      ...this.edges,
      { source: String(from), target: String(to), weight: 5, isBidirectional: false },
    ];

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
        (edge.source === String(v) && edge.target === String(w)) ||
        (edge.source === String(w) && edge.target === String(v) && edge.isBidirectional)
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
