import { Path } from '@svgdotjs/svg.js';
import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { Style, getPointerPath } from '../util/util';
import { deleteCodeSnippet } from '../util/codeSnippets';
import { topOffset } from '../util/constants';

// Class that produces SVG.Runners animating linked list operations specific to deleting
export default class LinkedListDeleteAnimationProducer extends LinkedListAnimationProducer {
  public renderDeleteCode() {
    this.renderCode(deleteCodeSnippet);
  }

  public setNextToNull(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(this.animate(node.pointerTarget).attr({ opacity: 0 }));
  }

  public setHeadToNull(headPointer: Path) {
    this.addSequenceAnimation(this.animate(headPointer).attr({ opacity: 0 }));
  }

  public morphNextPointerToArc(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(
      this.animate(node.pointerTarget).plot(
        getPointerPath(node.x, node.y, node.next.x, node.next.y, Style.CURVED) as any
      )
    );
  }

  public deleteNode(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(this.animate(node.pointerTarget).attr({ opacity: 0 }));
    this.addSequenceAnimation(this.animate(node.numberTarget).attr({ opacity: 0 }));
    this.addSequenceAnimation(this.animate(node.boxTarget).attr({ opacity: 0 }));
  }

  public pointHeadToNext(headPointer: Path, next: GraphicalLinkedListNode) {
    this.addSequenceAnimation(
      this.animate(headPointer).plot(
        getPointerPath(0, topOffset, next.x, next.y, Style.CURVED) as any
      )
    );
  }

  public movePointerToNextAndHighlight(pointerId: string, node: GraphicalLinkedListNode): void {
    this.movePointerToNext(pointerId);
    this.highlightNotRightNode(node);
  }

  public movePointerToNextAndHighlightRight(
    pointerId: string,
    node: GraphicalLinkedListNode
  ): void {
    this.highlightRightNode(node);
    this.movePointerToNext(pointerId);
  }

  public initialisePointerAndHighlight(pointerId: string, node: GraphicalLinkedListNode) {
    this.initialisePointer(pointerId);
    this.highlightNotRightNode(node);
  }

  public resetListAndColor(headPointer: Path, head: GraphicalLinkedListNode) {
    this.resetList(headPointer, head);
    let curr = head;
    while (curr != null) {
      this.addSequenceAnimation(this.animate(curr.boxTarget).attr({ stroke: '#000000' }));
      this.addSequenceAnimation(this.animate(curr.numberTarget).attr({ fill: '#000000' }));
      curr = curr.next;
    }
  }
}
