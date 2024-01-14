import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import { prependCodeSnippet } from '../util/codeSnippets';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';

// Class that produces SVG.Runners animating linked list operations specific to prepending
export default class LinkedListPrependAnimationProducer extends LinkedListAnimationProducer {
  public renderPrependCode() {
    this.renderCode(prependCodeSnippet);
  }

  public addNodeFront(newNode: GraphicalLinkedListNode, length: number) {
    // create a new node at the end of the list
    this.createNodeAt(0, newNode, length);
    // then highlight the new node
    this.highlightRightNode(newNode);
  }
}
