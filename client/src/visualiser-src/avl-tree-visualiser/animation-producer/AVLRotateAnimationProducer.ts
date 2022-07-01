import { Line } from '@svgdotjs/svg.js';
import AVLAnimationProducer from './AVLAnimationProducer';
import { Node } from '../util/typedefs';
import { getPointerStartEndCoordinates } from '../../common/helpers';
import { rotateLeftCodeSnippet, rotateRightCodeSnippet } from '../util/codeSnippets';

export default class AVLRotateAnimationProducer extends AVLAnimationProducer {
  public renderRotateLeftCode(): void {
    this.renderCode(rotateLeftCodeSnippet);
  }

  public renderRotateRightCode(): void {
    this.renderCode(rotateRightCodeSnippet);
  }

  public movePointerToNewRootRightChild(oldRoot: Node, newRoot: Node): void {
    this.addSequenceAnimation(
      oldRoot.leftLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(oldRoot.x, oldRoot.y, newRoot.right.x, newRoot.right.y))
    );
  }

  public movePointerToNewRootLeftChild(oldRoot: Node, newRoot: Node): void {
    this.addSequenceAnimation(
      oldRoot.rightLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(oldRoot.x, oldRoot.y, newRoot.left.x, newRoot.left.y))
    );
  }

  public moveRightPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.addSequenceAnimation(
      newRoot.rightLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y))
    );
  }

  public moveLeftPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.addSequenceAnimation(
      newRoot.leftLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y))
    );
  }

  public hideLine(line: Line): void {
    this.addSequenceAnimation(
      line.animate(400).attr({
        opacity: 0,
      })
    );
  }

  public showLine(line: Line): void {
    this.addSequenceAnimation(
      line.animate(400).attr({
        opacity: 1,
      })
    );
  }

  public assignNewRootRightPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    newRoot.rightLineTarget.plot(
      getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y)
    );

    this.showLine(newRoot.rightLineTarget);
  }

  public assignNewRootLeftPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    newRoot.leftLineTarget.plot(
      getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y)
    );

    this.showLine(newRoot.leftLineTarget);
  }
}
