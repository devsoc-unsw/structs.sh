import BSTAnimationProducer from './BSTAnimationProducer';
import { Node } from '../util/typedefs';
import { nodeStyle, nodeWidth, textStyle, lineStyle, markerLength } from '../util/settings';
import { getPointerStartEndCoordinates } from '../util/util';

export default class BSTInsertAnimationProducer extends BSTAnimationProducer {
  public createNodeLeft(node: Node, parent: Node): void {
    this.createNode(node);

    this.addAnimation([
      parent.leftLineTarget.animate(400).attr({
        opacity: 1,
      }),
    ]);
  }

  public createNodeRight(node: Node, parent: Node): void {
    this.createNode(node);

    this.addAnimation([
      parent.rightLineTarget.animate(400).attr({
        opacity: 1,
      }),
    ]);
  }

  // draws a node on the draw canvas and shows the node
  public createNode(node: Node): void {
    // based on the depth of the node we are able to create left and right svg line targets
    const lineDiffX = BSTAnimationProducer.getLineDiffX(node);
    const lineDiffY = 75;
    const leftChildCoordinates = getPointerStartEndCoordinates(
      node.x,
      node.y,
      node.x - lineDiffX,
      node.y + lineDiffY
    );
    node.leftLineTarget = this.draw
      .line(
        leftChildCoordinates[0][0],
        leftChildCoordinates[0][1],
        leftChildCoordinates[1][0],
        leftChildCoordinates[1][1]
      )
      .attr(lineStyle);

    const rightChildCoordinates = getPointerStartEndCoordinates(
      node.x,
      node.y,
      node.x + lineDiffX,
      node.y + lineDiffY
    );
    node.rightLineTarget = this.draw
      .line(
        rightChildCoordinates[0][0],
        rightChildCoordinates[0][1],
        rightChildCoordinates[1][0],
        rightChildCoordinates[1][1]
      )
      .attr(lineStyle);

    // Draw a triangle at the end of the line
    const pathD = `M 0 0 L ${markerLength} ${markerLength / 2} L 0 ${markerLength} z`;

    node.leftLineTarget.marker('end', markerLength, markerLength, function (add) {
      add.path(pathD);
      this.attr('markerUnits', 'userSpaceOnUse');
    });

    node.rightLineTarget.marker('end', markerLength, markerLength, function (add) {
      add.path(pathD);
      this.attr('markerUnits', 'userSpaceOnUse');
    });

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
