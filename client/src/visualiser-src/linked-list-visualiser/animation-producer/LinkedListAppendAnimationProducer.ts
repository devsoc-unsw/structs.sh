import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { CANVAS, nodePathWidth } from '../util/constants';

export default class LinkedListAppendAnimationProducer extends LinkedListAnimationProducer {
  linkLastToNew(last: GraphicalLinkedListNode) {
    this.allRunners.push([last.pointerTarget.animate().attr({ opacity: 1 })]);
  }

  addNodeAtEnd(length: number, newNode: GraphicalLinkedListNode) {
    newNode.nodeTarget.addTo(CANVAS);
    newNode.nodeTarget.move((length - 1) * nodePathWidth, 0);
    this.allRunners.push([newNode.nodeTarget.animate().attr({ opacity: 1 })]);
  }
}
