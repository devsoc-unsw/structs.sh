import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import { SVG, Path, Container } from '@svgdotjs/svg.js';
import { CURRENT, PREV } from '../util/constants';
import GraphicalLinkedListNode from './GraphicalLinkedListNode';
import LinkedListAppendAnimationProducer from '../animation-producer/LinkedListAppendAnimationProducer';
import LinkedListDeleteAnimationProducer from '../animation-producer/LinkedListDeleteAnimationProducer';
import LinkedListInsertAnimationProducer from '../animation-producer/LinkedListInsertAnimationProducer';
import LinkedListSearchAnimationProducer from '../animation-producer/LinkedListSearchAnimationProducer';
import LinkedListPrependAnimationProducer from '../animation-producer/LinkedListPrependAnimationProducer';
import { render } from '@testing-library/react';

// An linked list data structure containing all linked list operations.
// Every operation producers a LinkedListAnimationProducer, which an AnimationController
// can then use to place SVG.Runners on a timeline to animate the operation.
export default class GraphicalLinkedList {
  public headPointer: Path;

  public head: GraphicalLinkedListNode = null;

  public length: number = 0;

  public codeCanvas: Container = SVG().addTo('#code-canvas').size('100%', 1000);

  constructor() {
    this.headPointer = GraphicalLinkedListNode.newHeadPointer();
  }

  append(input: number): AnimationProducer {
    this.length += 1;
    const producer = new LinkedListAppendAnimationProducer(this.codeCanvas);
    // Create new node
    const newNode = GraphicalLinkedListNode.from(input);
    producer.addNodeAtEnd(this.length, newNode);

    // Account for case when list is empty
    if (this.head === null) {
      this.head = newNode;
      producer.initialiseHead(this.headPointer);
      return producer;
    }

    // Initialise curr
    let curr: GraphicalLinkedListNode = this.head;
    producer.initialisePointer(CURRENT);

    // Traverse to last node
    while (curr.next !== null) {
      curr = curr.next;
      producer.movePointerToNext(CURRENT);
    }

    // Link last node to new node
    curr.next = newNode;
    producer.linkLastToNew(curr);

    // Reset pointers
    producer.resetPointers();
    return producer;
  }

  prepend(input: number): AnimationProducer {
    this.codeCanvas.clear();
    if (this.length === 0) {
      return this.append(input);
    }
    this.length += 1;
    const producer = new LinkedListPrependAnimationProducer(this.codeCanvas);
    const newHead: GraphicalLinkedListNode = GraphicalLinkedListNode.from(input);
    producer.createNodeAt(0, newHead, this.length);
    newHead.next = this.head;
    producer.newHeadPointToOldHead(newHead);
    this.head = newHead;
    producer.pointHeadToPrependedNode(this.headPointer);
    producer.resetPositioning(this.headPointer, this.head);
    return producer;
  }

  delete(index: number): AnimationProducer {
    this.codeCanvas.clear();
    // Check index in range
    const producer = new LinkedListDeleteAnimationProducer(this.codeCanvas);
    if (index < 0 || index > this.length - 1) return producer;
    this.length -= 1;

    // Look for node to delete
    let curr = this.head;
    producer.initialisePointer(CURRENT);
    let prev = null;
    for (let i = 0; i < index; i += 1) {
      prev = curr;
      if (prev === this.head) {
        producer.initialisePointer(PREV);
      } else {
        producer.movePointerToNext(PREV);
      }
      curr = curr.next;
      producer.movePointerToNext(CURRENT);
    }

    if (prev !== null) {
      prev.next = curr.next;
      if (prev.next === null) {
        producer.setNextToNull(prev);
      } else {
        producer.morphNextPointerToArc(prev);
      }
    } else {
      this.head = this.head.next;
      if (this.head !== null) {
        producer.pointHeadToNext(this.headPointer);
      } else {
        producer.setHeadToNull(this.headPointer);
      }
    }
    producer.deleteNode(curr);
    producer.resetList(this.headPointer, this.head);
    return producer;
  }

  search(value: number): AnimationProducer {
    const producer = new LinkedListSearchAnimationProducer(this.codeCanvas);
    if (this.head === null) {
      return producer;
    }
    let curr = this.head;
    producer.initialisePointer(CURRENT);
    while (curr !== null && curr.value !== value) {
      producer.indicateNotFound(curr);
      curr = curr.next;
      if (curr !== null) {
        producer.movePointerToNext(CURRENT);
      }
    }
    if (curr !== null) {
      producer.indicateFound(curr);
    }
    producer.resetColor(this.head);
    return producer;
  }

  insert(value: number, index: number): AnimationProducer {
    this.length += 1;
    const producer: LinkedListInsertAnimationProducer = new LinkedListInsertAnimationProducer(
      this.codeCanvas
    );
    producer.renderInsertCode();

    const newNode: GraphicalLinkedListNode = GraphicalLinkedListNode.from(value);
    producer.doAnimationAndHighlight(1, producer.createNodeAt, index, newNode, this.length);
    if (index === 0 && this.head !== null) {
      newNode.next = this.head;
      producer.doAnimationAndHighlight(3, producer.newHeadPointToOldHead, newNode);
      producer.doAnimationAndHighlight(7, producer.pointHeadToPrependedNode, this.headPointer);
      producer.doAnimation(producer.resetList, this.headPointer, this.head);
    } else if (this.head === null) {
      producer.doAnimationAndHighlight(7, producer.initialiseHead, this.headPointer);
    }

    if (index === 0 || this.head === null) {
      this.head = newNode;
      return producer;
    }

    let curr = this.head;
    producer.doAnimationAndHighlight(10, producer.initialisePointer, CURRENT);
    for (let i = 0; i < index - 1 && curr.next !== null; i += 1) {
      curr = curr.next;
      producer.doAnimationAndHighlight(13, producer.movePointerToNext, CURRENT);
    }
    newNode.next = curr.next;
    if (index < this.length - 1) {
      producer.doAnimationAndHighlight(16, producer.insertedNodePointToNext, newNode);
    }
    curr.next = newNode;
    if (index < this.length - 1) {
      producer.doAnimationAndHighlight(17, producer.pointToInsertedNode, curr);
    } else {
      producer.doAnimationAndHighlight(17, producer.linkLastToNew, curr);
    }

    if (index < this.length - 1) {
      producer.doAnimation(producer.resetList, this.headPointer, this.head);
    } else {
      producer.doAnimation(producer.resetPointers);
    }
    return producer;
  }
}
