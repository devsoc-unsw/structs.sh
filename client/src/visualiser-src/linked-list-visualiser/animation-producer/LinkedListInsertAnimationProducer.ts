import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import {
  CANVAS,
  UP_RIGHT_ARROW_PATH,
  DOWN_RIGHT_ARROW_PATH,
  insertedNodeTopOffset,
  nodePathWidth,
  actualNodeWidth,
} from '../util/constants';

export default class LinkedListInsertAnimationProducer extends LinkedListAnimationProducer {
  public insertedNodePointToNext(newNode: GraphicalLinkedListNode) {
    newNode.pointerTarget.plot(UP_RIGHT_ARROW_PATH);
    this.allRunners.push([newNode.pointerTarget.animate().attr({ opacity: 1 })]);
  }

  public pointToInsertedNode(node: GraphicalLinkedListNode) {
    this.allRunners.push([node.pointerTarget.animate().plot(DOWN_RIGHT_ARROW_PATH as any)]);
  }

  public createNodeAt(index: number, newNode: GraphicalLinkedListNode) {
    newNode.nodeTarget.addTo(CANVAS);
    newNode.nodeTarget.move((index - 1) * nodePathWidth + actualNodeWidth, insertedNodeTopOffset);
    this.allRunners.push([newNode.nodeTarget.animate().attr({ opacity: 1 })]);
  }
}
