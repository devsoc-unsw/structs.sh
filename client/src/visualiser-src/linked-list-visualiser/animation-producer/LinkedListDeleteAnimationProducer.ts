import { Runner } from '@svgdotjs/svg.js';
import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { BENT_ARROW_PATH } from '../util/constants';

// Class that produces SVG.Runners animating linked list operations specific to deleting
export default class LinkedListDeleteAnimationProducer extends LinkedListAnimationProducer {
  public setNextToNull(node: GraphicalLinkedListNode) {
    this.addSingleAnimation(node.pointerTarget.animate().attr({ opacity: 0 }));
  }

  public morphNextPointerToArc(node: GraphicalLinkedListNode) {
    this.addSingleAnimation(node.pointerTarget.animate().plot(BENT_ARROW_PATH as any));
  }

  public deleteNode(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(node.pointerTarget.animate().attr({ opacity: 0 }));
    this.addSequenceAnimation(node.nodeTarget.animate().attr({ opacity: 0 }));
    this.finishSequence();
  }
}
