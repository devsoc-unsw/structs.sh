import { Runner } from '@svgdotjs/svg.js';
import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { Style, getPointerPath } from '../util/util';

// Class that produces SVG.Runners animating linked list operations specific to deleting
export default class LinkedListDeleteAnimationProducer extends LinkedListAnimationProducer {
  public setNextToNull(node: GraphicalLinkedListNode) {
    this.addAnimation([node.pointerTarget.animate().attr({ opacity: 0 })]);
  }

  public morphNextPointerToArc(node: GraphicalLinkedListNode) {
    this.addAnimation([
      node.pointerTarget.animate().plot(getPointerPath(Style.CURVED_RIGHT) as any),
    ]);
  }

  public deleteNode(node: GraphicalLinkedListNode) {
    const runners: Runner[] = [];
    runners.push(node.pointerTarget.animate().attr({ opacity: 0 }));
    runners.push(node.nodeTarget.animate().attr({ opacity: 0 }));
    this.addAnimation(runners);
  }
}
