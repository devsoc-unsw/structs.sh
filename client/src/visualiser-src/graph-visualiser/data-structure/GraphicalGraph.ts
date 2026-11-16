import { SVG, Svg, Path } from '@svgdotjs/svg.js';
import AnimationProducer from '@/visualiser-src/common/AnimationProducer';
import GraphicalDataStructure from '@/visualiser-src/common/GraphicalDataStructure';
import { VISUALISER_CANVAS } from '@/visualiser-src/common/constants';
import { injectIds } from '@/visualiser-src/common/helpers';
import { Documentation } from '@/visualiser-src/common/typedefs';
import Graph from './Graph';
import GraphicalGraphNode from './GraphicalGraphNode';
import GraphAnimationProducer from '../animation-producer/GraphAnimationProducer';
import GraphInsertAnimationProducer from '../animation-producer/GraphInsertAnimationProducer';
import GraphDeleteAnimationProducer from '../animation-producer/GraphDeleteAnimationProducer';
import GraphAddEdgeAnimationProducer from '../animation-producer/GraphAddEdgeAnimationProducer';
import { Point, circularPositions } from '../util/util';
import { DELETE_COLOUR, EDGE_STROKE, INSERT_COLOUR, pathAttributes } from '../util/constants';
import GraphDeleteEdgeAnimationProducer from '../animation-producer/GraphDeleteEdgeAnimationProducer';

/**
 * The graph the app talks to.
 * Each operation asks the Graph model if it's allowed, then records the animations for it.
 */
export default class GraphicalGraph extends GraphicalDataStructure {
  /** The text shown in the operations panel. Keys must match the method names below. */
  private static documentation: Documentation = injectIds({
    insert: {
      args: ['vertex'],
      description: 'Insert a vertex with the given number.',
    },
    delete: {
      args: ['vertex'],
      description: 'Delete a vertex and every edge touching it.',
    },
    addEdge: {
      args: ['nodeA', 'nodeB'],
      description: 'Add an edge between two vertices.',
    },
    deleteEdge: {
      args: ['nodeA', 'nodeB'],
      description: 'Delete the edge between two vertices.',
    },
  });

  /** The data and the rules. No SVG in here. */
  private model = new Graph();

  /** Vertex number to its SVG drawing. */
  private svgNodes = new Map<number, GraphicalGraphNode>();

  /** "min-max" edge key to its SVG drawing. */
  private svgEdges = new Map<string, Path>();

  /** Vertex number to where it sits on the circle right now. */
  private positions = new Map<number, Point>();

  /** The SVG layer every vertex and edge is drawn into. Its (0, 0) is the canvas middle. */
  private graphLayer: Svg;

  /**
   * Clears the canvas and makes the layer the graph is drawn into.
   */
  public constructor() {
    super();
    // a nested <svg> at 50%, 50% puts (0, 0) in the middle of the canvas,
    // and the browser keeps it there when the window resizes.
    // overflow visible, otherwise everything outside its 0x0 box gets clipped
    const canvas = SVG(VISUALISER_CANVAS) as Svg;
    this.graphLayer = canvas.nested().attr({ x: '50%', y: '50%', overflow: 'visible' });
  }

  public get documentation(): Documentation {
    return GraphicalGraph.documentation;
  }

  /**
   * Gives the one key an undirected edge is stored under, so (1, 0) and (0, 1) match.
   * @param a -- one end of the edge
   * @param b -- the other end of the edge
   * @returns the key, as "min-max"
   */
  private edgeKey(a: number, b: number): string {
    const smaller = Math.min(a, b);
    const larger = Math.max(a, b);
    return `${smaller}-${larger}`;
  }

  /**
   * Looks up where a vertex sits on the circle.
   * @param vertex -- the vertex number
   * @returns the vertex's position
   * @throws Error if the vertex has no position yet
   */
  private point(vertex: number): Point {
    const position = this.positions.get(vertex);
    if (position === undefined) {
      throw new Error(`No position for vertex ${vertex}`);
    }
    return position;
  }

  /**
   * Looks up the SVG drawing of a vertex.
   * @param vertex -- the vertex number
   * @returns the vertex's drawing
   * @throws Error if the vertex has no drawing
   */
  private nodeAt(vertex: number): GraphicalGraphNode {
    const node = this.svgNodes.get(vertex);
    if (node === undefined) {
      throw new Error(`No drawing for vertex ${vertex}`);
    }
    return node;
  }

  /**
   * Looks up the SVG drawing of an edge.
   * @param a -- one end of the edge
   * @param b -- the other end of the edge
   * @returns the edge's drawing
   * @throws Error if the edge has no drawing
   */
  private edgeBetween(a: number, b: number): Path {
    const edge = this.svgEdges.get(this.edgeKey(a, b));
    if (edge === undefined) {
      throw new Error(`No drawing for edge ${a}-${b}`);
    }
    return edge;
  }

