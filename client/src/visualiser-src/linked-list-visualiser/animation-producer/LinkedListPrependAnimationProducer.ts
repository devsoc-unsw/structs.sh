import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import { CANVAS, insertedNodeTopOffset, UP_ARROW_PATH } from '../util/constants';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';

// Class that produces SVG.Runners animating linked list operations specific to prepending
export default class LinkedListPrependAnimationProducer extends LinkedListAnimationProducer {
  public createNode(newNode: GraphicalLinkedListNode) {
    newNode.nodeTarget.addTo(CANVAS);
    newNode.nodeTarget.move(0, insertedNodeTopOffset);
    this.addAnimation([newNode.nodeTarget.animate().attr({ opacity: 1 })]);
  }

  public newHeadPointToOldHead(newHead: GraphicalLinkedListNode) {
    newHead.pointerTarget.plot(UP_ARROW_PATH as any);
    this.addAnimation([newHead.pointerTarget.animate().attr({ opacity: 1 })]);
  }
}
