import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import { SVG, Path, Svg } from '@svgdotjs/svg.js';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { Documentation } from 'visualiser-src/common/typedefs';
import { VISUALISER_CANVAS } from 'visualiser-src/common/constants';
import { injectIds } from 'visualiser-src/common/helpers';
import { generateNumbers } from 'visualiser-src/common/RandomNumGenerator';
import currTextPath from '../assets/currTextPath';
import prevTextPath from '../assets/prevTextPath';
import { CURRENT, PREV } from '../util/constants';
import GraphicalLinkedListNode from './GraphicalLinkedListNode';
import LinkedListAppendAnimationProducer from '../animation-producer/LinkedListAppendAnimationProducer';
import LinkedListDeleteAnimationProducer from '../animation-producer/LinkedListDeleteAnimationProducer';
import LinkedListInsertAnimationProducer from '../animation-producer/LinkedListInsertAnimationProducer';
import LinkedListSearchAnimationProducer from '../animation-producer/LinkedListSearchAnimationProducer';
import LinkedListPrependAnimationProducer from '../animation-producer/LinkedListPrependAnimationProducer';
import LinkedListAnimationProducer from '../animation-producer/LinkedListAnimationProducer';

// An linked list data structure containing all linked list operations.
// Every operation producers a LinkedListAnimationProducer, which an VisualiserController
// can then use to place SVG.Runners on a timeline to animate the operation.
export default class GraphicalLinkedList extends GraphicalDataStructure {
  // this is the documentation shows up in the input section
  private static documentation: Documentation = injectIds({
    prepend: {
      args: ['value'],
      description: 'Prepend a node containing the value.',
    },
    append: {
      args: ['value'],
      description: 'Append a node containing the value.',
    },
    insert: {
      args: ['value', 'index'],
      description: 'Insert a value at the given index.',
    },
    search: {
      args: ['value'],
      description: 'Search for a value in the linked list.',
    },
    delete: {
      args: ['index'],
      description: 'Delete a node by the index given.',
    },
  });

  public get data(): number[] {
    const data: number[] = [];
    let curr: GraphicalLinkedListNode | null = this.head;
    while (curr != null) {
      data.push(curr.data.value);
      curr = curr.next;
    }
    return data;
  }

  public load(data: number[]): void {
    const numbers = data;
    this.length = numbers.length;
    const producer = new LinkedListAnimationProducer();
    let currNode = null;
    producer.initialiseHead(this.headPointer);
    for (let i = 0; i < numbers.length; i += 1) {
      const newNode = GraphicalLinkedListNode.from(numbers[i]);
      producer.createNodeAt(i, newNode, i + 1);
      if (currNode === null) {
        this.head = newNode;
      } else {
        currNode.next = newNode;
        producer.linkLastToNew(currNode);
      }
      currNode = newNode;
    }
  }

  public headPointer: Path;

  public head: GraphicalLinkedListNode | null = null;

  public length: number = 0;

  initCurrPrev() {
    const currGroup = (SVG(VISUALISER_CANVAS) as Svg).group().opacity(0).id('current');
    currGroup
      .path('M18 27L25 1L32 27L25 23L18 27Z')
      .fill('#5EEEC3')
      .stroke({ color: '#46B49B', width: 2, linejoin: 'round' });
    currGroup.path(currTextPath).fill('black');
    const prevGroup = (SVG(VISUALISER_CANVAS) as Svg).group().opacity(0).id('prev');
    prevGroup
      .path('M18 27L25 1L32 27L25 23L18 27Z')
      .fill({ color: '#EE5E78', opacity: 0.65 })
      .stroke({ color: '#E85A84', width: 2, linejoin: 'round' });
    prevGroup.path(prevTextPath);
  }

  constructor() {
    super();
    this.headPointer = GraphicalLinkedListNode.newHeadPointer();

    this.initCurrPrev();
  }

  append(input: number): AnimationProducer {
    // now increment the length of list by 1
    this.length += 1;
    const producer = new LinkedListAppendAnimationProducer();
    producer.renderAppendCode();

    // Create new node
    const newNode = GraphicalLinkedListNode.from(input);
    producer.doAnimationAndHighlight(2, producer.addNodeAtEnd, newNode, this.length);

    // Account for case when list is empty
    if (this.head === null) {
      this.head = newNode;
      producer.doAnimationAndHighlight(4, producer.initialiseHead, this.headPointer);
      producer.doAnimationAndHighlight(5, producer.resetPointersAndColor, this.head);

      return producer;
    }

    // Initialise curr
    let curr: GraphicalLinkedListNode = this.head;
    producer.doAnimationAndHighlight(8, producer.initialisePointer, CURRENT);

    // Traverse to last node
    while (curr.next !== null) {
      curr = curr.next;
      producer.doAnimationAndHighlight(10, producer.movePointerToNext, CURRENT);
    }

    // Link last node to new node
    curr.next = newNode;
    producer.doAnimationAndHighlight(13, producer.linkLastToNew, curr);

    producer.doAnimation(producer.resetPointersAndColor, curr.next);
    return producer;
  }

