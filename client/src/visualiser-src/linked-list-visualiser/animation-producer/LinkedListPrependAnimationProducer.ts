import { Path } from '@svgdotjs/svg.js';
import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import { CANVAS, insertedNodeTopOffset, topOffset } from '../util/constants';
import { actualNodeDiameter } from '../../common/constants';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { getPointerPath, Style } from '../util/util';

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
