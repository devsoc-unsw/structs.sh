import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { CANVAS, insertedNodeTopOffset, nodePathWidth, topOffset } from '../util/constants';
import { actualNodeDiameter } from '../../common/constants';
import { getPointerPath, Style } from '../util/util';

// Class that produces SVG.Runners animating linked list operations specific to inserting
export default class LinkedListInsertAnimationProducer extends LinkedListAnimationProducer {
  public insertedNodePointToNext(newNode: GraphicalLinkedListNode) {
    newNode.pointerTarget.plot(getPointerPath(Style.UP_RIGHT) as any);
    this.addSingleAnimation(newNode.pointerTarget.animate().attr({ opacity: 1 }));
  }

  public pointToInsertedNode(node: GraphicalLinkedListNode) {
    this.addSingleAnimation(
      node.pointerTarget.animate().plot(getPointerPath(Style.DOWN_RIGHT) as any)
    );
  }

  public createNodeAt(index: number, newNode: GraphicalLinkedListNode) {
    newNode.nodeTarget.addTo(CANVAS);
    newNode.nodeTarget.move(
      index * nodePathWidth + actualNodeDiameter,
      insertedNodeTopOffset - topOffset
    );
    this.addSingleAnimation(newNode.nodeTarget.animate().attr({ opacity: 1 }));
  }
}
