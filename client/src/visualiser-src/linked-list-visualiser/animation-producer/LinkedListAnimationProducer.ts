import { SVG, Runner, Element } from '@svgdotjs/svg.js';
import {
  RIGHT_ARROW_PATH, topOffset, nodePathWidth, CURRENT, PREV,
} from '../util/constants';
import AnimationProducer from '../../common/AnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';

// Class that produces SVG.Runners animating general linked list operations
export default abstract class LinkedListAnimationProducer extends AnimationProducer {
  public initialisePointer(pointerId: string) {
    const pointerSvg: Element = SVG(pointerId);
    pointerSvg.move(0, topOffset);
    this.addSingleAnimation(pointerSvg.animate().attr({ opacity: 1 }));
  }

  public movePointerToNext(pointerId: string) {
    const pointerSvg: Element = SVG(pointerId);
    this.addSingleAnimation(pointerSvg.animate().dx(nodePathWidth));
  }

  public resetPointers() {
    this.addSequenceAnimation(SVG(CURRENT).animate().attr({ opacity: 0 }));
    this.addSequenceAnimation(SVG(PREV).animate().attr({ opacity: 0 }));
    this.finishSequence();
  }

  public resetPositioning(head: GraphicalLinkedListNode) {
    let curr: GraphicalLinkedListNode = head;
    let index: number = 0;
    while (curr != null) {
      this.addSequenceAnimation(curr.nodeTarget.animate().move(index * nodePathWidth, 0));
      this.addSequenceAnimation(curr.pointerTarget.animate().plot(RIGHT_ARROW_PATH as any));
      index += 1;
      curr = curr.next;
    }
    this.finishSequence();
  }

  public resetList(head: GraphicalLinkedListNode) {
    this.resetPointers();
    this.resetPositioning(head);
  }
}
