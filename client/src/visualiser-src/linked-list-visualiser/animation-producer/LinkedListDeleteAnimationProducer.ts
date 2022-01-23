import { Runner } from '@svgdotjs/svg.js';
import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { BENT_ARROW_PATH } from '../util/constants';

export default class LinkedListDeleteAnimationProducer extends LinkedListAnimationProducer {
  setNextToNull(node: GraphicalLinkedListNode) {
    this.allRunners.push([node.pointerTarget.animate().attr({ opacity: 0 })]);
  }

  morphNextPointerToArc(node: GraphicalLinkedListNode) {
    this.allRunners.push([node.pointerTarget.animate().attr({ d: BENT_ARROW_PATH })]);
  }

  deleteNode(node: GraphicalLinkedListNode) {
    const runners: Runner[] = [];
    runners.push(node.pointerTarget.animate().attr({ opacity: 0 }));
    runners.push(node.nodeTarget.animate().attr({ opacity: 0 }));
    this.allRunners.push(runners);
  }
}
