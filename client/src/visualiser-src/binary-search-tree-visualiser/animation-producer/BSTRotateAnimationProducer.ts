import BSTAnimationProducer from './BSTAnimationProducer';
import { Node } from '../util/typedefs';

export default class BSTRotateAnimationProducer extends BSTAnimationProducer {
  public movePointerToNewRootRightChild(oldRoot: Node, newRoot: Node): void {
    this.animationSequence.push([
      oldRoot.leftLineTarget
        .animate(400)
        .plot([[oldRoot.x, oldRoot.y], [newRoot.right.x, newRoot.right.y]]),
    ]);
  }

  public movePointerToNewRootLeftChild(oldRoot: Node, newRoot: Node): void {
    this.animationSequence.push([
      oldRoot.rightLineTarget
        .animate(400)
        .plot([[oldRoot.x, oldRoot.y], [newRoot.left.x, newRoot.left.y]]),
    ]);
  }

  public moveRightPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.animationSequence.push([
      newRoot.rightLineTarget
        .animate(400)
        .plot([[newRoot.x, newRoot.y], [oldRoot.x, oldRoot.y]]),
    ]);
  }

  public moveLeftPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.animationSequence.push([
      newRoot.leftLineTarget
        .animate(400)
        .plot([[newRoot.x, newRoot.y], [oldRoot.x, oldRoot.y]]),
    ]);
  }

  // this method is only called when the newRoots right line target is not visible,
  // so hence we need to swap its line target with the old root's left line target
  public assignNewRootRightPointerToOldRootLeftPointer(oldRoot: Node, newRoot: Node): void {
    [newRoot.rightLineTarget, oldRoot.leftLineTarget] = [oldRoot.leftLineTarget, newRoot.rightLineTarget];

    // replot the line (swap x1 with x2 and y1 with y2) so when we move the pointer when calling updateBST
    // the line doesn't do a quick flip animation first
    newRoot.rightLineTarget.plot([[newRoot.x, newRoot.y], [oldRoot.x, oldRoot.y]]);
  }

  // this method is only called when the newRoots left line target is not visible,
  // so hence we need to swap its line target with the old root's right line target
  public assignNewRootLeftPointerToOldRootRightPointer(oldRoot: Node, newRoot: Node): void {
    [newRoot.leftLineTarget, oldRoot.rightLineTarget] = [oldRoot.rightLineTarget, newRoot.leftLineTarget];

    // replot the line (swap x1 with x2 and y1 with y2) so when we move the pointer when calling updateBST
    // the line doesn't do a quick flip animation first
    newRoot.leftLineTarget.plot([[newRoot.x, newRoot.y], [oldRoot.x, oldRoot.y]]);
  }
}
