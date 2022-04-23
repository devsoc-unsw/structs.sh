import { SVG, Path, Element, Container } from '@svgdotjs/svg.js';
import {
  topOffset,
  nodePathWidth,
  insertedNodeTopOffset,
  CANVAS,
  CURRENT,
  PREV,
} from '../util/constants';
import { actualNodeDiameter } from '../../common/constants';
import AnimationProducer from '../../common/AnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { getPointerPath, Style } from '../util/util';

// Class that produces SVG.Runners animating general linked list operations
export default abstract class LinkedListAnimationProducer extends AnimationProducer {
  public constructor(codeCanvas: Container) {
    super();
    this.codeCanvas = codeCanvas;

    this.codeCanvas.clear();
  }

  public createNodeAt(index: number, newNode: GraphicalLinkedListNode, length: number) {
    console.log(newNode);
    if (index < length - 1) {
      newNode.nodeTarget.addTo(CANVAS);
      newNode.nodeTarget.move(
        index * nodePathWidth + actualNodeDiameter,
        insertedNodeTopOffset - topOffset
      );
      this.addSequenceAnimation(newNode.nodeTarget.animate().attr({ opacity: 1 }));
    } else {
      this.addNodeAtEnd(length, newNode);
    }
  }

  public addNodeAtEnd(length: number, newNode: GraphicalLinkedListNode) {
    newNode.nodeTarget.addTo(CANVAS);
    newNode.nodeTarget.move(length * nodePathWidth, 0);
    this.addSequenceAnimation(newNode.nodeTarget.animate().attr({ opacity: 1 }));
  }

  public initialisePointer(pointerId: string) {
    const pointerSvg: Element = SVG(pointerId);
    pointerSvg.move(nodePathWidth, topOffset + actualNodeDiameter / 2);
    this.addSequenceAnimation(pointerSvg.animate().attr({ opacity: 1 }));
  }

  public movePointerToNext(pointerId: string) {
    const pointerSvg: Element = SVG(pointerId);
    this.addSequenceAnimation(pointerSvg.animate().dx(nodePathWidth));
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

  public newHeadPointToOldHead(newHead: GraphicalLinkedListNode) {
    newHead.pointerTarget.plot(getPointerPath(Style.UP_RIGHT) as any);
    this.addSequenceAnimation(newHead.pointerTarget.animate().attr({ opacity: 1 }));
  }

  public pointHeadToPrependedNode(head: Path) {
    this.addSequenceAnimation(head.animate().plot(getPointerPath(Style.DOWN_RIGHT) as any));
  }

  public initialiseHead(headPointer: Path) {
    this.addSequenceAnimation(headPointer.animate().attr({ opacity: 1 }));
  }
  public linkLastToNew(last: GraphicalLinkedListNode) {
    this.addSequenceAnimation(last.pointerTarget.animate().attr({ opacity: 1 }));
  }
}
