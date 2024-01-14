import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import { appendCodeSnippet } from '../util/codeSnippets';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';

// Class that produces SVG.Runners animating linked list operations specific to appending
export default class LinkedListAppendAnimationProducer extends LinkedListAnimationProducer {
  public renderAppendCode() {
    this.renderCode(appendCodeSnippet);
  }

  public resetPointersAndColor(node: GraphicalLinkedListNode) {
    this.resetPointers();
    this.resetColorNode(node);
  }

  public addNodeAtEnd(newNode: GraphicalLinkedListNode, length: number) {
    // create a new node at the end of the list
    this.createNodeAt(length, newNode, length);
    // then highlight the new node
    this.highlightRightNode(newNode);
  }
}
