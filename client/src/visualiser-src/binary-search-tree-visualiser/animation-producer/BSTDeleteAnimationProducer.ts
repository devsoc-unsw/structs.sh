import { Line, Marker } from '@svgdotjs/svg.js';
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
        this.addSequenceAnimation(this.animate(parent.leftLineTarget).attr({ opacity: 0 }));
      } else {
        this.addSequenceAnimation(this.animate(parent.rightLineTarget).attr({ opacity: 0 }));
      }
    }
    this.addSequenceAnimation(this.animate(node.nodeTarget).attr({ opacity: 0 }));
    this.addSequenceAnimation(this.animate(node.textTarget).attr({ opacity: 0 }));
    this.addSequenceAnimation(this.animate(node.leftLineTarget).attr({ opacity: 0 }));
    this.addSequenceAnimation(this.animate(node.leftArrowTarget).attr({ opacity: 0 }));
    this.addSequenceAnimation(this.animate(node.rightLineTarget).attr({ opacity: 0 }));
    this.addSequenceAnimation(this.animate(node.rightArrowTarget).attr({ opacity: 0 }));
  }
}
