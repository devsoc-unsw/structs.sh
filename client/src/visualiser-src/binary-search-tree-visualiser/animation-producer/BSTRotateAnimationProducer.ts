import { Line } from '@svgdotjs/svg.js';
import BSTAnimationProducer from './BSTAnimationProducer';
import { Node } from '../util/typedefs';
import { getPointerStartEndCoordinates } from '../util/util';

export default class BSTRotateAnimationProducer extends BSTAnimationProducer {
  public movePointerToNewRootRightChild(oldRoot: Node, newRoot: Node): void {
    this.addSingleAnimation(
      oldRoot.leftLineTarget
        .animate(400)
        .plot(
          getPointerStartEndCoordinates(oldRoot.x, oldRoot.y, newRoot.right.x, newRoot.right.y)
        ),
    );
  }

  public movePointerToNewRootLeftChild(oldRoot: Node, newRoot: Node): void {
    this.addSingleAnimation(
      oldRoot.rightLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(oldRoot.x, oldRoot.y, newRoot.left.x, newRoot.left.y)),
    );
  }

  public moveRightPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.addSingleAnimation(
      newRoot.rightLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y)),
    );
  }

  public moveLeftPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.addSingleAnimation(
      newRoot.leftLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y)),
    );
  }

  public hideLine(line: Line): void {
    this.addSingleAnimation(
      line.animate(500).attr({
        opacity: 0,
      })
    )
  } 

  public showLine(line: Line): void {
    this.addSingleAnimation(
      line.animate(500).attr({
        opacity: 1,
      })
    )
  }

  public assignNewRootRightPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.hideLine(oldRoot.leftLineTarget);

    newRoot.rightLineTarget.plot(
      getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y)
    );

    this.showLine(newRoot.rightLineTarget);
  }

  public assignNewRootLeftPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.hideLine(oldRoot.rightLineTarget);

    newRoot.leftLineTarget.plot(
      getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y)
    );

    this.showLine(newRoot.leftLineTarget);
  }
}
