import BSTAnimationProducer from './BSTAnimationProducer';
import {
  inorderTraversalCodeSnippet,
  preorderTraversalCodeSnippet,
  postorderTraversalCodeSnippet,
} from '../util/codeSnippets';
import GraphicalBSTNode from '../data-structure/GraphicalBSTNode';

export default class BSTTraverseAnimationProducer extends BSTAnimationProducer {
  public renderInorderTraversalCode(): void {
    this.renderCode(inorderTraversalCodeSnippet);
  }

  public renderPreorderTraversalCode(): void {
    this.renderCode(preorderTraversalCodeSnippet);
  }

  public renderPostorderTraversalCode(): void {
    this.renderCode(postorderTraversalCodeSnippet);
  }

  public highlightNode(node: GraphicalBSTNode): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        fill: '#39AF8E',
        stroke: '#39AF8E',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#ffffff',
      })
    );
  }
}
