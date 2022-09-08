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

  dfs(src: number): AnimationProducer {
    /*
    // now increment the length of the list by 1
    this.length += 1;
    const producer = new LinkedListAppendAnimationProducer();
    producer.renderAppendCode();

    // Create new node
    const newNode = GraphicalLinkedListNode.from(input);
    producer.doAnimationAndHighlight(2, producer.addNodeAtEnd, newNode, this.length);

    // Account for case when list is empty
    if (this.head === null) {
      this.head = newNode;
      producer.doAnimationAndHighlight(4, producer.initialiseHead, this.headPointer);
      producer.doAnimationAndHighlight(5, producer.resetPointersAndColor, this.head);

      return producer;
    }

    // Initialise curr
    let curr: GraphicalLinkedListNode = this.head;
    producer.doAnimationAndHighlight(8, producer.initialisePointer, CURRENT);

    // Traverse to last node
    while (curr.next !== null) {
      curr = curr.next;
      producer.doAnimationAndHighlight(10, producer.movePointerToNext, CURRENT);
    }

    // Link last node to new node
    curr.next = newNode;
    producer.doAnimationAndHighlight(13, producer.linkLastToNew, curr);

    producer.doAnimation(producer.resetPointersAndColor, curr.next);
    return producer;
    */
    return new GraphDfsAnimationProducer();
  }

  public generate(): void {
    // TODO: IMPLEMENT ME
  }

  public reset(): void {
    SVG(VISUALISER_CANVAS).clear();

    // Reset state.
    // TODO: IMPLEMENT ME
  }

  public get documentation() {
    return GraphicalGraph.documentation;
  }
}
