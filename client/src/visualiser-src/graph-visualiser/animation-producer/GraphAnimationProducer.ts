import AnimationProducer from '@/visualiser-src/common/AnimationProducer';
import GraphicalGraphNode from '../data-structure/GraphicalGraphNode';

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
}
