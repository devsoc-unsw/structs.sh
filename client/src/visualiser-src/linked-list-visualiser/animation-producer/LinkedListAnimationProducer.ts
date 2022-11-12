import { SVG, Path, Element } from '@svgdotjs/svg.js';
import { topOffset, nodePathWidth, insertedNodeTopOffset, CURRENT, PREV } from '../util/constants';
import { actualNodeDiameter, strokeWidth, nodeDiameter } from '../../common/constants';
import AnimationProducer from '../../common/AnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { getPointerPath } from '../util/util';

// Class that produces SVG.Runners animating general linked list operations
export default class LinkedListAnimationProducer extends AnimationProducer {
  public createNodeAt(index: number, newNode: GraphicalLinkedListNode, length: number) {
    let cx;
    let cy;
    if (index < length - 1) {
      cx = index * nodePathWidth + (3 * actualNodeDiameter) / 2;
      cy = insertedNodeTopOffset;
    } else {
      cx = length * nodePathWidth + actualNodeDiameter / 2;
      cy = topOffset;
    }
    newNode.boxTarget.cx(cx).cy(cy);
    newNode.numberTarget.cx(cx).cy(cy);
    this.addSequenceAnimation(this.animate(newNode.boxTarget).attr({ opacity: 1 }));
    this.addSequenceAnimation(this.animate(newNode.numberTarget).attr({ opacity: 1 }));
  }

  public highlightRightNode(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(this.animate(node.boxTarget).attr({ stroke: '#46B493' }));
    this.addSequenceAnimation(this.animate(node.numberTarget).attr({ fill: '#46B493' }));
  }

  public highlightNotRightNode(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(this.animate(node.boxTarget).attr({ stroke: '#FF0000' }));
    this.addSequenceAnimation(this.animate(node.numberTarget).attr({ fill: '#FF0000' }));
  }

  public removeHighlightNode(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(this.animate(node.boxTarget).attr({ stroke: '#000000' }));
    this.addSequenceAnimation(this.animate(node.numberTarget).attr({ fill: '#000000' }));
  }

  public initialisePointer(pointerId: string) {
    const pointerSvg: Element = SVG(pointerId);
    pointerSvg.move(nodePathWidth + strokeWidth / 2, topOffset + actualNodeDiameter / 2);
    this.addSequenceAnimation(this.animate(pointerSvg).attr({ opacity: 1 }));
  }

  public movePointerToNext(pointerId: string) {
    const pointerSvg: Element = SVG(pointerId);
    this.addSequenceAnimation(this.animate(pointerSvg).dx(nodePathWidth));
  }

  public resetPointers() {
    this.addSequenceAnimation(this.animate(SVG(CURRENT)).attr({ opacity: 0 }));
    this.addSequenceAnimation(this.animate(SVG(PREV)).attr({ opacity: 0 }));
  }

  public resetColorNode(head: GraphicalLinkedListNode) {
    this.addSequenceAnimation(this.animate(head.boxTarget).attr({ stroke: '#000000' }));
    this.addSequenceAnimation(this.animate(head.numberTarget).attr({ fill: '#000000' }));
  }

  public resetPositioning(headPointer: Path, head: GraphicalLinkedListNode) {
    let curr: GraphicalLinkedListNode = head;
    let index: number = 0;
    this.addSequenceAnimation(
      this.animate(headPointer).plot(
        getPointerPath(
          actualNodeDiameter / 2,
          topOffset,
          nodePathWidth + actualNodeDiameter / 2,
          topOffset
        ) as any
      )
    );
    while (curr !== null) {
      const cx = (index + 1) * nodePathWidth + actualNodeDiameter / 2;
      this.addSequenceAnimation(this.animate(curr.boxTarget).cx(cx).cy(topOffset));
      this.addSequenceAnimation(this.animate(curr.numberTarget).cx(cx).cy(topOffset));
      this.addSequenceAnimation(
        this.animate(curr.pointerTarget).plot(
          getPointerPath(cx, topOffset, cx + nodePathWidth, topOffset) as any
        )
      );
      index += 1;
      curr = curr.next;
    }
    this.resetColorNode(head);
  }

  public resetList(headPointer: Path, head: GraphicalLinkedListNode) {
    this.resetPointers();
    this.resetPositioning(headPointer, head);
  }

  public resetPointersAndColor(node: GraphicalLinkedListNode) {
    this.resetPointers();
    this.resetColorNode(node);
  }

  public resetListAndColor(
    headPointer: Path,
    head: GraphicalLinkedListNode,
    node: GraphicalLinkedListNode
  ) {
    this.resetList(headPointer, head);
    this.resetColorNode(node);
  }

  public newHeadPointToOldHead(newHead: GraphicalLinkedListNode) {
    newHead.pointerTarget.plot(
      getPointerPath(newHead.x, newHead.y, newHead.next.x, newHead.next.y) as any
    );
    this.addSequenceAnimation(this.animate(newHead.pointerTarget).attr({ opacity: 1 }));
  }

  public pointHeadToPrependedNode(head: Path, newHead: GraphicalLinkedListNode) {
    this.addSequenceAnimation(
      this.animate(head).plot(
        getPointerPath(nodeDiameter / 2, topOffset, newHead.x, newHead.y) as any
      )
    );
  }

  public initialiseHead(headPointer: Path) {
    this.addSequenceAnimation(this.animate(headPointer).attr({ opacity: 1 }));
  }

  public linkLastToNew(last: GraphicalLinkedListNode) {
    last.pointerTarget.plot(getPointerPath(last.x, last.y, last.next.x, last.next.y) as any);
    this.addSequenceAnimation(this.animate(last.pointerTarget).attr({ opacity: 1 }));
  }
}
