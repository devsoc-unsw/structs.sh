import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';
import { getPointerPath, Style } from '../util/util';
import { insertCodeSnippet } from '../util/codeSnippets';

// Class that produces SVG.Runners animating linked list operations specific to inserting
export default class LinkedListInsertAnimationProducer extends LinkedListAnimationProducer {
  public renderInsertCode(): void {
    this.renderCode(insertCodeSnippet);
  }

  public insertedNodePointToNext(newNode: GraphicalLinkedListNode) {
    if (newNode.next !== null) {
      newNode.pointerTarget.plot(getPointerPath(Style.UP_RIGHT) as any);
      this.addSequenceAnimation(newNode.pointerTarget.animate().attr({ opacity: 1 }));
    }
  }

  public pointToInsertedNode(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(
      node.pointerTarget.animate().plot(getPointerPath(Style.DOWN_RIGHT) as any)
    );
  }
}
