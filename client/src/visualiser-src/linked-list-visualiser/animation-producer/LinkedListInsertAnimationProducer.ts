import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import {
  CANVAS,
  insertedNodeTopOffset,
  nodePathWidth,
  actualNodeDiameter,
} from '../util/constants';
import { getPointerPath, Style } from '../util/util';

// Class that produces SVG.Runners animating linked list operations specific to inserting
export default class LinkedListInsertAnimationProducer extends LinkedListAnimationProducer {
  public insertedNodePointToNext(newNode: GraphicalLinkedListNode) {
    newNode.pointerTarget.plot(getPointerPath(Style.UP_RIGHT) as any);
    this.addAnimation([newNode.pointerTarget.animate().attr({ opacity: 1 })]);
  }

  public pointToInsertedNode(node: GraphicalLinkedListNode) {
    this.addAnimation([node.pointerTarget.animate().plot(getPointerPath(Style.DOWN_RIGHT) as any)]);
  }

  public createNodeAt(index: number, newNode: GraphicalLinkedListNode) {
    newNode.nodeTarget.addTo(CANVAS);
    newNode.nodeTarget.move(
      (index - 1) * nodePathWidth + actualNodeDiameter,
      insertedNodeTopOffset
    );
    console.log(insertedNodeTopOffset);
    this.addAnimation([newNode.nodeTarget.animate().attr({ opacity: 1 })]);
  }
}
