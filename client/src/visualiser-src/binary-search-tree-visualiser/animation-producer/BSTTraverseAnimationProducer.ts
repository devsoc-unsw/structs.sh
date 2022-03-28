import { Line } from '@svgdotjs/svg.js';
import BSTAnimationProducer from './BSTAnimationProducer';
import { Node } from '../util/typedefs';
import {
  nodeStyle, nodeWidth, textStyle, lineStyle,
} from '../util/settings';

export default class BSTTraverseAnimationProducer extends BSTAnimationProducer {
  public highlightNode(node: Node): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        fill: '#4beb9b',
        stroke: '#4beb9b',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#ffffff',
      })
    );
  }
}
