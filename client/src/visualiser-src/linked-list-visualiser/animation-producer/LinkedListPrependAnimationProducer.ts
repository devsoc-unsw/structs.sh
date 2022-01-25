import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import { CANVAS, insertedNodeTopOffset, UP_ARROW_PATH } from '../util/constants';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';

export default class LinkedListPrependAnimationProducer extends LinkedListAnimationProducer {
  public createNode(newNode: GraphicalLinkedListNode) {
    newNode.nodeTarget.addTo(CANVAS);
    newNode.nodeTarget.move(0, insertedNodeTopOffset);
    this.allRunners.push([newNode.nodeTarget.animate().attr({ opacity: 1 })]);
  }

  public newHeadPointToOldHead(newHead: GraphicalLinkedListNode) {
    newHead.pointerTarget.plot(UP_ARROW_PATH as any);
    this.allRunners.push([newHead.pointerTarget.animate().attr({ opacity: 1 })]);
  }
}
