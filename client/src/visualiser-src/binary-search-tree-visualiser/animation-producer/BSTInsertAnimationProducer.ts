import BSTAnimationProducer from './BSTAnimationProducer';
import GraphicalBSTNode from '../data-structure/GraphicalBSTNode';
import { lineDiffY } from '../util/settings';
import { getPointerStartEndCoordinates } from '../../common/helpers';
import { insertCodeSnippet } from '../util/codeSnippets';

export default class BSTInsertAnimationProducer extends BSTAnimationProducer {
  public renderInsertCode(): void {
    this.renderCode(insertCodeSnippet);
  }

  public createNodeLeft(node: GraphicalBSTNode, parent: GraphicalBSTNode): void {
    this.createNode(node);

    this.addSequenceAnimation(
      parent.leftLineTarget.animate(400).attr({
        opacity: 1,
      })
    );
  }

  public createNodeRight(node: GraphicalBSTNode, parent: GraphicalBSTNode): void {
    this.createNode(node);

    this.addSequenceAnimation(
      parent.rightLineTarget.animate(400).attr({
        opacity: 1,
      })
    );
  }

  // draws a node on the draw canvas and shows the node
  public createNode(node: GraphicalBSTNode, highlight: boolean = false): void {
    // based on the depth of the node we are able to create left and right svg line targets
    const lineDiffX = BSTAnimationProducer.getLineDiffX(node);
    const leftChildCoordinates = getPointerStartEndCoordinates(
      node.x,
      node.y,
      node.x - lineDiffX,
      node.y + lineDiffY
    );
    node.leftLineTarget.plot(
      leftChildCoordinates[0][0],
      leftChildCoordinates[0][1],
      leftChildCoordinates[1][0],
      leftChildCoordinates[1][1]
    );

    const rightChildCoordinates = getPointerStartEndCoordinates(
      node.x,
      node.y,
      node.x + lineDiffX,
      node.y + lineDiffY
    );
    node.rightLineTarget.plot(
      rightChildCoordinates[0][0],
      rightChildCoordinates[0][1],
      rightChildCoordinates[1][0],
      rightChildCoordinates[1][1]
    );
    node.nodeTarget.cx(node.x).cy(node.y);
    node.textTarget.cx(node.x).cy(node.y);

    if (highlight) {
      this.addSequenceAnimation(
        node.nodeTarget.animate(400).attr({
          opacity: 1,
          fill: '#39AF8E',
          stroke: '#39AF8E',
        })
      );

      this.addSequenceAnimation(
        node.textTarget.animate(400).attr({
          opacity: 1,
          fill: '#ffffff',
        })
      );
    } else {
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
}
