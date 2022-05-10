import BSTAnimationProducer from './BSTAnimationProducer';
import { Node } from '../util/typedefs';
import {
  inorderTraversalCodeSnippet,
  preorderTraversalCodeSnippet,
  postorderTraversalCodeSnippet,
} from '../util/codeSnippets';

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

  public highlightNode(node: Node): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        fill: '#4beb9b',
        stroke: '#4beb9b',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#ffffff',
      })
    );
  }
}
