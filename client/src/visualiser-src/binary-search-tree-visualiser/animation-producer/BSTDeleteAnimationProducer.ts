import BSTAnimationProducer from './BSTAnimationProducer';
import { deleteCodeSnippet } from '../util/codeSnippets';
import GraphicalBSTNode from '../data-structure/GraphicalBSTNode';

export default class BSTDeleteAnimationProducer extends BSTAnimationProducer {
  public renderDeleteCode(): void {
    this.renderCode(deleteCodeSnippet);
  }

  public freeNode(
    node: GraphicalBSTNode,
    parent: GraphicalBSTNode,
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
