import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { getPointerPath } from '../util/util';
import { insertCodeSnippet } from '../util/codeSnippets';

// Class that produces SVG.Runners animating linked list operations specific to inserting
export default class LinkedListInsertAnimationProducer extends LinkedListAnimationProducer {
  public renderInsertCode(): void {
    this.renderCode(insertCodeSnippet);
  }

  public addNodeAt(index: number, newNode: GraphicalLinkedListNode, length: number) {
    // create a new node at the end of the list
    this.createNodeAt(index, newNode, length);
    // then highlight the new node
    this.highlightRightNode(newNode);
  }

  public insertedNodePointToNext(newNode: GraphicalLinkedListNode) {
    if (newNode.next !== null) {
      newNode.pointerTarget.plot(
        getPointerPath(newNode.x, newNode.y, newNode.next.x, newNode.next.y) as any
      );
      this.addSequenceAnimation(newNode.pointerTarget.animate().attr({ opacity: 1 }));
    }
  }

  public pointToInsertedNode(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(
      node.pointerTarget
        .animate()
        .plot(getPointerPath(node.x, node.y, node.next!.x, node.next!.y) as any)
    );
  }
}
