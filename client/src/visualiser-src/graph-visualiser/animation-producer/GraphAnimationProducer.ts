import AnimationProducer from '@/visualiser-src/common/AnimationProducer';
import { Path } from '@svgdotjs/svg.js';
import GraphicalGraphNode from '../data-structure/GraphicalGraphNode';
import { Point, getEdgePath } from '../util/util';
import { NODE_FILL, EDGE_STROKE } from '../util/constants';

// Base class for SVG.Runners animating graph operations.
// Shared node/edge animations (layout, fade, highlight) live here.
export default class GraphAnimationProducer extends AnimationProducer {
  /**
   * highlightNode queues an animated fill change on the node's circle.
   * @param node -- the node to recolour
   * @param colour -- the new fill colour
   */
  public highlightNode(node: GraphicalGraphNode, colour: string): void {
    this.addSequenceAnimation(node.boxTarget.animate().attr({ fill: colour }));
  }

  /**
   * applyLayout: moves every vertex to its spot on the circle.
   * @param nodes -- the nodes to layout
   * @param positions -- hashmap of vertex index to specified position (x, y)
   */
  public applyLayout(nodes: GraphicalGraphNode[], positions: Map<number, Point>): void {
    nodes.forEach((node) => {
      const targetPosition = positions.get(node.index)!;
      if (node.placed === false) {
        // Move centres to specified position for both circle and label instantly
        // Queue opacity immediately 0 to 1 on both
        node.boxTarget.center(targetPosition.x, targetPosition.y);
        node.numberTarget.center(targetPosition.x, targetPosition.y);
        this.addSequenceAnimation(node.boxTarget.animate().attr({ opacity: 1 }));
        this.addSequenceAnimation(node.numberTarget.animate().attr({ opacity: 1 }));
        node.placed = true;
      } else {
        // Otherwise queue animated center(x, y) glides on both
        this.addSequenceAnimation(
          node.boxTarget.animate().center(targetPosition.x, targetPosition.y)
        );
        this.addSequenceAnimation(
          node.numberTarget.animate().center(targetPosition.x, targetPosition.y)
        );
      }
    });
  }

  /**
   * drawEdge: set the path's shape instantly, since it's invisible anyway, then queue opacity 0 to 1
   * @param edge -- SVG drawing of the edge
   * @param from -- Coordinates of the centre of the start node
   * @param to -- Coordinates of the centre of the end node
   */
  public drawEdge(edge: Path, from: Point, to: Point): void {
    // getEdgePath works out the shape string for the invisible edge, which we use to plot the path
    edge.plot(getEdgePath(from, to));
    this.addSequenceAnimation(edge.animate().attr({ opacity: 1 }));
  }

  /**
   * fadeOutNode: queue opacity 1 to 0 on circle and label
   * @param node -- the node to fade out
   */
  public fadeOutNode(node: GraphicalGraphNode): void {
    // Fade the circle to invisible and the number (label) to invisible
    this.addSequenceAnimation(node.boxTarget.animate().attr({ opacity: 0 }));
    this.addSequenceAnimation(node.numberTarget.animate().attr({ opacity: 0 }));
  }

  /**
   * fadeOutEdges: queue opacity 1 to 0 on each, all in the same group so they fade together
   * @param edges -- array of SVG drawings of the edges
   */
  public fadeOutEdges(edges: Path[]): void {
    edges.forEach((edge) => {
      this.addSequenceAnimation(edge.animate().attr({ opacity: 0 }));
    });
  }

  /**
   * resetColours: queue every circle back to NODE_FILL and every edge back to EDGE_STROKE, in one group
   * @param nodes -- array of nodes
   * @param edges -- array of SVG drawings of the edges
   */
  public resetColours(nodes: GraphicalGraphNode[], edges: Path[]): void {
    nodes.forEach((node) => {
      this.addSequenceAnimation(node.boxTarget.animate().attr({ fill: NODE_FILL }));
    });

    edges.forEach((edge) => {
      this.addSequenceAnimation(edge.animate().attr({ stroke: EDGE_STROKE }));
    });
  }
}
