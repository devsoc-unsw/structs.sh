import { SVG, Path, Element } from '@svgdotjs/svg.js';
import { topOffset, nodePathWidth, CURRENT, PREV } from '../util/constants';
import { actualNodeDiameter } from '../../common/constants';
import AnimationProducer from '../../common/AnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { getPointerPath, Style } from '../util/util';

// Class that produces SVG.Runners animating general linked list operations
export default abstract class LinkedListAnimationProducer extends AnimationProducer {
  public initialisePointer(pointerId: string) {
    const pointerSvg: Element = SVG(pointerId);
    pointerSvg.move(nodePathWidth, topOffset + actualNodeDiameter / 2);
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

  public resetPositioning(headPointer: Path, head: GraphicalLinkedListNode) {
    let curr: GraphicalLinkedListNode = head;
    let index: number = 0;
    this.addSequenceAnimation(headPointer.animate().plot(getPointerPath(Style.RIGHT) as any));
    while (curr != null) {
      this.addSequenceAnimation(curr.nodeTarget.animate().move((index + 1) * nodePathWidth, 0));
      this.addSequenceAnimation(
        curr.pointerTarget.animate().plot(getPointerPath(Style.RIGHT) as any)
      );
      index += 1;
      curr = curr.next;
    }
    this.finishSequence();
  }

  public resetList(headPointer: Path, head: GraphicalLinkedListNode) {
    this.resetPointers();
    this.resetPositioning(headPointer, head);
  }
}
