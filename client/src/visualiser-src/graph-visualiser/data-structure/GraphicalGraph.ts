import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import {
  MAX_EDGES_FACTOR,
  MAX_RANDOM_VERTICES,
  MIN_RANDOM_VERTICES,
} from 'visualiser-src/common/constants';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { injectIds } from 'visualiser-src/common/helpers';
import {
  getRandomElemInArray,
  getRandomIntInRange,
} from 'visualiser-src/common/RandomNumGenerator';
import { Documentation } from 'visualiser-src/common/typedefs';
import GraphAnimationProducer from '../animation-producer/GraphAnimationProducer';
import GraphDfsAnimationProducer from '../animation-producer/GraphDfsAnimationProducer';
import { renderForceGraph } from '../util/util';
import { GraphicalEdge } from './GraphicalEdge';
import { GraphicalVertex } from './GraphicalVertex';

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

  private _vertices: GraphicalVertex[];

  private _edges: GraphicalEdge[];

  public constructor() {
    super();

    // Randomly set the number of vertices and the connections between those
    // vertices prior to first render.
    this.randomlyAssignVertices();
    this.randomlyAssignEdges();

    this.loadGraph();
  }

  /**
   * Randomly generates the number of vertices in this graph.
   */
  private randomlyAssignVertices() {
    const numVertices = getRandomIntInRange(MIN_RANDOM_VERTICES, MAX_RANDOM_VERTICES);
    const vertexIds = [...Array(numVertices)].map((_, i) => i);
    this._vertices = vertexIds.map((id) => GraphicalVertex.from(id));
  }

  /**
   * Randomly generates between N to 1.5 * N edges to be added to this graph.
   * Note that we want to avoid generating extremely dense graphs as this would
   * likely cause intersection of edges, which is ugly.
   *
   * Must be called after the vertices have been generated, else this would have
   * no effect.
   *
   * There are many ways to generate 'random graphs'. The approach used here is
   * a simple random walk on the set of vertices until a desired number of edges
   * has been reached.
   */
  private randomlyAssignEdges() {
    if (!this._vertices) throw new Error('Expected vertices to be defined for this graph.');
    const numVertices = this._vertices.length;

    this._edges = [];
    const encountered: { [id: string]: number } = {};
    const maxEdges = MAX_EDGES_FACTOR * numVertices;
    let currVertex = this._vertices[0];
    let edgeCount = 0;

    encountered[currVertex.id] = 0;
    while (Object.keys(encountered).length < numVertices && edgeCount < maxEdges) {
      const nextVertex = getRandomElemInArray(
        this._vertices.filter((v) => !(v.id in encountered) || encountered[v.id] <= 3)
      );
      if (nextVertex !== currVertex && !this.getEdge(currVertex.id, nextVertex.id, true)) {
        if (encountered[nextVertex.id]) {
          encountered[nextVertex.id] += 1;
        } else {
          encountered[nextVertex.id] = 1;
        }

        this._edges.push(GraphicalEdge.from(currVertex, nextVertex, 5, Math.random() > 0.5));
        encountered[currVertex.id] += 1;
        currVertex = nextVertex;
        edgeCount += 1;
      }
    }
  }

  /**
   * Renders or re-renders the graph SVG elements into the visualiser canvas.
   * Must be called after the vertices and edges have been populated.
   */
  private loadGraph() {
    renderForceGraph(
      { vertices: this._vertices, edges: this._edges },
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
    this._vertices = [...this._vertices, GraphicalVertex.from(this._vertices.length)];

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
    this._edges = [
      ...this._edges,
      GraphicalEdge.from(this._vertices[from], this._vertices[to], 5, false),
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
    const vertexElem = this._vertices[src].getReference();
    animationProducer.doAnimationAndHighlight(2, animationProducer.highlightVertex, vertexElem);

    // For each unvisited neighbour, highlight the edge to that neighbour and
    // launch DFS on them.
    for (let neighbour = 0; neighbour < this._vertices.length; neighbour += 1) {
      if (this.isAdjacent(src, neighbour) && !visited.has(neighbour)) {
        const targetEdge = this.getEdge(src, neighbour);
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
    return this._edges.some(
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

  private getEdge(src: number | string, dest: number | string, ignoreDirection: boolean = false) {
    const matchSrc = typeof src === 'string' ? parseInt(src, 10) : src;
    const matchDest = typeof dest === 'string' ? parseInt(dest, 10) : dest;

    const targetEdge = this._edges.find((edge) => {
      const edgeSrc = parseInt(edge.source.id, 10);
      const edgeDest = parseInt(edge.target.id, 10);
      return (
        (edgeSrc === matchSrc && edgeDest === matchDest) ||
        (edgeSrc === matchDest &&
          edgeDest === matchSrc &&
          (edge.isBidirectional || ignoreDirection))
      );
    });

    return targetEdge;
  }
}