  prepend(input: number): AnimationProducer {
    this.length += 1;
    const producer = new LinkedListPrependAnimationProducer();
    producer.renderPrependCode();
    const newHead: GraphicalLinkedListNode = GraphicalLinkedListNode.from(input);
    producer.doAnimationAndHighlight(2, producer.addNodeFront, newHead, this.length);
    if (this.head === null) {
      this.head = newHead;
      producer.doAnimationAndHighlight(4, producer.initialiseHead, this.headPointer);
    } else {
      newHead.next = this.head;
      producer.doAnimationAndHighlight(3, producer.newHeadPointToOldHead, newHead);
      this.head = newHead;
      producer.doAnimationAndHighlight(
        4,
        producer.pointHeadToPrependedNode,
        this.headPointer,
        newHead
      );
    }
    producer.doAnimation(producer.resetPositioning, this.headPointer, this.head);
    return producer;
  }

  delete(index: number): AnimationProducer {
    // Check index in range
    const producer = new LinkedListDeleteAnimationProducer();
    if (index < 0 || index > this.length - 1) return producer;
    producer.renderDeleteCode();
    this.length -= 1;

    // Look for node to delete
    let curr = this.head;
    producer.doAnimationAndHighlight(3, producer.initialisePointer, CURRENT);
    let prev = null;
    for (let i = 0; i < index; i += 1) {
      prev = curr;
      if (prev === this.head) {
        producer.doAnimationAndHighlight(6, producer.initialisePointerAndHighlight, PREV, prev);
      } else {
        producer.doAnimationAndHighlight(6, producer.movePointerToNextAndHighlight, PREV, prev);
      }
      curr = curr!.next;
      if (i === index - 1) {
        producer.doAnimationAndHighlight(
          7,
          producer.movePointerToNextAndHighlightRight,
          CURRENT,
          curr
        );
      } else {
        producer.doAnimationAndHighlight(7, producer.movePointerToNext, CURRENT);
      }
    }

    if (prev === null) {
      this.head = this.head!.next;
      if (this.head === null) {
        producer.doAnimationAndHighlight(12, producer.setHeadToNull, this.headPointer);
      } else {
        producer.doAnimationAndHighlight(12, producer.pointHeadToNext, this.headPointer, this.head);
      }
    } else {
      prev.next = curr!.next;
      if (prev.next === null) {
        producer.doAnimationAndHighlight(14, producer.setNextToNull, prev);
      } else {
        producer.doAnimationAndHighlight(14, producer.morphNextPointerToArc, prev);
      }
    }
    producer.doAnimationAndHighlight(16, producer.deleteNode, curr);
    producer.doAnimation(producer.resetListAndColor, this.headPointer, this.head);
    return producer;
  }

  search(value: number): AnimationProducer {
    const producer = new LinkedListSearchAnimationProducer();
    producer.renderSearchCode();
    if (this.head === null) {
      return producer;
    }
    let curr: GraphicalLinkedListNode | null = this.head;
    producer.doAnimationAndHighlight(2, producer.initialisePointer, CURRENT);
    while (curr !== null && curr.value !== value) {
      producer.doAnimationAndHighlight(3, producer.indicateNotFound, curr);
      curr = curr.next;
      if (curr !== null) {
        producer.doAnimationAndHighlight(4, producer.movePointerToNext, CURRENT);
      }
    }
    if (curr !== null) {
      producer.doAnimationAndHighlight(3, producer.indicateFound, curr);
    }
    producer.doAnimationAndHighlight(6, producer.resetPointersAndColor, this.head);
    return producer;
  }

  insert(value: number, index: number): AnimationProducer {
    this.length += 1;
    const producer: LinkedListInsertAnimationProducer = new LinkedListInsertAnimationProducer();
    producer.renderInsertCode();

    const newNode: GraphicalLinkedListNode = GraphicalLinkedListNode.from(value);
    producer.doAnimationAndHighlight(2, producer.addNodeAt, index, newNode, this.length);
    if (index === 0 && this.head !== null) {
      newNode.next = this.head;
      this.head = newNode;
      producer.doAnimationAndHighlight(4, producer.newHeadPointToOldHead, newNode);
      producer.doAnimationAndHighlight(
        8,
        producer.pointHeadToPrependedNode,
        this.headPointer,
        newNode
      );
    } else if (this.head === null) {
      producer.doAnimationAndHighlight(8, producer.initialiseHead, this.headPointer);
    }

    if (index === 0 || this.head === null) {
      this.head = newNode;
      producer.doAnimationAndHighlight(9, producer.resetList, this.headPointer, this.head);
      return producer;
    }

    let curr = this.head;
    producer.doAnimationAndHighlight(13, producer.initialisePointer, CURRENT);
    for (let i = 0; i < index - 1 && curr.next !== null; i += 1) {
      curr = curr.next;
      producer.doAnimationAndHighlight(16, producer.movePointerToNext, CURRENT);
    }
    newNode.next = curr.next;
    curr.next = newNode;
    if (index < this.length - 1) {
      producer.doAnimationAndHighlight(19, producer.insertedNodePointToNext, newNode);
      producer.doAnimationAndHighlight(20, producer.pointToInsertedNode, curr);
      producer.doAnimation(producer.resetListAndColor, this.headPointer, this.head, newNode);
    } else {
      producer.doAnimationAndHighlight(20, producer.linkLastToNew, curr);
      producer.doAnimation(producer.resetPointersAndColor, newNode);
    }
    return producer;
  }

  public generate(): void {
    const numbers = generateNumbers();
    this.load(numbers);
  }

  public reset(): void {
    SVG(VISUALISER_CANVAS).clear();

    this.head = null;
    this.length = 0;

    this.headPointer = GraphicalLinkedListNode.newHeadPointer();

    this.initCurrPrev();
  }

  public get documentation() {
    return GraphicalLinkedList.documentation;
  }
}