  /**
   * Re-spaces the vertices on the circle and slides every edge to follow them.
   * Vertices and edges move together in one animation step.
   * @param producer -- the producer to queue the animations on
   * @param line -- the code line to highlight
   * @returns nothing
   */
  private relayout(producer: GraphAnimationProducer, line: number): void {
    this.positions = circularPositions(this.model.vertices);

    producer.highlightCode(line);
    producer.applyLayout(Array.from(this.svgNodes.values()), this.positions);
    this.model.edges.forEach(([a, b]) => {
      producer.moveEdge(this.edgeBetween(a, b), this.point(a), this.point(b));
    });
    producer.finishSequence();
  }

  /**
   * Inserts a vertex, then re-spaces the circle.
   * @param vertex -- the vertex number
   * @returns the animations. Empty if the vertex already exists.
   */
  public insert(vertex: number): AnimationProducer {
    const producer = new GraphInsertAnimationProducer();
    producer.renderInsertCode();

    // already there, so nothing to animate
    if (!this.model.insert(vertex)) return producer;

    // overwrite any old entry, a deleted vertex's circle must never come back
    const newNode = GraphicalGraphNode.from(vertex, this.graphLayer);
    this.svgNodes.set(vertex, newNode);

    this.relayout(producer, 3);
    producer.doAnimation(producer.highlightNode, newNode, INSERT_COLOUR);
    producer.doAnimationWithoutTimestamp(
      producer.resetColours,
      Array.from(this.svgNodes.values()),
      Array.from(this.svgEdges.values())
    );
    return producer;
  }

  /**
   * Deletes a vertex and every edge touching it, then re-spaces the circle.
   * @param vertex -- the vertex number
   * @returns the animations. Empty if the vertex doesn't exist.
   */
  public delete(vertex: number): AnimationProducer {
    const producer = new GraphDeleteAnimationProducer();
    producer.renderDeleteCode();

    if (!this.model.has(vertex)) return producer;

    // grab the edges now, the model forgets them once the vertex is deleted
    const node = this.nodeAt(vertex);
    const edgesToFade: Path[] = [];
    const edgeKeysToForget: string[] = [];
    this.model.neighbours(vertex).forEach((neighbour) => {
      edgesToFade.push(this.edgeBetween(vertex, neighbour));
      edgeKeysToForget.push(this.edgeKey(vertex, neighbour));
    });

    // queue the animations first, nothing plays until the whole list is built
    producer.doAnimationAndHighlight(2, producer.highlightNode, node, DELETE_COLOUR);
    if (edgesToFade.length > 0) {
      producer.doAnimationAndHighlight(3, producer.fadeOutEdges, edgesToFade);
    }
    producer.doAnimationAndHighlight(5, producer.fadeOutNode, node);

    // now change the data. The faded drawings stay on the canvas for stepping backwards
    this.model.delete(vertex);
    this.svgNodes.delete(vertex);
    edgeKeysToForget.forEach((key) => this.svgEdges.delete(key));

    this.relayout(producer, 7);
    return producer;
  }

  /**
   * Adds an edge between two vertices.
   * @param nodeA -- one end of the edge
   * @param nodeB -- the other end of the edge
   * @returns the animations. Empty if it's a self-loop, a duplicate or a vertex is missing.
   */
  public addEdge(nodeA: number, nodeB: number): AnimationProducer {
    const producer = new GraphAddEdgeAnimationProducer();
    producer.renderAddEdgeCode();

    if (!this.model.addEdge(nodeA, nodeB)) return producer;

    // starts invisible (pathAttributes), drawEdge fades it in
    const edge = this.graphLayer.path().attr({ ...pathAttributes, stroke: EDGE_STROKE });
    this.svgEdges.set(this.edgeKey(nodeA, nodeB), edge);

    // no relayout, the vertex count hasn't changed
    producer.doAnimationAndHighlight(
      3,
      producer.drawEdge,
      edge,
      this.point(nodeA),
      this.point(nodeB)
    );
    return producer;
  }

  /**
   * Deletes the edge between two vertices.
   * @param nodeA -- one end of the edge
   * @param nodeB -- the other end of the edge
   * @returns the animations. Empty if the edge or a vertex doesn't exist.
   */
  public deleteEdge(nodeA: number, nodeB: number): AnimationProducer {
    const producer = new GraphDeleteEdgeAnimationProducer();
    producer.renderDeleteEdgeCode();

    if (!this.model.deleteEdge(nodeA, nodeB)) return producer;

    const edge = this.edgeBetween(nodeA, nodeB);
    producer.doAnimationAndHighlight(2, producer.highlightEdge, edge, DELETE_COLOUR);
    producer.doAnimationAndHighlight(3, producer.fadeOutEdges, [edge]);

    // the faded drawing stays on the canvas for stepping backwards
    // no relayout, the vertex count hasn't changed
    this.svgEdges.delete(this.edgeKey(nodeA, nodeB));
    return producer;
  }

  /**
   * Builds the starting graph for Create New: a square on vertices 0 to 3.
   * @returns nothing
   */
  public generate(): void {
    for (let vertex = 0; vertex < 4; vertex += 1) {
      this.insert(vertex);
    }
    for (let vertex = 0; vertex < 4; vertex += 1) {
      this.addEdge(vertex, (vertex + 1) % 4);
    }
  }
}
