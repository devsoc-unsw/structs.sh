import { Marker } from '@svgdotjs/svg.js';
import BSTAnimationProducer from './BSTAnimationProducer';
import { Node } from '../util/typedefs';
import { nodeStyle, textStyle, lineStyle } from '../util/settings';
import { markerLength, nodeDiameter, pathD } from '../../common/constants';
import { getPointerStartEndCoordinates } from '../../common/helpers';
import { insertCodeSnippet } from '../util/codeSnippets';

export default class BSTInsertAnimationProducer extends BSTAnimationProducer {
  public renderInsertCode(): void {
    this.renderCode(insertCodeSnippet);
  }

  public createNodeLeft(node: Node, parent: Node): void {
    this.createNode(node);

    this.addSequenceAnimation(
      parent.leftLineTarget.animate(400).attr({
        opacity: 1,
      })
    );
  }

  public createNodeRight(node: Node, parent: Node): void {
    this.createNode(node);

    this.addSequenceAnimation(
      parent.rightLineTarget.animate(400).attr({
        opacity: 1,
      })
    );
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
    node.leftLineTarget = this.visualiserCanvas
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
    node.rightLineTarget = this.visualiserCanvas
      .line(
        rightChildCoordinates[0][0],
        rightChildCoordinates[0][1],
        rightChildCoordinates[1][0],
        rightChildCoordinates[1][1]
      )
      .attr(lineStyle);

    // Draw a triangle at the end of the line

    node.leftArrowTarget = this.visualiserCanvas
      .marker(markerLength, markerLength, (add: Marker) => {
        add.path(pathD);
      })
      .attr('markerUnits', 'userSpaceOnUse');

    node.leftLineTarget.marker('end', node.leftArrowTarget);

    node.rightArrowTarget = this.visualiserCanvas
      .marker(markerLength, markerLength, (add: Marker) => {
        add.path(pathD);
      })
      .attr('markerUnits', 'userSpaceOnUse');

    node.rightLineTarget.marker('end', node.rightArrowTarget);

    node.nodeTarget = this.visualiserCanvas.circle(nodeDiameter);
    node.nodeTarget.attr(nodeStyle);
    node.nodeTarget.cx(node.x).cy(node.y);

    node.textTarget = this.visualiserCanvas.text(node.value.toString());
    node.textTarget.attr(textStyle);
    node.textTarget.cx(node.x).cy(node.y);

    this.addSequenceAnimation(
      node.nodeTarget.animate(400).attr({
        opacity: 1,
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(400).attr({
        opacity: 1,
      })
    );
  }
}
