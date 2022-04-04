import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import { actualNodeDiameter, CANVAS, insertedNodeTopOffset, topOffset } from '../util/constants';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { getPointerPath, Style } from '../util/util';
import { Path } from '@svgdotjs/svg.js';

// Class that produces SVG.Runners animating linked list operations specific to prepending
export default class LinkedListPrependAnimationProducer extends LinkedListAnimationProducer {
  public createNode(newNode: GraphicalLinkedListNode) {
    newNode.nodeTarget.addTo(CANVAS);
    newNode.nodeTarget.move(actualNodeDiameter, insertedNodeTopOffset - topOffset);

    this.addSingleAnimation(newNode.nodeTarget.animate().attr({ opacity: 1 }));
  }

  public newHeadPointToOldHead(newHead: GraphicalLinkedListNode) {
    newHead.pointerTarget.plot(getPointerPath(Style.UP_RIGHT) as any);
    this.addSingleAnimation(newHead.pointerTarget.animate().attr({ opacity: 1 }));
  }

  public pointHeadToPrependedNode(head: Path) {
    this.addSingleAnimation(head.animate().plot(getPointerPath(Style.DOWN_RIGHT) as any));
  }
}
