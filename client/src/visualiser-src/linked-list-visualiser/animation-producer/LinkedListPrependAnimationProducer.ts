import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import { CANVAS, insertedNodeTopOffset } from '../util/constants';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { getPointerPath, Style } from '../util/util';

// Class that produces SVG.Runners animating linked list operations specific to prepending
export default class LinkedListPrependAnimationProducer extends LinkedListAnimationProducer {
  public createNode(newNode: GraphicalLinkedListNode) {
    newNode.nodeTarget.addTo(CANVAS);
    newNode.nodeTarget.move(0, insertedNodeTopOffset);
    this.addSingleAnimation(newNode.nodeTarget.animate().attr({ opacity: 1 }));
  }

  public newHeadPointToOldHead(newHead: GraphicalLinkedListNode) {
    newHead.pointerTarget.plot(getPointerPath(Style.UP) as any);
    this.addSingleAnimation(newHead.pointerTarget.animate().attr({ opacity: 1 }));
  }
}
