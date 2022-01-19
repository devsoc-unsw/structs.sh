import BSTAnimationProducer from './BSTAnimationProducer';
import { Node } from '../util/typedefs';

export default class BSTRotateAnimationProducer extends BSTAnimationProducer {
    public movePointerToNewRootRightChild(oldRoot: Node): void {
        this.animationSequence.push([
            oldRoot.leftLineTarget
            .animate(400)
            .plot([[oldRoot.x, oldRoot.y], [oldRoot.left.x, oldRoot.left.y]])
        ])
    }

    public movePointerToOldRoot(newRoot: Node): void {
        this.animationSequence.push([
            newRoot.rightLineTarget
            .animate(400)
            .plot([[newRoot.x, newRoot.y], [newRoot.right.x, newRoot.right.y]])
        ])
    }
};