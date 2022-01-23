import { SVG, Runner, Element } from '@svgdotjs/svg.js';
import {
  RIGHT_ARROW_PATH, topOffset, nodePathWidth, CURRENT, PREV,
} from '../util/constants';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';

export default abstract class LinkedListAnimationProducer {
  private _allRunners: Runner[][] = [];

  public get allRunners() {
    return this._allRunners;
  }

  public initialisePointer(pointerId: string) {
    const pointerSvg: Element = SVG(pointerId);
    pointerSvg.move(0, topOffset);
    this.allRunners.push([pointerSvg.animate().attr({ opacity: 1 })]);
  }

  public movePointerToNext(pointerId: string) {
    const pointerSvg: Element = SVG(pointerId);
    this.allRunners.push([pointerSvg.animate().dx(nodePathWidth)]);
  }

  private resetPointers() {
    const runners: Runner[] = [];
    runners.push(
      SVG(CURRENT)
        .animate()
        .attr({ opacity: 0 })
        .after(() => SVG(CURRENT).move(0, topOffset)),
    );
    runners.push(
      SVG(PREV)
        .animate()
        .attr({ opacity: 0 })
        .after(() => SVG(PREV).move(0, topOffset)),
    );
    this.allRunners.push(runners);
  }

  public resetList(head: GraphicalLinkedListNode) {
    this.resetPointers();
    const runners: Runner[] = [];
    let curr: GraphicalLinkedListNode = head;
    let index: number = 0;
    while (curr != null) {
      runners.push(curr.nodeTarget.animate().move(index * nodePathWidth, 0));
      runners.push(curr.pointerTarget.animate().plot(RIGHT_ARROW_PATH as any));
      index += 1;
      curr = curr.next;
    }
    this.allRunners.push(runners);
  }
}
