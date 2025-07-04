import BSTInsertAnimationProducer from 'visualiser-src/binary-search-tree-visualiser/animation-producer/BSTInsertAnimationProducer';
import { insertCodeSnippet, deleteCodeSnippet } from '../util/codeSnippets';
import GraphicalAVLNode from '../data-structure/GraphicalAVLNode';

export default class AVLAnimationProducer extends BSTInsertAnimationProducer {
  public renderInsertCode(): void {
    this.renderCode(insertCodeSnippet);
  }

  public renderDeleteCode(): void {
    this.renderCode(deleteCodeSnippet);
  }

  public unhighlightNodeAndPointers(node: GraphicalAVLNode): void {
    this.unhighlightLine(node.leftLineTarget, node.leftArrowTarget);
    this.unhighlightLine(node.rightLineTarget, node.rightArrowTarget);
    this.unhighlightNode(node);
  }

  public freeNode(
    node: GraphicalAVLNode,
    parent: GraphicalAVLNode,
    shouldHideParentPointer: boolean
  ) {
    if (parent !== null && shouldHideParentPointer) {
      if (node === parent.left) {
        this.addSequenceAnimation(parent.leftLineTarget.animate().attr({ opacity: 0 }));
      } else {
        this.addSequenceAnimation(parent.rightLineTarget.animate().attr({ opacity: 0 }));
      }
    }
    this.addSequenceAnimation(node.nodeTarget.animate().attr({ opacity: 0 }));
    this.addSequenceAnimation(node.textTarget.animate().attr({ opacity: 0 }));
    this.addSequenceAnimation(node.leftLineTarget.animate().attr({ opacity: 0 }));
    this.addSequenceAnimation(node.leftArrowTarget.animate().attr({ opacity: 0 }));
    this.addSequenceAnimation(node.rightLineTarget.animate().attr({ opacity: 0 }));
    this.addSequenceAnimation(node.rightArrowTarget.animate().attr({ opacity: 0 }));
  }
}
