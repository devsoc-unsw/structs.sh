import { Path, Runner } from '@svgdotjs/svg.js';
import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { Style, getPointerPath } from '../util/util';
import { deleteCodeSnippet } from '../util/codeSnippets';

// Class that produces SVG.Runners animating linked list operations specific to deleting
export default class LinkedListDeleteAnimationProducer extends LinkedListAnimationProducer {
  public renderDeleteCode() {
    this.renderCode(deleteCodeSnippet);
  }
  public setNextToNull(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(node.pointerTarget.animate().attr({ opacity: 0 }));
  }

  public setHeadToNull(headPointer: Path) {
    this.addSequenceAnimation(headPointer.animate().attr({ opacity: 0 }));
  }

  public morphNextPointerToArc(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(
      node.pointerTarget.animate().plot(getPointerPath(Style.CURVED_RIGHT) as any)
    );
  }

  public deleteNode(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(node.pointerTarget.animate().attr({ opacity: 0 }));
    this.addSequenceAnimation(node.nodeTarget.animate().attr({ opacity: 0 }));
  }

  public pointHeadToNext(headPointer: Path) {
    this.addSequenceAnimation(
      headPointer.animate().plot(getPointerPath(Style.CURVED_RIGHT) as any)
    );
  }
}
