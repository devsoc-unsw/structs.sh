import { Line } from '@svgdotjs/svg.js';
import BSTAnimationProducer from './BSTAnimationProducer';
import { Node } from '../util/typedefs';
import {
  nodeStyle, nodeWidth, textStyle, lineStyle,
} from '../util/settings';

export default class BSTTraverseAnimationProducer extends BSTAnimationProducer {
  public halfHighlightNode(node: Node): void {
    this.addAnimation([
      node.nodeTarget.animate(500).attr({
        stroke: '#4beb9b',
      }),
      node.textTarget.animate(500).attr({
        fill: '#4beb9b',
      }),
    ]);
  }

  public highlightNode(node: Node): void {
    this.addAnimation([
      node.nodeTarget.animate(500).attr({
        fill: '#4beb9b',
        stroke: '#4beb9b',
      }),
      node.textTarget.animate(500).attr({
        fill: '#ffffff',
      }),
    ]);
  }

  public highlightLine(lineTarget: Line): void {
    if (lineTarget != null) {
      this.addAnimation([
        lineTarget.animate(500).attr({
          stroke: '#4beb9b',
        }),
      ]);
    }
  }
}
