import { SVG } from '@svgdotjs/svg.js';
import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import { VISUALISER_CANVAS } from 'visualiser-src/common/constants';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { injectIds } from 'visualiser-src/common/helpers';
import { Documentation } from 'visualiser-src/common/typedefs';
import GraphAddVertexAnimationProducer from '../animation-producer/GraphAddVertexAnimationProducer';
import GraphDfsAnimationProducer from '../animation-producer/GraphDfsAnimationProducer';
import { renderForceGraph } from '../util/util';

// An linked list data structure containing all linked list operations.
// Every operation producers a LinkedListAnimationProducer, which an VisualiserController
// can then use to place SVG.Runners on a timeline to animate the operation.
export default class GraphicalGraph extends GraphicalDataStructure {
  // What to show on the user input menu.
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

  // TODO: add types to vertices and edges.
  private vertices = [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
  ];

  private edges = [
    { source: '0', target: '1', weight: 5, isBidirectional: true },
    { source: '0', target: '2', weight: 3, isBidirectional: false },
    { source: '2', target: '5', weight: 5, isBidirectional: false },
    { source: '3', target: '5', weight: 3, isBidirectional: false },
    { source: '3', target: '2', weight: 2, isBidirectional: false },
    { source: '1', target: '4', weight: 1, isBidirectional: true },
    { source: '3', target: '4', weight: 8, isBidirectional: false },
    { source: '5', target: '6', weight: 2, isBidirectional: false },
    { source: '7', target: '2', weight: 4, isBidirectional: true },
  ];

  constructor() {
    super();
    this.loadGraph();
  }

  loadGraph() {
    // Draw the initial graph onto the visualiser canvas.
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

  addVertex(): AnimationProducer {
    this.vertices = [...this.vertices, { id: `${this.vertices.length}` }];

    // Reload the graph.
    this.loadGraph();
    return new GraphAddVertexAnimationProducer();
  }

  addEdge(from: number, to: number): AnimationProducer {
    this.edges = [
      ...this.edges,
      { source: `${from}`, target: `${to}`, weight: 5, isBidirectional: false },
    ];

    // Reload the graph.
    this.loadGraph();
    return new GraphAddVertexAnimationProducer();
  }

  // TODO: Figure out how the BST resets the styling after the animation concludes. Bonus: figure out why the attribute animates from black.
  /**
   * TODO: document
   * @remarks
   * This method wraps around the recursive helper, `dfsRecurse`.
   * @param src
   * @returns
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
   * @param TODO: document
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

  private getDomVertex(vertex: number) {
    return SVG(`#vertex-${vertex}`);
  }

  private getDomEdge(from: number, to: number) {
    return SVG(`.edge-${from}-${to}`);
  }
}
