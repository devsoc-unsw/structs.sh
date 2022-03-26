import { SVG, Runner, Element } from '@svgdotjs/svg.js';
import { topOffset, nodePathWidth, CURRENT, PREV, actualNodeDiameter } from '../util/constants';
import AnimationProducer from '../../common/AnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { getPointerPath, Style } from '../util/util';

// Class that produces SVG.Runners animating general linked list operations
export default abstract class LinkedListAnimationProducer extends AnimationProducer {
  public initialisePointer(pointerId: string) {
    const pointerSvg: Element = SVG(pointerId);
    pointerSvg.move(0, topOffset + actualNodeDiameter / 2);
    this.addAnimation([pointerSvg.animate().attr({ opacity: 1 })]);
  }

  public movePointerToNext(pointerId: string) {
    const pointerSvg: Element = SVG(pointerId);
    this.addAnimation([pointerSvg.animate().dx(nodePathWidth)]);
  }

  public resetPointers() {
    const runners: Runner[] = [];
    runners.push(SVG(CURRENT).animate().attr({ opacity: 0 }));
    runners.push(SVG(PREV).animate().attr({ opacity: 0 }));
    this.addAnimation(runners);
  }

  public resetPositioning(head: GraphicalLinkedListNode) {
    const runners: Runner[] = [];
    let curr: GraphicalLinkedListNode = head;
    let index: number = 0;
    while (curr != null) {
      runners.push(curr.nodeTarget.animate().move(index * nodePathWidth, 0));
      runners.push(curr.pointerTarget.animate().plot(getPointerPath(Style.RIGHT) as any));
      index += 1;
      curr = curr.next;
    }
    this.addAnimation(runners);
  }

  public resetList(head: GraphicalLinkedListNode) {
    this.resetPointers();
    this.resetPositioning(head);
  }
}
