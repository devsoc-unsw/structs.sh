import { Circle, Path, SVG } from '@svgdotjs/svg.js';
import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { injectIds } from 'visualiser-src/common/helpers';
import { Documentation } from 'visualiser-src/common/typedefs';
import GraphDfsAnimationProducer from '../animation-producer/GraphDfsAnimationProducer';
import { renderForceGraph } from '../util/util';
import { GraphicalVertex } from './GraphicalVertex';
import { GraphicalEdge } from './GraphicalEdge';
import GraphAnimationProducer from '../animation-producer/GraphAnimationProducer';

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

  private vertices: GraphicalVertex[] = [
    GraphicalVertex.from(0),
    GraphicalVertex.from(1),
    GraphicalVertex.from(2),
    GraphicalVertex.from(3),
    GraphicalVertex.from(4),
    GraphicalVertex.from(5),
    GraphicalVertex.from(6),
    GraphicalVertex.from(7),
  ];

  private edges: GraphicalEdge[] = [
    GraphicalEdge.from(this.vertices[0], this.vertices[1], 5, true),
    GraphicalEdge.from(this.vertices[0], this.vertices[2], 3, false),
    GraphicalEdge.from(this.vertices[2], this.vertices[5], 5, false),
    GraphicalEdge.from(this.vertices[3], this.vertices[5], 3, false),
    GraphicalEdge.from(this.vertices[3], this.vertices[2], 2, false),
    GraphicalEdge.from(this.vertices[1], this.vertices[4], 1, true),
    GraphicalEdge.from(this.vertices[3], this.vertices[4], 8, false),
    GraphicalEdge.from(this.vertices[5], this.vertices[6], 2, false),
    GraphicalEdge.from(this.vertices[7], this.vertices[2], 4, true),
  ];

  private constructor() {
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
      }
    );
  }

  /**
   * Increases the number of vertices in the graph by 1.
   * TODO: currently unanimated. Does this need an animation?
   */
  addVertex(): AnimationProducer {
    this.vertices = [...this.vertices, GraphicalVertex.from(this.vertices.length)];

    // Reload the graph to sync the change in `this.edges` with what's shown
    // in the visualiser canvas.
    this.loadGraph();
    return new GraphAnimationProducer();
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
      GraphicalEdge.from(this.vertices[from], this.vertices[to], 5, false),
    ];

    // Reload the graph to sync the change in `this.edges` with what's shown
    // in the visualiser canvas.
    this.loadGraph();
    return new GraphAnimationProducer();
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
    const vertexElem = this.vertices[src].getReference();
    animationProducer.doAnimationAndHighlight(2, animationProducer.highlightVertex, vertexElem);

    // For each unvisited neighbour, highlight the edge to that neighbour and
    // launch DFS on them.
    for (let neighbour = 0; neighbour < this.vertices.length; neighbour += 1) {
      if (this.isAdjacent(src, neighbour) && !visited.has(neighbour)) {
        // TODO: this is disgusting. Clean up.
        const targetEdge = this.edges.find(
          (edge) =>
            (parseInt(edge.source.id, 10) === src && parseInt(edge.target.id, 10) === neighbour) ||
            (parseInt(edge.source.id, 10) === neighbour &&
              parseInt(edge.target.id, 10) === src &&
              edge.isBidirectional)
        );
        if (!targetEdge) {
          throw new Error(
            `Expected an edge to exist between vertices '${src}' and '${neighbour}'.`
          );
        }
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.highlightEdge,
          targetEdge.getReference()
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
        (edge.source.id === String(v) && edge.target.id === String(w)) ||
        (edge.source.id === String(w) && edge.target.id === String(v) && edge.isBidirectional)
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
}
