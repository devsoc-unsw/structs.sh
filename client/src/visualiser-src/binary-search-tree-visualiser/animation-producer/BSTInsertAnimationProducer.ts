import BSTAnimationProducer from './BSTAnimationProducer';
import { Node } from '../util/typedefs';
import { nodeStyle, nodeWidth, textStyle, lineStyle } from '../util/settings';

export default class BSTInsertAnimationProducer extends BSTAnimationProducer {
  public createNodeLeft(node: Node, parent: Node): void {
    this.addAnimation([
      parent.leftLineTarget.animate(400).attr({
        opacity: 1,
      }),
    ]);

    this.createNode(node);
  }

  public createNodeRight(node: Node, parent: Node): void {
    this.addAnimation([
      parent.rightLineTarget.animate(400).attr({
        opacity: 1,
      }),
    ]);

    this.createNode(node);
  }

  // draws a node on the draw canvas and shows the node
  public createNode(node: Node): void {
    // based on the depth of the node we are able to create left and right svg line targets
    const lineDiffX = BSTAnimationProducer.getLineDiffX(node);
    const lineDiffY = 75;

    node.leftLineTarget = this.draw
      .line(node.x, node.y, node.x - lineDiffX, node.y + lineDiffY)
      .attr(lineStyle);

    node.rightLineTarget = this.draw
      .line(node.x, node.y, node.x + lineDiffX, node.y + lineDiffY)
      .attr(lineStyle);

    node.leftLineTarget.back();
    node.rightLineTarget.back();

    node.nodeTarget = this.draw.circle(nodeWidth);
    node.nodeTarget.attr(nodeStyle);
    node.nodeTarget.cx(node.x).cy(node.y);

    node.textTarget = this.draw.text(node.value.toString());
    node.textTarget.attr(textStyle);
    node.textTarget.cx(node.x).cy(node.y);

    this.addAnimation([
      node.nodeTarget.animate(400).attr({
        opacity: 1,
      }),
      node.textTarget.animate(400).attr({
        opacity: 1,
      }),
    ]);
  }
}
